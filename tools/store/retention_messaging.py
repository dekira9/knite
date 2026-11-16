#!/usr/bin/env python3
"""App Store retention message and retention offers (App Store Connect API 4.6).

People who tap Cancel on a subscription see the message. People with at least
`eligibility.paidMonths` of paid subscription also see the offer of that
subscription. Spec: metadata/retention_messaging.json. iOS only, Play has no
equivalent.

  python3 tools/store/retention_messaging.py show
  python3 tools/store/retention_messaging.py apply --dry-run
  python3 tools/store/retention_messaging.py apply
  python3 tools/store/retention_messaging.py submit

`apply` is safe to rerun: it reuses the message by referenceName, skips
locales that already exist on the open version and offers whose offerId already
exists. A version that is in review or approved cannot get new locales: change
the referenceName in the spec to start a new message, then apply and submit.

Offer prices: the US price point of the subscription plus Apple's equalized
tiers for every other territory, with `territoryPrices` overrides (customer
price in local currency). A territory where that price is not below the
current subscription price gets no offer, and the script prints it.
"""

from __future__ import annotations

import argparse
import json
import sys
from datetime import date
from decimal import Decimal
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from set_subscription_price import (  # noqa: E402
    Apple,
    load_store_app,
    log,
    money_amount,
    territory_of_price_point,
)

SPEC_FILE = Path(__file__).resolve().parent / "metadata" / "retention_messaging.json"
HEADER_MAX = 66
BODY_MAX = 144
WATCH_TERRITORIES = ("USA", "POL", "UKR", "DEU", "GBR")
OPEN_VERSION_STATES = {"PREPARE_FOR_SUBMISSION"}


def load_spec(path: Path) -> dict:
    spec = json.loads(path.read_text(encoding="utf-8"))
    problems = []
    for locale, text in spec["message"]["localizations"].items():
        if len(text["header"]) > HEADER_MAX:
            problems.append(f"{locale} header {len(text['header'])} > {HEADER_MAX}")
        if len(text["body"]) > BODY_MAX:
            problems.append(f"{locale} body {len(text['body'])} > {BODY_MAX}")
    if problems:
        raise SystemExit("Spec text too long: " + "; ".join(problems))
    return spec


def data_of(apple: Apple, url: str, **params) -> list[dict]:
    rows: list[dict] = []
    page: str | None = url
    query: dict | None = {"limit": 200, **params}
    while page:
        body = apple.get_json(page, params=query)
        rows.extend(body.get("data") or [])
        page = (body.get("links") or {}).get("next")
        query = None
    return rows


def checked(response, what: str) -> dict:
    if response.status_code not in (200, 201, 204):
        raise RuntimeError(f"{what}: {response.status_code} {response.text[:600]}")
    return response.json() if response.text else {}


def find_message(apple: Apple, app_id: str, name: str) -> dict | None:
    for item in data_of(apple, f"/apps/{app_id}/retentionMessages"):
        if (item.get("attributes") or {}).get("referenceName") == name:
            return item
    return None


def message_versions(apple: Apple, message_id: str) -> list[dict]:
    return data_of(apple, f"/retentionMessages/{message_id}/versions")


def version_locales(apple: Apple, version_id: str) -> dict[str, dict]:
    return {
        (item.get("attributes") or {}).get("locale"): item
        for item in data_of(apple, f"/retentionMessageVersions/{version_id}/localizations")
    }


def current_prices(apple: Apple, subscription_id: str) -> dict[str, Decimal]:
    """Territory → price a new buyer pays today."""
    body_rows: list[dict] = []
    included: dict[str, dict] = {}
    page: str | None = f"/subscriptions/{subscription_id}/prices"
    query: dict | None = {"include": "subscriptionPricePoint,territory", "limit": 200}
    while page:
        body = apple.get_json(page, params=query)
        body_rows.extend(body.get("data") or [])
        for item in body.get("included") or []:
            included[item["id"]] = item
        page = (body.get("links") or {}).get("next")
        query = None
    today = date.today().isoformat()
    best: dict[str, tuple[str, Decimal]] = {}
    for row in body_rows:
        rel = row.get("relationships") or {}
        territory = ((rel.get("territory") or {}).get("data") or {}).get("id")
        point_id = ((rel.get("subscriptionPricePoint") or {}).get("data") or {}).get("id")
        start = (row.get("attributes") or {}).get("startDate") or ""
        raw = ((included.get(point_id) or {}).get("attributes") or {}).get("customerPrice")
        if not territory or raw is None or start > today:
            continue
        if territory not in best or start >= best[territory][0]:
            best[territory] = (start, money_amount(raw))
    return {territory: price for territory, (_, price) in best.items()}


