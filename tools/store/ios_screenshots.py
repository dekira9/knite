"""iOS screenshots: back up the live set, replace iPad frames on an editable version, and CPP uploads.

Usage:
  python3 ios_screenshots.py backup [out_dir]
      Downloads every screenshot of the live version (all locales, all device sizes) at original size.
      Default out_dir: docs/aso-snapshots/ios-screenshots-<today>/
      Files are stored once per content hash in files/; manifest.json maps locale → display type → ordered files.
      Read-only.

  python3 ios_screenshots.py replace-ipad <frames_dir> [--version 1.9.2] [--dry-run]
      Replaces APP_IPAD_PRO_3GEN_129 screenshots on the given app store version (editable states only).
      frames_dir contains locale subdirs (ru, uk, pl, en-US, …) with 2064×2752 PNGs from tools/screenshots/frames.py.

  python3 ios_screenshots.py cpp <spec.json> [--dry-run]
      Creates (or reuses by name) Custom Product Pages and replaces their 6.9" screenshots. Spec:
      tools/screenshots/cpp/upload.json (page dir → name, store locale → frames locale dir). See docs/ASO_CPP.md.
      Pages stay drafts: nothing is submitted for review.

  python3 ios_screenshots.py cpp-submit <spec.json> [--dry-run]
      Assigns the spec's organic keywords per locale to each page's draft and sends the pages for review.
"""
from __future__ import annotations

import argparse
import datetime
import hashlib
import json
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import jwt
import requests
from credentials import load_app_config
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
B = "https://api.appstoreconnect.apple.com/v1"


def session(cfg):
    tok = jwt.encode({"iss": cfg["issuer_id"], "iat": int(time.time()), "exp": int(time.time()) + 1100, "aud": "appstoreconnect-v1"},
                     cfg["private_key"], algorithm="ES256", headers={"kid": cfg["key_id"], "typ": "JWT"})
    s = requests.Session(); s.trust_env = False
    s.headers["Authorization"] = f"Bearer {tok}"
    return s


def get(s, url, **p):
    r = s.get(url if url.startswith("http") else B + url, params=p, timeout=60)
    if r.status_code >= 400:
        raise RuntimeError(f"GET {url} {r.status_code}: {r.text[:500]}")
    return r.json()


def get_all(s, url, **p):
    out, nxt = [], None
    j = get(s, url, **p)
    while True:
        out += j["data"]
        nxt = j.get("links", {}).get("next")
        if not nxt:
            return out
        j = get(s, nxt)


def post(s, url, body):
    r = s.post(url if url.startswith("http") else B + url, json=body, timeout=120)
    if r.status_code >= 400:
        raise RuntimeError(f"POST {url} {r.status_code}: {r.text[:500]}")
    return r.json()


def patch(s, url, body):
    r = s.patch(url if url.startswith("http") else B + url, json=body, timeout=120)
    if r.status_code >= 400:
        raise RuntimeError(f"PATCH {url} {r.status_code}: {r.text[:500]}")
    return r.json() if r.content else {}  # relationship PATCH answers 204 with no body


def delete(s, url):
    r = s.delete(url if url.startswith("http") else B + url, timeout=120)
    if r.status_code >= 400:
        raise RuntimeError(f"DELETE {url} {r.status_code}: {r.text[:500]}")


IPAD_3GEN = "APP_IPAD_PRO_3GEN_129"
IPAD_LEGACY = "APP_IPAD_PRO_129"
EDITABLE_STATES = {
    "PREPARE_FOR_SUBMISSION",
    "DEVELOPER_REJECTED",
    "REJECTED",
    "METADATA_REJECTED",
    "INVALID_BINARY",
}
VALID_SIZES = {(2064, 2752), (2048, 2732)}


def md5_hex(data: bytes) -> str:
    return hashlib.md5(data).hexdigest()


