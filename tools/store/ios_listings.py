"""Apply or roll back iOS name / subtitle / keywords for the version being prepared in App Store Connect.

Usage:
  python3 ios_listings.py apply    <metadata.json> [--dry-run]
  python3 ios_listings.py rollback <backup.json>   [--dry-run]

<metadata.json>: {"version": "1.9.2", "locales": [{"locale": "pl", "name": ..., "subtitle": ..., "keywords": ...}]}
Only the fields present are changed; locales not listed stay as they are.
name / subtitle live on the editable appInfo (PREPARE_FOR_SUBMISSION); keywords on that version's localizations.
They reach users only when the version is submitted and released.

Before every write the script saves the current values of every locale to
docs/aso-snapshots/ios-backup-<UTC timestamp>.json (same shape), so `rollback <that file>` restores them.
"""
import datetime, json, sys, time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import jwt, requests
from credentials import load_app_config

ROOT = Path(__file__).resolve().parents[2]
B = "https://api.appstoreconnect.apple.com/v1"
LIMITS = {"name": 30, "subtitle": 30, "keywords": 100}
EDITABLE = {"PREPARE_FOR_SUBMISSION", "DEVELOPER_REJECTED", "REJECTED", "METADATA_REJECTED"}


def session(cfg):
    tok = jwt.encode({"iss": cfg["issuer_id"], "iat": int(time.time()), "exp": int(time.time()) + 1100, "aud": "appstoreconnect-v1"},
                     cfg["private_key"], algorithm="ES256", headers={"kid": cfg["key_id"], "typ": "JWT"})
    s = requests.Session(); s.trust_env = False
    s.headers.update({"Authorization": f"Bearer {tok}", "Content-Type": "application/json"})
    return s


def get(s, url, **p):
    r = s.get(B + url, params=p, timeout=60); r.raise_for_status(); return r.json()["data"]


def validate(locales):
    errors = []
    for l in locales:
        for f, lim in LIMITS.items():
            v = l.get(f)
            if v is None:
                continue
            if len(v) > lim:
                errors.append(f"{l['locale']} {f}: {len(v)} > {lim}")
            if f == "keywords" and (", " in v or v != v.strip()):
                errors.append(f"{l['locale']} keywords: spaces around commas")
    return errors


def main():
    if len(sys.argv) < 3 or sys.argv[1] not in ("apply", "rollback"):
        sys.exit(__doc__)
    mode, src, dry = sys.argv[1], Path(sys.argv[2]), "--dry-run" in sys.argv
    spec = json.loads(src.read_text(encoding="utf-8"))
    errors = validate(spec["locales"])
    if errors:
        sys.exit("Validation failed:\n" + "\n".join(errors))

    cfg = load_app_config("knite"); s = session(cfg); app = cfg["app_id"]
    info = next((i for i in get(s, f"/apps/{app}/appInfos") if i["attributes"].get("state") in EDITABLE
                 or i["attributes"].get("appStoreState") in EDITABLE), None)
    ver = next((v for v in get(s, f"/apps/{app}/appStoreVersions", limit=5)
                if v["attributes"]["versionString"] == spec["version"]), None)
    if not info or not ver or ver["attributes"]["appStoreState"] not in EDITABLE:
        sys.exit(f"No editable appInfo / version {spec['version']} (state: {ver and ver['attributes']['appStoreState']})")

    info_locs = {l["attributes"]["locale"]: l for l in get(s, f"/appInfos/{info['id']}/appInfoLocalizations", limit=50)}
    ver_locs = {l["attributes"]["locale"]: l for l in get(s, f"/appStoreVersions/{ver['id']}/appStoreVersionLocalizations", limit=50)}

    stamp = datetime.datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")
    backup = ROOT / "docs/aso-snapshots" / f"ios-backup-{stamp}.json"
    current = [{"locale": loc, "name": info_locs[loc]["attributes"].get("name"),
                "subtitle": info_locs[loc]["attributes"].get("subtitle"),
                "keywords": ver_locs[loc]["attributes"].get("keywords") if loc in ver_locs else None}
               for loc in sorted(info_locs)]
    if not dry:
        backup.write_text(json.dumps({"version": spec["version"], "locales": current}, ensure_ascii=False, indent=1), encoding="utf-8")
        print(f"Backup of current values: {backup.relative_to(ROOT)}")

    changes = 0
    for w in spec["locales"]:
        loc = w["locale"]
        if loc not in info_locs:
            sys.exit(f"{loc}: no such localization (refusing to create one)")
        for target, fields, kind in ((info_locs[loc], ("name", "subtitle"), "appInfoLocalizations"),
                                     (ver_locs.get(loc), ("keywords",), "appStoreVersionLocalizations")):
            body = {f: w[f] for f in fields if f in w and w[f] is not None and target and w[f] != target["attributes"].get(f)}
            if not body:
                continue
            for f, v in body.items():
                print(f"{loc} {f}: {target['attributes'].get(f)!r} -> {v!r}")
            changes += 1
            if not dry:
                r = s.patch(f"{B}/{kind}/{target['id']}", timeout=60,
                            json={"data": {"type": kind, "id": target["id"], "attributes": body}})
                if r.status_code != 200:
                    sys.exit(f"{loc} {kind}: HTTP {r.status_code} {r.text[:300]}\nPartial write. Undo: python3 tools/store/ios_listings.py rollback {backup.relative_to(ROOT)}")
    if dry:
        print("Dry run, nothing sent.")
    elif changes:
        print(f"Done ({mode}, {changes} updates on {spec['version']}). Undo: python3 tools/store/ios_listings.py rollback {backup.relative_to(ROOT)}")
    else:
        print("Nothing to change.")


if __name__ == "__main__":
    main()
