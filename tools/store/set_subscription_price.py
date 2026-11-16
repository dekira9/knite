#!/usr/bin/env python3
"""Set the new-buyer price of any subscription on App Store and Google Play.

Reads credentials from ~/bare/.secrets/store/ (STORE_SECRETS_DIR). Does not touch the mobile app.
Existing subscribers keep their current price (Apple preserveCurrentPrice,
Play price update without migratePrices).

Apple cannot replace the original price of an approved subscription. One
PATCH /v1/subscriptions/{id} schedules every territory: included prices use
ids like ${p0}, a future startDate, and the equalized price point. Existing
price ids must stay out of that body. Territories already on the same price
point are left unchanged. If that PATCH is rejected, the script falls back
to one POST /v1/subscriptionPrices per territory.

Usage (from the repo root or tools/store):

  python3 tools/store/set_subscription_price.py --show \\
    --apple-product year_discounted \\
    --play year_sub_discounted:p1yd

  python3 tools/store/set_subscription_price.py --usd 39.99 --dry-run \\
    --apple-product year_discounted year_discounted_trial \\
    --play year_sub_discounted:p1yd year_sub_discounted_trial:y1pd

  python3 tools/store/set_subscription_price.py --usd 39.99 \\
    --start-date 2026-10-20 \\
    --apple-product year_discounted \\
    --play year_sub_discounted:p1yd
"""

from __future__ import annotations

import argparse
import base64
import json
import sys
import threading
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import date, datetime, timedelta, timezone
from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path

import jwt
import requests
from google.auth.transport.requests import Request
from google.oauth2 import service_account

sys.path.insert(0, str(Path(__file__).resolve().parent))
from credentials import (  # noqa: E402
    APPS_DIR,
    google_service_account_file,
    load_apple_auth,
)

APPLE_API = "https://api.appstoreconnect.apple.com/v1"
PLAY_API = "https://androidpublisher.googleapis.com/androidpublisher/v3"
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(line_buffering=True)


def log(message: str) -> None:
    print(message, flush=True)