def find_version(s, app_id: str, version_string: str) -> dict:
    vers = get_all(s, f"/apps/{app_id}/appStoreVersions", limit=50)
    matches = [v for v in vers if v["attributes"]["versionString"] == version_string]
    if not matches:
        raise RuntimeError(f"No app store version {version_string!r}")
    if len(matches) > 1:
        matches.sort(key=lambda v: v["attributes"].get("createdDate", ""), reverse=True)
    v = matches[0]
    state = v["attributes"]["appStoreState"]
    if state not in EDITABLE_STATES:
        raise RuntimeError(f"Version {version_string} is {state!r}; must be one of {sorted(EDITABLE_STATES)}")
    return v


def sets_by_type(s, loc_id: str) -> dict[str, dict]:
    sets = get_all(s, f"/appStoreVersionLocalizations/{loc_id}/appScreenshotSets", limit=50)
    return {st["attributes"]["screenshotDisplayType"]: st for st in sets}


def delete_screenshots_in_set(s, st: dict, *, dry_run: bool) -> None:
    sid = st["id"]
    dtype = st["attributes"]["screenshotDisplayType"]
    shots = get_all(s, f"/appScreenshotSets/{sid}/appScreenshots", limit=50)
    if dry_run:
        print(f"    would delete {len(shots)} screenshot(s) in {dtype}")
        return
    for sh in shots:
        delete(s, f"/appScreenshots/{sh['id']}")


def delete_screenshot_set(s, st: dict, *, dry_run: bool) -> None:
    sid = st["id"]
    dtype = st["attributes"]["screenshotDisplayType"]
    shots = get_all(s, f"/appScreenshotSets/{sid}/appScreenshots", limit=50)
    if dry_run:
        print(f"    would delete set {dtype} ({len(shots)} screenshots)")
        return
    for sh in shots:
        delete(s, f"/appScreenshots/{sh['id']}")
    delete(s, f"/appScreenshotSets/{sid}")


def create_ipad_set(s, loc_id: str) -> str:
    body = {
        "data": {
            "type": "appScreenshotSets",
            "attributes": {"screenshotDisplayType": IPAD_3GEN},
            "relationships": {
                "appStoreVersionLocalization": {"data": {"type": "appStoreVersionLocalizations", "id": loc_id}}
            },
        }
    }
    return post(s, "/appScreenshotSets", body)["data"]["id"]


def upload_screenshot(
    s, set_id: str, path: Path, *, dry_run: bool, valid_sizes: set[tuple[int, int]] = VALID_SIZES
) -> str | None:
    data = path.read_bytes()
    w, h = Image.open(path).size
    if (w, h) not in valid_sizes:
        raise RuntimeError(f"{path}: size {w}x{h}, expected one of {sorted(valid_sizes)}")
    if dry_run:
        print(f"    would upload {path.name} ({len(data)} bytes, {w}x{h})")
        return None
    body = {
        "data": {
            "type": "appScreenshots",
            "attributes": {"fileName": path.name, "fileSize": len(data)},
            "relationships": {"appScreenshotSet": {"data": {"type": "appScreenshotSets", "id": set_id}}},
        }
    }
    j = post(s, "/appScreenshots", body)
    shot_id = j["data"]["id"]
    ops = j["data"]["attributes"].get("uploadOperations") or []
    up = requests.Session()
    up.trust_env = False
    for op in ops:
        start, end = op["offset"], op["offset"] + op["length"]
        chunk = data[start:end]
        headers = {h["name"]: h["value"] for h in op.get("requestHeaders", [])}
        method = op.get("method", "PUT").upper()
        url = op["url"]
        if method == "PUT":
            r = up.put(url, data=chunk, headers=headers, timeout=300)
        else:
            r = up.request(method, url, data=chunk, headers=headers, timeout=300)
        if r.status_code >= 400:
            raise RuntimeError(f"Upload {path.name} {method} {r.status_code}: {r.text[:300]}")
    patch(
        s,
        f"/appScreenshots/{shot_id}",
        {
            "data": {
                "type": "appScreenshots",
                "id": shot_id,
                "attributes": {"uploaded": True, "sourceFileChecksum": md5_hex(data)},
            }
        },
    )
    return shot_id