def offer_price_points(apple: Apple, subscription_id: str, offer: dict) -> dict[str, tuple[str, Decimal]]:
    """Territory → (price point id, customer price) for the offer."""
    us_point, nearest = apple.us_price_point(subscription_id, offer["usd"])
    if not us_point:
        raise RuntimeError(f"{offer['product']}: no US price point {offer['usd']}. Nearest: {nearest}")
    points: dict[str, tuple[str, Decimal]] = {"USA": (us_point, money_amount(offer["usd"]))}
    for item in data_of(apple, f"/subscriptionPricePoints/{us_point}/equalizations"):
        territory = territory_of_price_point(item["id"])
        raw = (item.get("attributes") or {}).get("customerPrice")
        if territory and raw is not None:
            points[territory] = (item["id"], money_amount(raw))
    for territory, local in (offer.get("territoryPrices") or {}).items():
        target = money_amount(local)
        found = ""
        for item in data_of(
            apple,
            f"/subscriptions/{subscription_id}/pricePoints",
            **{"filter[territory]": territory},
        ):
            raw = (item.get("attributes") or {}).get("customerPrice")
            if raw is not None and money_amount(raw) == target:
                found = item["id"]
                break
        if not found:
            raise RuntimeError(f"{offer['product']}: no {territory} price point {local}")
        points[territory] = (found, target)
    return points


def plan_offer_prices(apple: Apple, subscription_id: str, offer: dict) -> list[str]:
    points = offer_price_points(apple, subscription_id, offer)
    base = current_prices(apple, subscription_id)
    keep: list[str] = []
    dropped: list[str] = []
    for territory, (point_id, price) in sorted(points.items()):
        current = base.get(territory)
        if current is not None and price >= current:
            dropped.append(f"{territory} {price}>={current}")
            continue
        keep.append(point_id)
    watch = ", ".join(
        f"{territory} {points[territory][1]} (now {base.get(territory)})"
        for territory in WATCH_TERRITORIES
        if territory in points
    )
    log(f"  {offer['offerId']}: {len(keep)} territories. {watch}")
    if dropped:
        log(f"  no offer where it is not cheaper: {', '.join(dropped)}")
    return keep


def create_offer(apple: Apple, subscription_id: str, offer: dict, eligibility: dict, point_ids: list[str]) -> str:
    relationship = []
    included = []
    for index, point_id in enumerate(point_ids):
        local_id = f"${{p{index}}}"
        relationship.append({"type": "retentionOfferPrices", "id": local_id})
        included.append(
            {
                "type": "retentionOfferPrices",
                "id": local_id,
                "relationships": {
                    "subscriptionPricePoint": {"data": {"type": "subscriptionPricePoints", "id": point_id}}
                },
            }
        )
    attributes = {
        "referenceName": offer["referenceName"],
        "offerId": offer["offerId"],
        "duration": offer["duration"],
        "offerMode": offer["offerMode"],
        "periodCount": offer["periodCount"],
        "customerEligibilityPaidSubscriptionDurationInMonths": eligibility["paidMonths"],
    }
    if eligibility.get("waitBetweenOffersMonths"):
        attributes["customerEligibilityWaitBetweenOffersInMonths"] = eligibility["waitBetweenOffersMonths"]
    body = checked(
        apple.request(
            "POST",
            "/retentionOffers",
            json={
                "data": {
                    "type": "retentionOffers",
                    "attributes": attributes,
                    "relationships": {
                        "subscription": {"data": {"type": "subscriptions", "id": subscription_id}},
                        "prices": {"data": relationship},
                    },
                },
                "included": included,
            },
            timeout=120,
        ),
        f"create offer {offer['offerId']}",
    )
    return body["data"]["id"]


