#!/usr/bin/env python3
"""Raglan Planner — App Store Connect CLI (listing copy, What's New, URLs, category)."""

import argparse
import json
import sys
import time
from pathlib import Path

import jwt
import requests

STORE_ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(STORE_ROOT))
from credentials import METADATA_DIR, apple_token, load_apple_auth  # noqa: E402

CREDENTIALS_FILE = STORE_ROOT / "credentials.json"
KEYWORDS_FILE = METADATA_DIR / "ios_keywords.json"
NAME_FILE = METADATA_DIR / "ios_name.json"
SUBTITLE_FILE = METADATA_DIR / "ios_subtitle.json"
DESCRIPTION_FILE = METADATA_DIR / "ios_description.json"
PROMO_FILE = METADATA_DIR / "ios_promo.json"

CONFIG = {
    "app_id": "",
    "bundle_id": "com.ilyadylko.knitapp",
    "whats_new": "Improved performance",
    "support_url": "https://idexstudios.wixsite.com/knitting-contact",
    "privacy_url": "https://idexstudios.wixsite.com/knitting-terms",
}

API = "https://api.appstoreconnect.apple.com/v1"

EDITABLE_STATES = {
    "PREPARE_FOR_SUBMISSION",
    "DEVELOPER_REJECTED",
    "REJECTED",
    "METADATA_REJECTED",
    "INVALID_BINARY",
    "WAITING_FOR_REVIEW",
}

LIMITS = {"name": 30, "subtitle": 30, "keywords": 100, "description": 4000, "promo": 170}


def pick_editable(items):
    for d in items:
        state = d["attributes"].get("appStoreState") or d["attributes"].get("state")
        if state in EDITABLE_STATES:
            return d
    return items[0]


def token(cfg):
    return apple_token(cfg)


def headers(cfg):
    return {"Authorization": f"Bearer {token(cfg)}", "Content-Type": "application/json"}


def get(cfg, path, **params):
    r = requests.get(f"{API}{path}", headers=headers(cfg), params=params or None, timeout=60)
    data = r.json()
    if r.status_code != 200:
        sys.exit(f"GET {path}: {r.status_code} {json.dumps(data, ensure_ascii=False)}")
    return data


def patch(cfg, path, body):
    r = requests.patch(f"{API}{path}", headers=headers(cfg), json=body, timeout=60)
    return r.status_code == 200, r


def resolve_app_id(cfg):
    data = get(cfg, "/apps", **{"filter[bundleId]": cfg["bundle_id"]})
    if not data.get("data"):
        sys.exit(f"No app with bundle id {cfg['bundle_id']} for this API key.")
    app_id = data["data"][0]["id"]
    print(f"app_id for {cfg['bundle_id']}: {app_id}")
    return app_id


def load_config():
    cfg = dict(CONFIG)
    cfg.update(load_apple_auth())
    if CREDENTIALS_FILE.exists():
        cfg.update({k: v for k, v in json.loads(CREDENTIALS_FILE.read_text("utf-8")).items() if v})
    if not cfg.get("app_id"):
        cfg["app_id"] = resolve_app_id(cfg)
    return cfg


def editable_version(cfg):
    data = get(cfg, f"/apps/{cfg['app_id']}/appStoreVersions")
    if not data.get("data"):
        sys.exit("No App Store versions.")
    return pick_editable(data["data"])


def version_localizations(cfg):
    version_id = editable_version(cfg)["id"]
    return get(cfg, f"/appStoreVersions/{version_id}/appStoreVersionLocalizations")["data"]


def editable_app_info_id(cfg):
    data = get(cfg, f"/apps/{cfg['app_id']}/appInfos")
    if not data.get("data"):
        sys.exit("No appInfos.")
    return pick_editable(data["data"])["id"]


def app_info_localizations(cfg):
    return get(cfg, f"/appInfos/{editable_app_info_id(cfg)}/appInfoLocalizations")["data"]


def load_locale_map(path):
    if not path.exists():
        sys.exit(f"Missing {path} — run `python3 asm.py pull` first.")
    return json.loads(path.read_text("utf-8"))


