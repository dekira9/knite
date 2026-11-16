"""Apply or roll back Google Play store listings (title, short, full description) from a JSON file.

Usage:
  python3 play_listings.py apply  <listings.json> [--dry-run]
  python3 play_listings.py rollback <backup.json> [--dry-run]

<listings.json>: {"listings": [{"language": "ru-RU", "title": ..., "shortDescription": ..., "fullDescription": ...}]}
Only the fields present are changed; languages not listed stay as they are.
A backup file is the `android.json` written by dump_listings.py (same shape), so rollback = apply of the backup.

Before every write the script saves the live listings to
docs/aso-snapshots/play-backup-<UTC timestamp>.json, so every change can be undone with `rollback <that file>`.
"""
import datetime, json, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from google.oauth2 import service_account
from googleapiclient.discovery import build
from credentials import google_service_account_file, load_app_config

FIELDS = ("title", "shortDescription", "fullDescription")
LIMITS = {"title": 30, "shortDescription": 80, "fullDescription": 4000}
ROOT = Path(__file__).resolve().parents[2]


def validate(listings):
    errors = []
    for l in listings:
        for f in FIELDS:
            v = l.get(f)
            if v is None:
                continue
            if len(v) > LIMITS[f]:
                errors.append(f"{l['language']} {f}: {len(v)} > {LIMITS[f]}")
            if "\\n" in v:
                errors.append(f"{l['language']} {f}: literal \\n")
    return errors


def main():
    if len(sys.argv) < 3 or sys.argv[1] not in ("apply", "rollback"):
        sys.exit(__doc__)
    mode, src, dry = sys.argv[1], Path(sys.argv[2]), "--dry-run" in sys.argv
    wanted = json.loads(src.read_text(encoding="utf-8"))["listings"]
    errors = validate(wanted)
    if errors:
        sys.exit("Validation failed:\n" + "\n".join(errors))

    pkg = load_app_config("knite")["play_package"]
    creds = service_account.Credentials.from_service_account_file(
        str(google_service_account_file()), scopes=["https://www.googleapis.com/auth/androidpublisher"])
    svc = build("androidpublisher", "v3", credentials=creds, cache_discovery=False)
    edit = svc.edits().insert(packageName=pkg, body={}).execute()
    eid = edit["id"]
    committed = False
    try:
        live = svc.edits().listings().list(packageName=pkg, editId=eid).execute().get("listings", [])
        live_by_lang = {l["language"]: l for l in live}

        stamp = datetime.datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")
        backup = ROOT / "docs/aso-snapshots" / f"play-backup-{stamp}.json"
        if not dry:
            backup.write_text(json.dumps({"listings": live}, ensure_ascii=False, indent=1), encoding="utf-8")
            print(f"Backup of live listings: {backup.relative_to(ROOT)}")

        changes = 0
        for w in wanted:
            lang = w["language"]
            cur = live_by_lang.get(lang)
            if cur is None:
                sys.exit(f"{lang}: no such listing on Play (refusing to create new languages)")
            body = {f: w[f] for f in FIELDS if f in w and w[f] != cur.get(f)}
            if not body:
                print(f"{lang}: no change")
                continue
            for f in body:
                print(f"{lang} {f}: {cur.get(f, '')[:60]!r} -> {body[f][:60]!r}")
            changes += 1
            if not dry:
                svc.edits().listings().patch(packageName=pkg, editId=eid, language=lang, body=body).execute()

        if dry or not changes:
            print("Dry run, nothing sent." if dry else "Nothing to change.")
            return
        svc.edits().commit(packageName=pkg, editId=eid).execute()
        committed = True
        print(f"Committed edit {eid} ({mode}, {changes} languages). Undo: python3 tools/store/play_listings.py rollback {backup.relative_to(ROOT)}")
    finally:
        if not committed:
            try:
                svc.edits().delete(packageName=pkg, editId=eid).execute()
            except Exception:
                pass


if __name__ == "__main__":
    main()