def wait_delivery(s, set_id: str, expected: int, timeout: float = 150) -> list[str]:
    """Wait until every screenshot in the set is COMPLETE; return ids still processing at timeout."""
    deadline = time.time() + timeout
    pending: list[str] = []
    while time.time() < deadline:
        shots = get_all(s, f"/appScreenshotSets/{set_id}/appScreenshots", limit=50)
        if len(shots) < expected:
            time.sleep(3)
            continue
        pending = []
        for sh in shots:
            st = sh["attributes"].get("assetDeliveryState") or {}
            if st.get("state") == "FAILED":
                raise RuntimeError(f"Screenshot {sh['id']} FAILED: {st.get('errors')}")
            if st.get("state") != "COMPLETE":
                pending.append(sh["id"])
        if not pending:
            return []
        time.sleep(3)
    return pending


def set_screenshot_order(s, set_id: str, ids: list[str], *, dry_run: bool) -> None:
    if dry_run or not ids:
        return
    patch(
        s,
        f"/appScreenshotSets/{set_id}/relationships/appScreenshots",
        {"data": [{"type": "appScreenshots", "id": i} for i in ids]},
    )


def replace_ipad(frames_dir: Path, version_string: str, *, dry_run: bool) -> None:
    cfg = load_app_config("knite")
    s = session(cfg)
    version = find_version(s, cfg["app_id"], version_string)
    locs = get_all(s, f"/appStoreVersions/{version['id']}/appStoreVersionLocalizations", limit=50)
    loc_by_locale = {loc["attributes"]["locale"]: loc for loc in locs}
    frame_locales = sorted(p.name for p in frames_dir.iterdir() if p.is_dir())
    summary: dict[str, str] = {}

    for locale in frame_locales:
        loc = loc_by_locale.get(locale)
        if not loc:
            print(f"Warning: {locale} not on version {version_string}, skipping")
            continue
        loc_dir = frames_dir / locale
        files = sorted(loc_dir.glob("*.png"))
        if not files:
            print(f"Warning: no PNGs in {loc_dir}, skipping")
            continue
        print(f"{locale}: {len(files)} file(s)" + (" (dry-run)" if dry_run else ""))

        by_type = sets_by_type(s, loc["id"])
        legacy = by_type.get(IPAD_LEGACY)
        if legacy:
            print(f"  delete legacy {IPAD_LEGACY}")
            delete_screenshot_set(s, legacy, dry_run=dry_run)

        target = by_type.get(IPAD_3GEN)
        set_id: str | None = target["id"] if target else None
        if target:
            print(f"  clear {IPAD_3GEN} set {set_id}")
            delete_screenshots_in_set(s, target, dry_run=dry_run)
        else:
            print(f"  create {IPAD_3GEN} set")
            if not dry_run:
                set_id = create_ipad_set(s, loc["id"])

        ids: list[str] = []
        for f in files:
            sid = upload_screenshot(s, set_id or "dry-run-set", f, dry_run=dry_run)
            if sid:
                ids.append(sid)

        if not dry_run and set_id:
            # Apple processing sometimes stalls in UPLOAD_COMPLETE; re-uploading the stuck file fixes it.
            path_by_id = dict(zip(ids, files))
            for attempt in range(4):
                stuck = wait_delivery(s, set_id, len(files))
                if not stuck:
                    break
                if attempt == 3:
                    raise RuntimeError(f"{locale}: still processing after re-uploads: {[path_by_id[i].name for i in stuck]}")
                for old_id in stuck:
                    path = path_by_id.pop(old_id)
                    print(f"  re-upload stuck {path.name}")
                    delete(s, f"/appScreenshots/{old_id}")
                    new_id = upload_screenshot(s, set_id, path, dry_run=False)
                    if new_id:
                        path_by_id[new_id] = path
                        ids[ids.index(old_id)] = new_id
            set_screenshot_order(s, set_id, ids, dry_run=False)
            summary[locale] = f"{len(files)} uploaded → {IPAD_3GEN}"
        else:
            summary[locale] = f"{len(files)} planned"

    print("Summary:")
    for loc, msg in sorted(summary.items()):
        print(f"  {loc}: {msg}")


