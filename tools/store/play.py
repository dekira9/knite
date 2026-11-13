#!/usr/bin/env python3
"""Raglan Planner — Google Play CLI (store listings via Android Publisher API)."""

import argparse
import json
import sys
import time
from pathlib import Path

STORE_ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(STORE_ROOT))
from credentials import METADATA_DIR, google_service_account_file  # noqa: E402

PACKAGE_NAME = "com.ilyadylko.knitapp"
TITLE_FILE = METADATA_DIR / "play_title.json"
SHORT_FILE = METADATA_DIR / "play_short.json"
FULL_FILE = METADATA_DIR / "play_full.json"

LIMITS = {"title": 30, "short": 80, "full": 4000}
FALLBACK_LOCALE = "en-US"


def get_service():
    try:
        from google.oauth2 import service_account
        from googleapiclient.discovery import build
    except ModuleNotFoundError:
        sys.exit("Install deps: pip install -r requirements.txt")
    credentials = service_account.Credentials.from_service_account_file(
        str(google_service_account_file()),
        scopes=["https://www.googleapis.com/auth/androidpublisher"],
    )
    return build("androidpublisher", "v3", credentials=credentials, cache_discovery=False)


def http_error():
    from googleapiclient.errors import HttpError

    return HttpError


def load_map(path):
    if not path.exists():
        sys.exit(f"Missing {path} — run `python3 play.py pull` first.")
    return json.loads(path.read_text("utf-8"))


def write_map(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", "utf-8")
    print(f"wrote {path.relative_to(STORE_ROOT)} ({len(data)} locales)")


def build_listings():
    titles, shorts, fulls = load_map(TITLE_FILE), load_map(SHORT_FILE), load_map(FULL_FILE)
    listings = {}
    for locale in sorted(set(titles) | set(shorts) | set(fulls)):
        listings[locale] = {
            "title": titles.get(locale, titles.get(FALLBACK_LOCALE, "")),
            "short": shorts.get(locale, shorts.get(FALLBACK_LOCALE, "")),
            "full": fulls.get(locale, fulls.get(FALLBACK_LOCALE, "")),
        }
    return listings


def validate(listings):
    problems = []
    for locale, content in listings.items():
        for key, limit in LIMITS.items():
            value = content.get(key) or ""
            if not value:
                problems.append(f"{locale}: empty '{key}'")
            elif len(value) > limit:
                problems.append(f"{locale}: '{key}' = {len(value)} chars (limit {limit})")
    return problems


def cmd_check():
    sa = json.loads(google_service_account_file().read_text("utf-8"))
    print(f"package:      {PACKAGE_NAME}")
    print(f"client_email: {sa.get('client_email')}")
    service = get_service()
    try:
        edit = service.edits().insert(body={}, packageName=PACKAGE_NAME).execute()
    except http_error() as e:
        print(f"ERR {e.resp.status} {e.reason}")
        if e.resp.status in (403, 404):
            print(
                "Invite this service account in Play Console → Users and permissions "
                f"for {PACKAGE_NAME} (store listing permission)."
            )
        return False
    service.edits().delete(editId=edit["id"], packageName=PACKAGE_NAME).execute()
    print("OK  edit opened and discarded")
    return True


def cmd_pull():
    service = get_service()
    edit = service.edits().insert(body={}, packageName=PACKAGE_NAME).execute()
    try:
        items = service.edits().listings().list(
            editId=edit["id"], packageName=PACKAGE_NAME
        ).execute().get("listings", [])
    finally:
        service.edits().delete(editId=edit["id"], packageName=PACKAGE_NAME).execute()
    write_map(TITLE_FILE, {l["language"]: l.get("title", "") for l in items})
    write_map(SHORT_FILE, {l["language"]: l.get("shortDescription", "") for l in items})
    write_map(FULL_FILE, {l["language"]: l.get("fullDescription", "") for l in items})
    return True


def cmd_validate():
    listings = build_listings()
    problems = validate(listings)
    print(f"locales: {len(listings)}")
    for p in problems:
        print(f"  - {p}")
    print("ok" if not problems else f"{len(problems)} problem(s)")
    return not problems


def cmd_update(dry_run=False):
    listings = build_listings()
    problems = validate(listings)
    if problems:
        for p in problems:
            print(f"  - {p}")
        return False
    if dry_run:
        for locale, c in listings.items():
            print(f"[dry-run] {locale}: title={len(c['title'])} short={len(c['short'])} full={len(c['full'])}")
        return True

    HttpError = http_error()
    service = get_service()
    edit_id = service.edits().insert(body={}, packageName=PACKAGE_NAME).execute()["id"]
    ok = err = 0
    for locale, c in listings.items():
        try:
            service.edits().listings().update(
                editId=edit_id,
                packageName=PACKAGE_NAME,
                language=locale,
                body={
                    "language": locale,
                    "title": c["title"],
                    "shortDescription": c["short"],
                    "fullDescription": c["full"],
                },
            ).execute()
            print(f"ok  {locale}")
            ok += 1
        except HttpError as e:
            print(f"err {locale}: {e}")
            err += 1
        time.sleep(0.2)
    if err:
        service.edits().delete(editId=edit_id, packageName=PACKAGE_NAME).execute()
        print(f"{err} locale(s) failed — edit discarded, nothing published.")
        return False
    service.edits().commit(editId=edit_id, packageName=PACKAGE_NAME).execute()
    print(f"listings: {ok} ok — committed.")
    return True


def main():
    parser = argparse.ArgumentParser(description="Raglan Planner — Google Play listing CLI")
    sub = parser.add_subparsers(dest="command", required=True)
    sub.add_parser("check", help="Check service account access to this package")
    sub.add_parser("pull", help="Save live listings to metadata/play_*.json")
    sub.add_parser("validate", help="Check limits and empty fields")
    p = sub.add_parser("update", help="Push title/short/full for every locale and commit")
    p.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    ok = {
        "check": cmd_check,
        "pull": cmd_pull,
        "validate": cmd_validate,
        "update": lambda: cmd_update(dry_run=args.dry_run),
    }[args.command]()
    raise SystemExit(0 if ok else 1)


if __name__ == "__main__":
    main()