def money_amount(raw: str) -> Decimal:
    return Decimal(str(raw)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def usd_google_price(raw: str) -> dict:
    amount = money_amount(raw)
    units = int(amount)
    nanos = int((amount - Decimal(units)) * Decimal("1000000000"))
    return {"currencyCode": "USD", "units": str(units), "nanos": nanos}


def format_google_price(price: dict | None) -> str:
    if not price:
        return "-"
    units = Decimal(price.get("units") or "0")
    nanos = Decimal(int(price.get("nanos") or 0)) / Decimal("1000000000")
    amount = (units + nanos).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    return f"{price.get('currencyCode')} {amount}"


def territory_of_price_point(price_point_id: str) -> str:
    padded = price_point_id + "=" * (-len(price_point_id) % 4)
    payload = json.loads(base64.b64decode(padded))
    return payload.get("t") or ""


class Pace:
    """Start at most `per_second` requests. Keeps a price push under Apple's hour cap."""

    def __init__(self, per_second: float) -> None:
        self.interval = 1.0 / per_second
        self._lock = threading.Lock()
        self._next = 0.0

    def wait(self) -> None:
        with self._lock:
            now = time.monotonic()
            slot = max(now, self._next)
            self._next = slot + self.interval
            delay = slot - now
        if delay > 0:
            time.sleep(delay)


class Apple:
    def __init__(self, per_second: float) -> None:
        auth = load_apple_auth()
        self._issuer = auth["issuer_id"]
        self._key_id = auth["key_id"]
        self._private_key = auth["private_key"]
        self._token = ""
        self._token_exp = 0
        self._token_lock = threading.Lock()
        self._local = threading.local()
        self._pace = Pace(per_second)
        self._limit_printed = False
        self._limit_lock = threading.Lock()

    def _headers(self) -> dict:
        with self._token_lock:
            now = int(time.time())
            if now >= self._token_exp - 60:
                exp = now + 15 * 60
                self._token = jwt.encode(
                    {"iss": self._issuer, "exp": exp, "aud": "appstoreconnect-v1"},
                    self._private_key,
                    algorithm="ES256",
                    headers={"alg": "ES256", "kid": self._key_id, "typ": "JWT"},
                )
                self._token_exp = exp
            token = self._token
        return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

    def _session(self) -> requests.Session:
        session = getattr(self._local, "session", None)
        if session is None:
            session = requests.Session()
            session.trust_env = False
            self._local.session = session
        return session

    def request(self, method: str, url: str, **kwargs) -> requests.Response:
        if url.startswith("/"):
            url = APPLE_API + url
        timeout = kwargs.pop("timeout", 45)
        self._pace.wait()
        response = self._session().request(
            method, url, headers=self._headers(), timeout=timeout, **kwargs
        )
        self._note_limit(response)
        if response.status_code == 401:
            with self._token_lock:
                self._token_exp = 0
            self._pace.wait()
            response = self._session().request(
                method, url, headers=self._headers(), timeout=timeout, **kwargs
            )
            self._note_limit(response)
        return response

    def _note_limit(self, response: requests.Response) -> None:
        header = response.headers.get("X-Rate-Limit")
        if not header:
            return
        with self._limit_lock:
            if self._limit_printed:
                return
            self._limit_printed = True
        log(f"apple X-Rate-Limit {header.strip()}")

    def get_json(self, url: str, **kwargs) -> dict:
        response = self.request("GET", url, **kwargs)
        if response.status_code != 200:
            raise RuntimeError(f"GET {url} {response.status_code} {response.text[:240]}")
        return response.json()

    def product_ids(self, app_id: str) -> dict[str, str]:
        body = self.get_json(
            f"/apps/{app_id}/subscriptionGroups",
            params={"include": "subscriptions", "limit": 200},
        )
        found: dict[str, str] = {}
        for item in body.get("included") or []:
            if item.get("type") != "subscriptions":
                continue
            product_id = (item.get("attributes") or {}).get("productId")
            if product_id:
                found[product_id] = item["id"]
        if found:
            return found
        for group in body.get("data") or []:
            page = f"/subscriptionGroups/{group['id']}/subscriptions"
            params: dict | None = {"limit": 200}
            while page:
                chunk = self.get_json(page, params=params)
                for item in chunk.get("data") or []:
                    product_id = (item.get("attributes") or {}).get("productId")
                    if product_id:
                        found[product_id] = item["id"]
                page = (chunk.get("links") or {}).get("next")
                params = None
        return found

    def us_price_point(self, subscription_id: str, usd: str) -> tuple[str, list[str]]:
        target = money_amount(usd)
        seen: list[Decimal] = []
        url = f"/subscriptions/{subscription_id}/pricePoints"
        params: dict | None = {"filter[territory]": "USA", "limit": 200}
        while url:
            body = self.get_json(url, params=params)
            for item in body.get("data") or []:
                raw = (item.get("attributes") or {}).get("customerPrice")
                if raw is None:
                    continue
                amount = money_amount(raw)
                if amount == target:
                    return item["id"], []
                seen.append(amount)
            url = (body.get("links") or {}).get("next")
            params = None
        nearest = sorted(seen, key=lambda value: abs(value - target))[:5]
        return "", [str(value) for value in nearest]

    def equalization_ids(self, us_price_point_id: str) -> list[str]:
        ids: list[str] = []
        url = f"/subscriptionPricePoints/{us_price_point_id}/equalizations"
        params: dict | None = {"limit": 200}
        while url:
            body = self.get_json(url, params=params)
            ids.extend(item["id"] for item in body.get("data") or [])
            url = (body.get("links") or {}).get("next")
            params = None
        return ids

    def schedule_all(
        self, subscription_id: str, price_point_ids: list[str], start: str, preserve: bool
    ) -> requests.Response:
        """One PATCH for every territory. Included ids must be ${local-id}."""
        included = []
        relationship = []
        for index, price_point_id in enumerate(price_point_ids):
            local_id = f"${{p{index}}}"
            relationship.append({"type": "subscriptionPrices", "id": local_id})
            included.append(
                {
                    "type": "subscriptionPrices",
                    "id": local_id,
                    "attributes": {"startDate": start, "preserveCurrentPrice": preserve},
                    "relationships": {
                        "subscription": {"data": {"type": "subscriptions", "id": subscription_id}},
                        "subscriptionPricePoint": {
                            "data": {"type": "subscriptionPricePoints", "id": price_point_id}
                        },
                        "territory": {
                            "data": {
                                "type": "territories",
                                "id": territory_of_price_point(price_point_id),
                            }
                        },
                    },
                }
            )
        return self.request(
            "PATCH",
            f"/subscriptions/{subscription_id}",
            json={
                "data": {
                    "type": "subscriptions",
                    "id": subscription_id,
                    "relationships": {"prices": {"data": relationship}},
                },
                "included": included,
            },
            timeout=120,
        )

    def schedule(self, subscription_id: str, price_point_id: str, start: str, preserve: bool) -> requests.Response:
        payload = {
            "data": {
                "type": "subscriptionPrices",
                "attributes": {"startDate": start, "preserveCurrentPrice": preserve},
                "relationships": {
                    "subscription": {"data": {"type": "subscriptions", "id": subscription_id}},
                    "subscriptionPricePoint": {
                        "data": {"type": "subscriptionPricePoints", "id": price_point_id}
                    },
                },
            }
        }
        last = None
        for attempt in range(4):
            last = self.request("POST", "/subscriptionPrices", json=payload)
            if last.status_code in (200, 201, 409):
                return last
            if last.status_code in (429, 500, 503):
                retry_after = last.headers.get("Retry-After")
                delay = float(retry_after) if retry_after and retry_after.isdigit() else 2 ** attempt
                time.sleep(delay)
                continue
            return last
        return last

    def territory_prices(self, subscription_id: str, territories: list[str]) -> list[dict]:
        body = self.get_json(
            f"/subscriptions/{subscription_id}/prices",
            params={
                "filter[territory]": ",".join(territories),
                "include": "subscriptionPricePoint,territory",
                "limit": 200,
            },
        )
        points = {
            item["id"]: item
            for item in body.get("included") or []
            if item.get("type") == "subscriptionPricePoints"
        }
        rows = []
        for item in body.get("data") or []:
            rel = item.get("relationships") or {}
            territory = ((rel.get("territory") or {}).get("data") or {}).get("id")
            point_id = ((rel.get("subscriptionPricePoint") or {}).get("data") or {}).get("id")
            price = (points.get(point_id) or {}).get("attributes") or {}
            rows.append(
                {
                    "territory": territory,
                    "start": (item.get("attributes") or {}).get("startDate"),
                    "preserved": (item.get("attributes") or {}).get("preserved"),
                    "customerPrice": price.get("customerPrice"),
                }
            )
        return rows

    def price_already_scheduled(self, subscription_id: str, price_point_id: str, start: str, usd: str) -> bool:
        territory = territory_of_price_point(price_point_id)
        if not territory:
            return False
        target = money_amount(usd)
        for row in self.territory_prices(subscription_id, [territory]):
            if row["start"] == start and row["customerPrice"] is not None:
                if money_amount(row["customerPrice"]) == target:
                    return True
        return False


class Play:
    def __init__(self, package: str) -> None:
        creds = service_account.Credentials.from_service_account_file(
            str(google_service_account_file()),
            scopes=["https://www.googleapis.com/auth/androidpublisher"],
        )
        creds.refresh(Request())
        self.package = package
        self._headers = {
            "Authorization": f"Bearer {creds.token}",
            "Content-Type": "application/json",
        }
        self._session = requests.Session()
        self._session.trust_env = False

    def request(self, method: str, url: str, **kwargs) -> requests.Response:
        response = self._session.request(
            method, url, headers=self._headers, timeout=kwargs.pop("timeout", 60), **kwargs
        )
        if response.status_code == 401:
            raise RuntimeError("Play rejected the service account (401).")
        return response

    def convert(self, usd: str) -> dict:
        response = self.request(
            "POST",
            f"{PLAY_API}/applications/{self.package}/pricing:convertRegionPrices",
            json={"price": usd_google_price(usd)},
        )
        if response.status_code != 200:
            raise RuntimeError(f"convertRegionPrices {response.status_code} {response.text[:300]}")
        return response.json()

    def get_subscription(self, product_id: str) -> dict:
        response = self.request(
            "GET",
            f"{PLAY_API}/applications/{self.package}/subscriptions/{product_id}",
        )
        if response.status_code != 200:
            raise RuntimeError(f"GET {product_id} {response.status_code} {response.text[:300]}")
        return response.json()

    def patch_base_plan(self, product_id: str, plan_id: str, conversion: dict) -> requests.Response:
        body = self.get_subscription(product_id)
        by_region = {
            code: item["price"]
            for code, item in (conversion.get("convertedRegionPrices") or {}).items()
        }
        other = conversion["convertedOtherRegionsPrice"]
        found = False
        for plan in body.get("basePlans") or []:
            if plan.get("basePlanId") != plan_id:
                continue
            found = True
            for config in plan.get("regionalConfigs") or []:
                price = by_region.get(config["regionCode"])
                if not price:
                    continue
                config["price"] = {
                    "currencyCode": price["currencyCode"],
                    "units": price.get("units", "0"),
                    "nanos": price.get("nanos", 0),
                }
            other_config = plan.setdefault("otherRegionsConfig", {})
            other_config["usdPrice"] = other["usdPrice"]
            other_config["eurPrice"] = other["eurPrice"]
        if not found:
            known = [plan.get("basePlanId") for plan in body.get("basePlans") or []]
            raise RuntimeError(f"{product_id} has no base plan {plan_id}. Have: {known}")
        version = conversion["regionVersion"]["version"]
        return self.request(
            "PATCH",
            f"{PLAY_API}/applications/{self.package}/subscriptions/{product_id}",
            params={
                "updateMask": "basePlans",
                "regionsVersion.version": version,
                "latencyTolerance": "PRODUCT_UPDATE_LATENCY_TOLERANCE_LATENCY_SENSITIVE",
            },
            json={
                "packageName": self.package,
                "productId": product_id,
                "basePlans": body.get("basePlans") or [],
            },
        )


def load_store_app(app_key: str) -> dict:
    path = APPS_DIR / f"{app_key}.json"
    if not path.exists():
        raise SystemExit(f"Unknown app config {app_key} ({path})")
    return json.loads(path.read_text(encoding="utf-8"))


def resolve_apple(apple: Apple, app_id: str, products: list[str], raw_ids: list[str]) -> list[tuple[str, str]]:
    resolved: list[tuple[str, str]] = []
    index: dict[str, str] | None = None
    for product_id in products:
        if index is None:
            index = apple.product_ids(app_id)
        subscription_id = index.get(product_id)
        if not subscription_id:
            known = ", ".join(sorted(index))
            raise SystemExit(f"No App Store subscription {product_id}. Known: {known}")
        resolved.append((product_id, subscription_id))
    for subscription_id in raw_ids:
        resolved.append((subscription_id, subscription_id))
    return resolved


def parse_play_targets(values: list[str]) -> list[tuple[str, str]]:
    parsed = []
    for value in values:
        if ":" not in value:
            raise SystemExit(f"Play target must be productId:basePlanId, got {value}")
        product_id, plan_id = value.split(":", 1)
        if not product_id or not plan_id:
            raise SystemExit(f"Play target must be productId:basePlanId, got {value}")
        parsed.append((product_id, plan_id))
    return parsed


def show_apple(apple: Apple, name: str, subscription_id: str) -> None:
    rows = apple.territory_prices(subscription_id, ["USA", "POL"])
    log(f"apple {name} ({subscription_id})")
    for row in sorted(rows, key=lambda item: (item["territory"] or "", item["start"] or "")):
        log(
            f"  {row['territory']} start={row['start']} "
            f"price={row['customerPrice']} preserved={row['preserved']}"
        )


def show_play(play: Play, product_id: str, plan_id: str) -> None:
    body = play.get_subscription(product_id)
    log(f"play {product_id}:{plan_id}")
    for plan in body.get("basePlans") or []:
        if plan.get("basePlanId") != plan_id:
            continue
        prices = {
            config["regionCode"]: format_google_price(config.get("price"))
            for config in plan.get("regionalConfigs") or []
            if config["regionCode"] in ("US", "PL")
        }
        log(f"  state={plan.get('state')} US={prices.get('US')} PL={prices.get('PL')}")
        return
    log("  base plan not found")


def apply_apple(
    apple: Apple,
    name: str,
    subscription_id: str,
    usd: str,
    start: str,
    preserve: bool,
    dry_run: bool,
    workers: int,
) -> bool:
    point_id, nearest = apple.us_price_point(subscription_id, usd)
    if not point_id:
        log(f"apple {name}: no US price point {usd}. Nearest: {', '.join(nearest) or 'none'}")
        return False
    others = [item for item in apple.equalization_ids(point_id) if item != point_id]
    targets = [point_id, *others]
    log(
        f"apple {name} ({subscription_id}) {len(targets)} territories "
        f"from {start} preserve={preserve}"
    )
    if dry_run:
        return True

    bulk = apple.schedule_all(subscription_id, targets, start, preserve)
    if bulk.status_code == 200:
        log("  one PATCH accepted for every territory")
        return True
    log(f"  PATCH {bulk.status_code}, scheduling territories one by one")

    ok = exists = failed = 0
    failures: list[str] = []
    lock = threading.Lock()
    done = 0

    def one(price_point_id: str) -> str:
        response = apple.schedule(subscription_id, price_point_id, start, preserve)
        if response.status_code in (200, 201):
            return "ok"
        if response.status_code == 409 and apple.price_already_scheduled(
            subscription_id, price_point_id, start, usd
        ):
            return "exists"
        return f"{response.status_code} {response.text[:160].replace(chr(10), ' ')}"

    with ThreadPoolExecutor(max_workers=workers) as pool:
        futures = [pool.submit(one, price_point_id) for price_point_id in targets]
        for future in as_completed(futures):
            result = future.result()
            with lock:
                done += 1
                if result == "ok":
                    ok += 1
                elif result == "exists":
                    exists += 1
                else:
                    failed += 1
                    if len(failures) < 5:
                        failures.append(result)
                if done % 25 == 0 or done == len(targets):
                    log(f"  {done}/{len(targets)}")
    log(f"  scheduled {ok}, already set {exists}, failed {failed}")
    for failure in failures:
        log(f"  {failure}")
    return failed == 0


def apply_play(play: Play, product_id: str, plan_id: str, conversion: dict, dry_run: bool) -> bool:
    regions = conversion.get("convertedRegionPrices") or {}
    us = format_google_price((regions.get("US") or {}).get("price"))
    pl = format_google_price((regions.get("PL") or {}).get("price"))
    log(f"play {product_id}:{plan_id} -> US {us}, PL {pl}, {len(regions)} regions")
    if dry_run:
        return True
    response = play.patch_base_plan(product_id, plan_id, conversion)
    if response.status_code != 200:
        log(f"  patch {response.status_code} {response.text[:300].replace(chr(10), ' ')}")
        return False
    log("  patched")
    return True


def default_start() -> str:
    return (datetime.now(timezone.utc).date() + timedelta(days=1)).isoformat()


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--app", default="knite", help="apps/<key>.json (default knite)")
    parser.add_argument("--usd", help="New base price in USD, e.g. 39.99")
    parser.add_argument("--apple-product", nargs="*", default=[], help="App Store productId, repeatable")
    parser.add_argument("--apple-id", nargs="*", default=[], help="App Store subscription id, if productId is unknown")
    parser.add_argument("--play", nargs="*", default=[], metavar="PRODUCT:PLAN", help="Play productId:basePlanId")
    parser.add_argument("--start-date", help="Apple price start YYYY-MM-DD (default tomorrow UTC)")
    parser.add_argument(
        "--no-preserve",
        action="store_true",
        help="Also raise the price for current Apple subscribers. Default keeps their price.",
    )
    parser.add_argument("--show", action="store_true", help="Print current US/PL prices and exit")
    parser.add_argument("--dry-run", action="store_true", help="Resolve price points and Play conversion, do not write")
    parser.add_argument("--workers", type=int, default=6, help="Parallel Apple price posts (default 6)")
    parser.add_argument(
        "--per-second",
        type=float,
        default=4,
        help="Max Apple requests started per second (default 4, under the hourly key cap)",
    )
    return parser


def main() -> int:
    args = build_parser().parse_args()
    if not args.apple_product and not args.apple_id and not args.play:
        raise SystemExit("Pass --apple-product, --apple-id, or --play.")
    if not args.show and not args.usd:
        raise SystemExit("Pass --usd, or --show to only read prices.")
    start = args.start_date or default_start()
    if not args.show:
        try:
            start_day = date.fromisoformat(start)
        except ValueError:
            raise SystemExit(f"--start-date must be YYYY-MM-DD, got {start}")
        if start_day <= datetime.now(timezone.utc).date():
            raise SystemExit(
                f"Apple rejects a start date that is not in the future ({start}). Use tomorrow or later."
            )

    app = load_store_app(args.app)
    apple = Apple(per_second=args.per_second) if (args.apple_product or args.apple_id) else None
    play = Play(app["play_package"]) if args.play else None
    apple_targets = resolve_apple(apple, app["app_id"], args.apple_product, args.apple_id) if apple else []
    play_targets = parse_play_targets(args.play)

    if args.show:
        for name, subscription_id in apple_targets:
            show_apple(apple, name, subscription_id)
        for product_id, plan_id in play_targets:
            show_play(play, product_id, plan_id)
        return 0

    ok = True
    for name, subscription_id in apple_targets:
        ok = apply_apple(
            apple,
            name,
            subscription_id,
            args.usd,
            start,
            preserve=not args.no_preserve,
            dry_run=args.dry_run,
            workers=max(1, args.workers),
        ) and ok
    conversion = play.convert(args.usd) if play_targets else None
    for product_id, plan_id in play_targets:
        ok = apply_play(play, product_id, plan_id, conversion, args.dry_run) and ok
    return 0 if ok else 1


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except RuntimeError as exc:
        log(str(exc))
        raise SystemExit(1)