IPHONE_67 = "APP_IPHONE_67"
IPHONE_67_SIZES = {(1320, 2868), (1290, 2796)}
CPP_EDITABLE = {"PREPARE_FOR_SUBMISSION", "REJECTED"}


def _rel(kind: str, id_: str) -> dict:
    return {"data": {"type": kind, "id": id_}}


def cpp_upload(spec_path: Path, *, dry_run: bool, only_ipad: bool = False) -> None:
    """spec: {"frames_root": "docs/aso-cpp/iphone", "pages": {"<dir>": {"name": "...", "locales": {"<store locale>": "<frames locale dir>"}}}}.
    Creates the page (or reuses it by name), takes its editable version (creates one when the only
    version is live), and replaces the 6.9" screenshot set of every listed locale. Drafts only."""
    spec = json.loads(spec_path.read_text(encoding="utf-8"))
    root = ROOT / spec["frames_root"]
    cfg = load_app_config("knite")
    s = session(cfg)
    app_id = cfg["app_id"]
    existing = {pg["attributes"]["name"]: pg for pg in get_all(s, f"/apps/{app_id}/appCustomProductPages", limit=50)}
    print("existing pages:", {n: pg["attributes"].get("url") for n, pg in existing.items()} or "none")

    for page_dir, page in spec["pages"].items():
        name, locales = page["name"], page["locales"]
        for locale, src in locales.items():
            files = sorted((root / page_dir / src).glob("*.png"))
            if not files:
                raise RuntimeError(f"No frames in {root / page_dir / src}")
        print(f"[{name}]")
        pg = existing.get(name)
        version = None
        if pg:
            versions = get_all(s, f"/appCustomProductPages/{pg['id']}/appCustomProductPageVersions", limit=50)
            print("  versions:", [v["attributes"]["state"] for v in versions])
            version = next((v for v in versions if v["attributes"]["state"] in CPP_EDITABLE), None)
            busy = [v["attributes"]["state"] for v in versions if v["attributes"]["state"] in ("WAITING_FOR_REVIEW", "IN_REVIEW", "READY_FOR_REVIEW")]
            if not version and busy:
                raise RuntimeError(f"{name}: a version is {busy[0]}, wait for the review or cancel it in ASC")
        if dry_run:
            print("  would", "reuse the draft version" if version else ("add a draft version" if pg else "create the page"),
                  "and upload", {loc: len(list((root / page_dir / src).glob('*.png'))) for loc, src in locales.items()})
            continue
        if not pg:
            body = {
                "data": {
                    "type": "appCustomProductPages",
                    "attributes": {"name": name},
                    "relationships": {
                        "app": _rel("apps", app_id),
                        "appCustomProductPageVersions": {"data": [{"type": "appCustomProductPageVersions", "id": "${v}"}]},
                    },
                },
                "included": [
                    {
                        "type": "appCustomProductPageVersions",
                        "id": "${v}",
                        "relationships": {
                            "appCustomProductPageLocalizations": {
                                "data": [{"type": "appCustomProductPageLocalizations", "id": "${l-%s}" % loc} for loc in locales]
                            }
                        },
                    }
                ]
                + [
                    {"type": "appCustomProductPageLocalizations", "id": "${l-%s}" % loc, "attributes": {"locale": loc}}
                    for loc in locales
                ],
            }
            pg = post(s, "/appCustomProductPages", body)["data"]
            version = get_all(s, f"/appCustomProductPages/{pg['id']}/appCustomProductPageVersions", limit=50)[0]
            print("  created page", pg["id"])
        elif not version:
            body = {
                "data": {
                    "type": "appCustomProductPageVersions",
                    "relationships": {"appCustomProductPage": _rel("appCustomProductPages", pg["id"])},
                }
            }
            version = post(s, "/appCustomProductPageVersions", body)["data"]
            print("  added draft version", version["id"])

        locs = get_all(s, f"/appCustomProductPageVersions/{version['id']}/appCustomProductPageLocalizations", limit=50)
        loc_by = {x["attributes"]["locale"]: x for x in locs}
        for locale, src in locales.items():
            loc = loc_by.get(locale)
            if not loc:
                body = {
                    "data": {
                        "type": "appCustomProductPageLocalizations",
                        "attributes": {"locale": locale},
                        "relationships": {"appCustomProductPageVersion": _rel("appCustomProductPageVersions", version["id"])},
                    }
                }
                loc = post(s, "/appCustomProductPageLocalizations", body)["data"]
            sets = get_all(s, f"/appCustomProductPageLocalizations/{loc['id']}/appScreenshotSets", limit=50)
            # An app that runs on iPad cannot send a page for review without a 13" iPad set: the
            # page gets the main iPad frames once (`ipad_root`), they are not replaced on later runs.
            has_ipad = any(st["attributes"]["screenshotDisplayType"] == IPAD_3GEN for st in sets)
            if spec.get("ipad_root") and not has_ipad:
                ipad_files = sorted((ROOT / spec["ipad_root"] / src).glob("*.png"))
                ipad_set = post(s, "/appScreenshotSets", {"data": {
                    "type": "appScreenshotSets",
                    "attributes": {"screenshotDisplayType": IPAD_3GEN},
                    "relationships": {"appCustomProductPageLocalization": _rel("appCustomProductPageLocalizations", loc["id"])},
                }})["data"]["id"]
                ipad_ids = [upload_screenshot(s, ipad_set, f, dry_run=False) for f in ipad_files]
                wait_delivery(s, ipad_set, len(ipad_files), timeout=600)
                set_screenshot_order(s, ipad_set, [i for i in ipad_ids if i], dry_run=False)
                print(f"  {locale}: {len(ipad_files)} iPad uploaded")
            if only_ipad:
                continue
            for st in sets:  # one iPhone size per page: drop older sets (6.5") so they do not outrank the new one
                if st["attributes"]["screenshotDisplayType"] != IPAD_3GEN:
                    delete_screenshot_set(s, st, dry_run=False)
            body = {
                "data": {
                    "type": "appScreenshotSets",
                    "attributes": {"screenshotDisplayType": IPHONE_67},
                    "relationships": {"appCustomProductPageLocalization": _rel("appCustomProductPageLocalizations", loc["id"])},
                }
            }
            set_id = post(s, "/appScreenshotSets", body)["data"]["id"]
            files = sorted((root / page_dir / src).glob("*.png"))
            ids = [upload_screenshot(s, set_id, f, dry_run=False, valid_sizes=IPHONE_67_SIZES) for f in files]
            pending = wait_delivery(s, set_id, len(files), timeout=600)
            set_screenshot_order(s, set_id, [i for i in ids if i], dry_run=False)
            print(f"  {locale}: {len(files)} uploaded" + (f", {len(pending)} still processing at Apple" if pending else ""))
        print("  page url:", get(s, f"/appCustomProductPages/{pg['id']}")["data"]["attributes"].get("url"))


