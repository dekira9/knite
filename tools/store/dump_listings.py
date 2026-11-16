"""Read-only dump of live App Store + Google Play listings (title, subtitle, keywords, descriptions).

Usage: python3 dump_listings.py [out_dir]   (default: docs/aso-snapshots/listings-<today>/)
Play: opens an edit, reads listings, then deletes the edit, so nothing is committed.
"""
import datetime, json, sys, time
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
import jwt, requests
from credentials import apple_token, load_app_config, google_service_account_file

out = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parents[2] / "docs/aso-snapshots" / f"listings-{datetime.date.today()}"
out.mkdir(parents=True, exist_ok=True)
cfg = load_app_config("knite")
tok = apple_token(cfg)
s = requests.Session(); s.trust_env = False
s.headers["Authorization"] = f"Bearer {tok}"
B = "https://api.appstoreconnect.apple.com/v1"
def get(url, **p):
    r = s.get(url if url.startswith("http") else B + url, params=p, timeout=60); r.raise_for_status(); return r.json()

app = cfg["app_id"]
ios = {"appInfo": [], "version": None, "versionLocs": []}
for info in get(f"/apps/{app}/appInfos")["data"]:
    locs = get(f"/appInfos/{info['id']}/appInfoLocalizations", limit=50)["data"]
    ios["appInfo"].append({"state": info["attributes"].get("appStoreState") or info["attributes"].get("state"),
        "locs": [{"locale": l["attributes"]["locale"], "name": l["attributes"].get("name"), "subtitle": l["attributes"].get("subtitle")} for l in locs]})
vers = get(f"/apps/{app}/appStoreVersions", limit=5)["data"]
live = next((v for v in vers if v["attributes"]["appStoreState"] == "READY_FOR_SALE"), vers[0])
ios["version"] = {k: live["attributes"].get(k) for k in ("versionString", "appStoreState", "platform")}
ios["allVersions"] = [(v["attributes"]["versionString"], v["attributes"]["appStoreState"]) for v in vers]
for l in get(f"/appStoreVersions/{live['id']}/appStoreVersionLocalizations", limit=50)["data"]:
    a = l["attributes"]
    ios["versionLocs"].append({k: a.get(k) for k in ("locale", "keywords", "promotionalText", "description", "whatsNew")})
(out / "ios.json").write_text(json.dumps(ios, ensure_ascii=False, indent=1))

from google.oauth2 import service_account
from googleapiclient.discovery import build
creds = service_account.Credentials.from_service_account_file(str(google_service_account_file()), scopes=["https://www.googleapis.com/auth/androidpublisher"])
svc = build("androidpublisher", "v3", credentials=creds, cache_discovery=False)
pkg = cfg["play_package"]
edit = svc.edits().insert(packageName=pkg, body={}).execute()
try:
    listings = svc.edits().listings().list(packageName=pkg, editId=edit["id"]).execute().get("listings", [])
    details = svc.edits().details().get(packageName=pkg, editId=edit["id"]).execute()
finally:
    svc.edits().delete(packageName=pkg, editId=edit["id"]).execute()
(out / "android.json").write_text(json.dumps({"details": details, "listings": listings}, ensure_ascii=False, indent=1))
print("ios locales:", len(ios["versionLocs"]), "android listings:", len(listings), "live:", ios["version"], ios["allVersions"])