def write_locale_map(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", "utf-8")
    print(f"wrote {path.relative_to(STORE_ROOT)} ({len(data)} locales)")


def patch_each(cfg, locs, res_type, attrs_for, label):
    ok = err = 0
    for loc in locs:
        locale = loc["attributes"]["locale"]
        attrs = attrs_for(locale)
        if attrs is None:
            print(f"skip {locale}: no value")
            continue
        body = {"data": {"id": loc["id"], "type": res_type, "attributes": attrs}}
        good, r = patch(cfg, f"/{res_type}/{loc['id']}", body)
        if good:
            print(f"ok  {locale}")
            ok += 1
        else:
            print(f"err {locale}: {r.status_code} {r.text}")
            err += 1
        time.sleep(0.3)
    print(f"{label}: {ok} ok, {err} err")
    return err == 0


def from_map(locale_map, field):
    def attrs(locale):
        value = locale_map.get(locale)
        return {field: value} if value else None

    return attrs


# --- commands ---------------------------------------------------------------


def cmd_check(cfg):
    app = get(cfg, f"/apps/{cfg['app_id']}")["data"]["attributes"]
    print(f"app:     {app.get('name')} ({app.get('bundleId')}), primary locale {app.get('primaryLocale')}")
    v = editable_version(cfg)["attributes"]
    print(f"version: {v.get('versionString')} — {v.get('appStoreState')}")
    return True


def cmd_pull(cfg):
    """Save the live listing copy to metadata/*.json (edit those, then push)."""
    vlocs = version_localizations(cfg)
    ilocs = app_info_localizations(cfg)
    va = {l["attributes"]["locale"]: l["attributes"] for l in vlocs}
    ia = {l["attributes"]["locale"]: l["attributes"] for l in ilocs}
    write_locale_map(KEYWORDS_FILE, {k: a.get("keywords") or "" for k, a in va.items()})
    write_locale_map(DESCRIPTION_FILE, {k: a.get("description") or "" for k, a in va.items()})
    write_locale_map(PROMO_FILE, {k: a.get("promotionalText") or "" for k, a in va.items()})
    write_locale_map(NAME_FILE, {k: a.get("name") or "" for k, a in ia.items()})
    write_locale_map(SUBTITLE_FILE, {k: a.get("subtitle") or "" for k, a in ia.items()})
    urls = {a.get("supportUrl") for a in va.values()} - {None}
    priv = {a.get("privacyPolicyUrl") for a in ia.values()} - {None}
    print(f"support urls: {sorted(urls) or '-'}")
    print(f"privacy urls: {sorted(priv) or '-'}")
    return True


def cmd_validate():
    files = {
        "name": NAME_FILE,
        "subtitle": SUBTITLE_FILE,
        "keywords": KEYWORDS_FILE,
        "description": DESCRIPTION_FILE,
        "promo": PROMO_FILE,
    }
    problems = []
    for key, path in files.items():
        if not path.exists():
            continue
        for locale, value in load_locale_map(path).items():
            if value and len(value) > LIMITS[key]:
                problems.append(f"{locale}: {key} = {len(value)} chars (limit {LIMITS[key]})")
    for p in problems:
        print(f"  - {p}")
    print("ok" if not problems else f"{len(problems)} problem(s)")
    return not problems


def cmd_whats_new(cfg, text):
    return patch_each(
        cfg, version_localizations(cfg), "appStoreVersionLocalizations",
        lambda _l: {"whatsNew": text}, "whats-new",
    )


def cmd_version_field(cfg, path, field, label):
    if not cmd_validate():
        return False
    return patch_each(
        cfg, version_localizations(cfg), "appStoreVersionLocalizations",
        from_map(load_locale_map(path), field), label,
    )


def cmd_name(cfg):
    if not cmd_validate():
        return False
    names = load_locale_map(NAME_FILE)
    subs = load_locale_map(SUBTITLE_FILE) if SUBTITLE_FILE.exists() else {}

    def attrs(locale):
        out = {}
        if names.get(locale):
            out["name"] = names[locale]
        if subs.get(locale):
            out["subtitle"] = subs[locale]
        return out or None

    return patch_each(cfg, app_info_localizations(cfg), "appInfoLocalizations", attrs, "name+subtitle")


def cmd_support(cfg, url):
    return patch_each(
        cfg, version_localizations(cfg), "appStoreVersionLocalizations",
        lambda _l: {"supportUrl": url}, f"support ({url})",
    )


def cmd_privacy(cfg, url):
    return patch_each(
        cfg, app_info_localizations(cfg), "appInfoLocalizations",
        lambda _l: {"privacyPolicyUrl": url}, f"privacy ({url})",
    )


def cmd_category(cfg, primary=None, secondary=None):
    app_info_id = editable_app_info_id(cfg)

    def show():
        data = get(cfg, f"/appInfos/{app_info_id}", include="primaryCategory,secondaryCategory")
        rel = data.get("data", {}).get("relationships", {})
        for key in ("primaryCategory", "secondaryCategory"):
            d = (rel.get(key) or {}).get("data")
            print(f"{key}: {d['id'] if d else '-'}")
        return True

    if not primary and not secondary:
        return show()
    relationships = {}
    if primary:
        relationships["primaryCategory"] = {"data": {"type": "appCategories", "id": primary}}
    if secondary:
        value = None if secondary.lower() == "none" else {"type": "appCategories", "id": secondary}
        relationships["secondaryCategory"] = {"data": value}
    body = {"data": {"type": "appInfos", "id": app_info_id, "relationships": relationships}}
    good, r = patch(cfg, f"/appInfos/{app_info_id}", body)
    if not good:
        print(f"err: {r.status_code} {r.text}")
        return False
    print("Category updated (goes live with the next app version):")
    return show()


def main():
    parser = argparse.ArgumentParser(description="Raglan Planner — App Store Connect CLI")
    sub = parser.add_subparsers(dest="command", required=True)
    sub.add_parser("check", help="Check API access and show the editable version")
    sub.add_parser("pull", help="Save live listing copy to metadata/ios_*.json")
    sub.add_parser("validate", help="Check metadata/ios_*.json against App Store limits")
    p = sub.add_parser("whats-new", help="What's New for every version locale")
    p.add_argument("--text", default=None)
    sub.add_parser("keywords", help="Push metadata/ios_keywords.json")
    sub.add_parser("description", help="Push metadata/ios_description.json")
    sub.add_parser("promo", help="Push metadata/ios_promo.json (promotional text, live at once)")
    sub.add_parser("name", help="Push metadata/ios_name.json + ios_subtitle.json")
    p = sub.add_parser("support", help="Support URL for every version locale")
    p.add_argument("--url", default=None)
    p = sub.add_parser("privacy", help="Privacy Policy URL for every appInfo locale")
    p.add_argument("--url", default=None)
    p = sub.add_parser("category", help="Show or set primary/secondary category")
    p.add_argument("--primary", default=None, help="e.g. LIFESTYLE")
    p.add_argument("--secondary", default=None, help="category id, or 'none'")
    args = parser.parse_args()

    if args.command == "validate":
        raise SystemExit(0 if cmd_validate() else 1)

    cfg = load_config()
    c = args.command
    if c == "check":
        ok = cmd_check(cfg)
    elif c == "pull":
        ok = cmd_pull(cfg)
    elif c == "whats-new":
        ok = cmd_whats_new(cfg, args.text or cfg["whats_new"])
    elif c == "keywords":
        ok = cmd_version_field(cfg, KEYWORDS_FILE, "keywords", "keywords")
    elif c == "description":
        ok = cmd_version_field(cfg, DESCRIPTION_FILE, "description", "description")
    elif c == "promo":
        ok = cmd_version_field(cfg, PROMO_FILE, "promotionalText", "promo")
    elif c == "name":
        ok = cmd_name(cfg)
    elif c in ("support", "privacy"):
        url = args.url or cfg[f"{c}_url"]
        if not url:
            sys.exit(f"Pass --url or set {c}_url in credentials.json")
        ok = cmd_support(cfg, url) if c == "support" else cmd_privacy(cfg, url)
    elif c == "category":
        ok = cmd_category(cfg, args.primary, args.secondary)
    else:
        parser.print_help()
        ok = False
    raise SystemExit(0 if ok else 1)


if __name__ == "__main__":
    main()