def cpp_submit(spec_path: Path, *, dry_run: bool) -> None:
    """Assign the spec's `keywords` ({store locale: [tokens]}; only tokens of that locale's approved
    keyword field can be picked) to each page's draft version, then send all the pages for review
    in one submission."""
    spec = json.loads(spec_path.read_text(encoding="utf-8"))
    cfg = load_app_config("knite")
    s = session(cfg)
    app_id = cfg["app_id"]
    existing = {pg["attributes"]["name"]: pg for pg in get_all(s, f"/apps/{app_id}/appCustomProductPages", limit=50)}
    live = next(v for v in get(s, f"/apps/{app_id}/appStoreVersions", limit=10)["data"] if v["attributes"]["appStoreState"] == "READY_FOR_SALE")
    field = {
        loc["attributes"]["locale"]: {k["id"] for k in get_all(s, f"/appStoreVersionLocalizations/{loc['id']}/searchKeywords", limit=200)}
        for loc in get_all(s, f"/appStoreVersions/{live['id']}/appStoreVersionLocalizations", limit=50)
    }
    versions = []
    for page in spec["pages"].values():
        name = page["name"]
        pg = existing[name]
        vs = get_all(s, f"/appCustomProductPages/{pg['id']}/appCustomProductPageVersions", limit=50)
        version = next((v for v in vs if v["attributes"]["state"] in CPP_EDITABLE), None)
        if not version:
            raise RuntimeError(f"{name}: no draft version, states {[v['attributes']['state'] for v in vs]}")
        versions.append(version)
        locs = get_all(s, f"/appCustomProductPageVersions/{version['id']}/appCustomProductPageLocalizations", limit=50)
        for loc in locs:
            locale = loc["attributes"]["locale"]
            want = list(page.get("keywords", {}).get(locale, []))
            missing = [k for k in want if k not in field.get(locale, set())]
            if missing:
                raise RuntimeError(f"{name} {locale}: {missing} not in the approved keyword field {sorted(field.get(locale, []))}")
            rel = f"/appCustomProductPageLocalizations/{loc['id']}/relationships/searchKeywords"
            have = [k["id"] for k in get_all(s, f"/appCustomProductPageLocalizations/{loc['id']}/searchKeywords", limit=200)]
            add, drop = [k for k in want if k not in have], [k for k in have if k not in want]
            print(f"[{name}] {locale}: {want or '-'}" + (f" (+{add} -{drop})" if add or drop else ""))
            if dry_run:
                continue
            if drop:
                r = s.delete(B + rel, json={"data": [{"type": "appKeywords", "id": k} for k in drop]}, timeout=120)
                if r.status_code >= 400:
                    raise RuntimeError(f"DELETE {rel} {r.status_code}: {r.text[:500]}")
            if add:
                r = s.post(B + rel, json={"data": [{"type": "appKeywords", "id": k} for k in add]}, timeout=120)
                if r.status_code >= 400:
                    raise RuntimeError(f"POST {rel} {r.status_code}: {r.text[:500]}")
    if dry_run:
        print("would submit", len(versions), "page version(s) for review")
        return
    open_subs = get_all(s, "/reviewSubmissions", **{"filter[app]": app_id, "filter[platform]": "IOS", "filter[state]": "READY_FOR_REVIEW"})
    sub = None
    for o in open_subs:
        if get_all(s, f"/reviewSubmissions/{o['id']}/items", limit=50):
            raise RuntimeError(f"An open review submission {o['id']} already holds items: finish or remove it in ASC first")
        sub = o
    if not sub:
        sub = post(s, "/reviewSubmissions", {"data": {"type": "reviewSubmissions", "attributes": {"platform": "IOS"},
                                                      "relationships": {"app": _rel("apps", app_id)}}})["data"]
    for v in versions:
        post(s, "/reviewSubmissionItems", {"data": {"type": "reviewSubmissionItems", "relationships": {
            "reviewSubmission": _rel("reviewSubmissions", sub["id"]),
            "appCustomProductPageVersion": _rel("appCustomProductPageVersions", v["id"])}}})
    out = patch(s, f"/reviewSubmissions/{sub['id']}", {"data": {"type": "reviewSubmissions", "id": sub["id"], "attributes": {"submitted": True}}})
    print("submitted", sub["id"], "state", out.get("data", {}).get("attributes", {}).get("state"))