def show(apple: Apple, app_id: str, spec: dict, products: dict[str, str]) -> None:
    messages = data_of(apple, f"/apps/{app_id}/retentionMessages")
    log(f"retention messages: {len(messages)}")
    for message in messages:
        log(f"  {message['id']} {message['attributes'].get('referenceName')}")
        for version in message_versions(apple, message["id"]):
            locales = sorted(version_locales(apple, version["id"]))
            log(f"    version {version['id']} {version['attributes'].get('state')} {locales}")
    names = set(spec["message"]["subscriptions"]) | {offer["product"] for offer in spec["offers"]}
    for product in sorted(names):
        subscription_id = products.get(product)
        if not subscription_id:
            log(f"  {product}: not in App Store Connect")
            continue
        message = apple.request("GET", f"/subscriptions/{subscription_id}/relationships/retentionMessage")
        assigned = ((message.json() or {}).get("data") or {}).get("id") if message.status_code == 200 else None
        offers = [
            item["attributes"].get("offerId")
            for item in data_of(apple, f"/subscriptions/{subscription_id}/retentionOffers")
        ]
        shown = [
            item["id"]
            for item in data_of(apple, f"/subscriptions/{subscription_id}/relationships/retentionMessageOffers")
        ]
        log(f"  {product}: message={assigned} offers={offers} presented={len(shown)}")


def apply(apple: Apple, app_id: str, spec: dict, products: dict[str, str], dry_run: bool) -> None:
    message_spec = spec["message"]
    name = message_spec["referenceName"]
    missing = [p for p in message_spec["subscriptions"] + [o["product"] for o in spec["offers"]] if p not in products]
    if missing:
        raise SystemExit(f"Unknown App Store products: {missing}")

    message = find_message(apple, app_id, name)
    log(f"message {name}: {'exists ' + message['id'] if message else 'create'}")
    if message and not dry_run:
        message_id = message["id"]
    elif not dry_run:
        body = checked(
            apple.request(
                "POST",
                "/retentionMessages",
                json={
                    "data": {
                        "type": "retentionMessages",
                        "attributes": {"referenceName": name},
                        "relationships": {"app": {"data": {"type": "apps", "id": app_id}}},
                    }
                },
            ),
            "create message",
        )
        message_id = body["data"]["id"]
    else:
        message_id = message["id"] if message else ""

    versions = message_versions(apple, message_id) if message_id else []
    open_version = next(
        (v for v in versions if (v.get("attributes") or {}).get("state") in OPEN_VERSION_STATES), None
    )
    if versions and not open_version:
        states = [(v["id"], v["attributes"].get("state")) for v in versions]
        log(f"  versions {states}: none open, text stays as submitted")
        version_id = ""
    elif open_version:
        version_id = open_version["id"]
        log(f"  open version {version_id}")
    elif dry_run:
        version_id = ""
        log("  version: create (text only)")
    else:
        body = checked(
            apple.request(
                "POST",
                "/retentionMessageVersions",
                json={
                    "data": {
                        "type": "retentionMessageVersions",
                        "relationships": {
                            "retentionMessage": {"data": {"type": "retentionMessages", "id": message_id}}
                        },
                    }
                },
            ),
            "create version",
        )
        version_id = body["data"]["id"]
        log(f"  created version {version_id}")

    if version_id or (dry_run and not versions):
        existing = version_locales(apple, version_id) if version_id else {}
        for locale, text in message_spec["localizations"].items():
            current = existing.get(locale)
            if current:
                attrs = current.get("attributes") or {}
                if attrs.get("header") == text["header"] and attrs.get("body") == text["body"]:
                    continue
                log(f"  {locale}: update text")
                if not dry_run:
                    checked(
                        apple.request(
                            "PATCH",
                            f"/retentionMessageLocalizations/{current['id']}",
                            json={
                                "data": {
                                    "type": "retentionMessageLocalizations",
                                    "id": current["id"],
                                    "attributes": {"header": text["header"], "body": text["body"]},
                                }
                            },
                        ),
                        f"update {locale}",
                    )
                continue
            log(f"  {locale}: add ({len(text['header'])}/{len(text['body'])} chars)")
            if not dry_run:
                checked(
                    apple.request(
                        "POST",
                        "/retentionMessageLocalizations",
                        json={
                            "data": {
                                "type": "retentionMessageLocalizations",
                                "attributes": {"locale": locale, **text},
                                "relationships": {
                                    "retentionMessageVersion": {
                                        "data": {"type": "retentionMessageVersions", "id": version_id}
                                    }
                                },
                            }
                        },
                    ),
                    f"add {locale}",
                )

    offer_ids: dict[str, str] = {}
    for offer in spec["offers"]:
        subscription_id = products[offer["product"]]
        existing = {
            item["attributes"].get("offerId"): item["id"]
            for item in data_of(apple, f"/subscriptions/{subscription_id}/retentionOffers")
        }
        if offer["offerId"] in existing:
            log(f"offer {offer['offerId']} on {offer['product']}: exists")
            offer_ids[offer["product"]] = existing[offer["offerId"]]
            continue
        log(f"offer {offer['offerId']} on {offer['product']}: create")
        point_ids = plan_offer_prices(apple, subscription_id, offer)
        if not dry_run:
            offer_ids[offer["product"]] = create_offer(
                apple, subscription_id, offer, spec["eligibility"], point_ids
            )

    for product in message_spec["subscriptions"]:
        subscription_id = products[product]
        log(f"assign message to {product}")
        if not dry_run:
            checked(
                apple.request(
                    "PATCH",
                    f"/subscriptions/{subscription_id}/relationships/retentionMessage",
                    json={"data": {"type": "retentionMessages", "id": message_id}},
                ),
                f"assign {product}",
            )
        if product in offer_ids:
            shown = {
                item["id"]
                for item in data_of(
                    apple, f"/subscriptions/{subscription_id}/relationships/retentionMessageOffers"
                )
            }
            if offer_ids[product] in shown:
                continue
            log(f"  present offer on {product}")
            if not dry_run:
                checked(
                    apple.request(
                        "POST",
                        f"/subscriptions/{subscription_id}/relationships/retentionMessageOffers",
                        json={"data": [{"type": "retentionOffers", "id": offer_ids[product]}]},
                    ),
                    f"present offer {product}",
                )