def asset_url(asset: dict) -> str:
    return asset["templateUrl"].replace("{w}", str(asset["width"])).replace("{h}", str(asset["height"])).replace("{f}", "png")


def live_version(s, app):
    vers = get(s, f"/apps/{app}/appStoreVersions", limit=10)["data"]
    return next(v for v in vers if v["attributes"]["appStoreState"] == "READY_FOR_SALE")


def backup(out: Path):
    cfg = load_app_config("knite")
    s = session(cfg)
    v = live_version(s, cfg["app_id"])
    files = out / "files"; files.mkdir(parents=True, exist_ok=True)
    manifest = {"app_id": cfg["app_id"], "version": v["attributes"]["versionString"], "date": str(datetime.date.today()), "locales": {}}
    for loc in get_all(s, f"/appStoreVersions/{v['id']}/appStoreVersionLocalizations", limit=50):
        locale = loc["attributes"]["locale"]
        sets = get_all(s, f"/appStoreVersionLocalizations/{loc['id']}/appScreenshotSets", limit=50)
        manifest["locales"][locale] = {}
        for st in sets:
            dtype = st["attributes"]["screenshotDisplayType"]
            shots = get_all(s, f"/appScreenshotSets/{st['id']}/appScreenshots", limit=50)
            entries = []
            for sh in shots:
                a = sh["attributes"]
                if not a.get("imageAsset"):
                    continue
                data = s.get(asset_url(a["imageAsset"]), timeout=120).content
                h = hashlib.sha256(data).hexdigest()[:16]
                name = f"{h}.png"
                if not (files / name).exists():
                    (files / name).write_bytes(data)
                entries.append({"file": f"files/{name}", "fileName": a.get("fileName"),
                                "width": a["imageAsset"]["width"], "height": a["imageAsset"]["height"]})
            manifest["locales"][locale][dtype] = entries
        print(locale, {k: len(x) for k, x in manifest["locales"][locale].items()})
    (out / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=1))
    print("saved", out, "unique files:", len(list(files.iterdir())))


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else ""
    if cmd == "backup":
        backup(Path(sys.argv[2]) if len(sys.argv) > 2 else ROOT / "docs/aso-snapshots" / f"ios-screenshots-{datetime.date.today()}")
    elif cmd == "replace-ipad":
        rp = argparse.ArgumentParser(prog="ios_screenshots.py replace-ipad")
        rp.add_argument("frames_dir", type=Path)
        rp.add_argument("--version", default="1.9.2")
        rp.add_argument("--dry-run", action="store_true")
        ns = rp.parse_args(sys.argv[2:])
        replace_ipad(ns.frames_dir, ns.version, dry_run=ns.dry_run)
    elif cmd == "cpp-submit":
        cp = argparse.ArgumentParser(prog="ios_screenshots.py cpp-submit")
        cp.add_argument("spec", type=Path)
        cp.add_argument("--dry-run", action="store_true")
        ns = cp.parse_args(sys.argv[2:])
        cpp_submit(ns.spec, dry_run=ns.dry_run)
    elif cmd == "cpp":
        cp = argparse.ArgumentParser(prog="ios_screenshots.py cpp")
        cp.add_argument("spec", type=Path)
        cp.add_argument("--dry-run", action="store_true")
        cp.add_argument("--only-ipad", action="store_true", help="Add the missing iPad sets, leave iPhone frames as they are")
        ns = cp.parse_args(sys.argv[2:])
        cpp_upload(ns.spec, dry_run=ns.dry_run, only_ipad=ns.only_ipad)
    else:
        print(__doc__)
        sys.exit(1)