def submit(apple: Apple, app_id: str, spec: dict) -> None:
    name = spec["message"]["referenceName"]
    message = find_message(apple, app_id, name)
    if not message:
        raise SystemExit(f"No message {name}. Run apply first.")
    open_version = next(
        (
            v
            for v in message_versions(apple, message["id"])
            if (v.get("attributes") or {}).get("state") in OPEN_VERSION_STATES
        ),
        None,
    )
    if not open_version:
        raise SystemExit("No version in PREPARE_FOR_SUBMISSION.")
    body = checked(
        apple.request(
            "POST",
            "/reviewSubmissions",
            json={
                "data": {
                    "type": "reviewSubmissions",
                    "attributes": {"platform": "IOS"},
                    "relationships": {"app": {"data": {"type": "apps", "id": app_id}}},
                }
            },
        ),
        "create review submission",
    )
    submission_id = body["data"]["id"]
    checked(
        apple.request(
            "POST",
            "/reviewSubmissionItems",
            json={
                "data": {
                    "type": "reviewSubmissionItems",
                    "relationships": {
                        "reviewSubmission": {"data": {"type": "reviewSubmissions", "id": submission_id}},
                        "retentionMessageVersion": {
                            "data": {"type": "retentionMessageVersions", "id": open_version["id"]}
                        },
                    },
                }
            },
        ),
        "add version to submission",
    )
    checked(
        apple.request(
            "PATCH",
            f"/reviewSubmissions/{submission_id}",
            json={
                "data": {
                    "type": "reviewSubmissions",
                    "id": submission_id,
                    "attributes": {"submitted": True},
                }
            },
        ),
        "submit",
    )
    log(f"submitted version {open_version['id']} in review submission {submission_id}")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("command", choices=["show", "apply", "submit"])
    parser.add_argument("--spec", type=Path, default=SPEC_FILE)
    parser.add_argument("--dry-run", action="store_true", help="apply: print the plan, do not write")
    args = parser.parse_args()

    spec = load_spec(args.spec)
    app = load_store_app(spec.get("app", "knite"))
    apple = Apple(per_second=4)
    products = apple.product_ids(app["app_id"])
    if args.command == "show":
        show(apple, app["app_id"], spec, products)
    elif args.command == "apply":
        apply(apple, app["app_id"], spec, products, args.dry_run)
    else:
        submit(apple, app["app_id"], spec)
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except RuntimeError as exc:
        log(str(exc))
        raise SystemExit(1)
