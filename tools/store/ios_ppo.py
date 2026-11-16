"""App Store Product Page Optimization (A/B test of iPhone screenshots).

Usage:
  python3 ios_ppo.py status
      Lists every test with its state, traffic share, treatments and their screenshot sets. Read-only.

  python3 ios_ppo.py upload <frames_dir> [--name "iPhone screenshots 2026-11"] [--treatment "New screenshots"]
      [--traffic 50] [--locales ru,uk,pl,en-US] [--dry-run]
      Creates the test (or reuses it by name while it is still a draft), one treatment, a localization
      per locale, and fills its iPhone sets from frames_dir/<locale>/*.png (1320x2868 from
      tools/screenshots/frames.py --device iphone). Uploads the same frames as 6.9" (APP_IPHONE_67)
      and, scaled down, as 6.5" (APP_IPHONE_65), so smaller iPhones see the treatment too.
      The test stays a draft: start it in App Store Connect (it goes to App Review first).

Facts (Apple, Nov 2026): up to 3 treatments, 90 days max, one running test per app, iOS 15+ visitors
of the default product page only. Releasing a new app version stops a running test.
"""
from __future__ import annotations

import argparse
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from credentials import load_app_config
from ios_screenshots import (
    get,
    get_all,
    post,
    delete_screenshot_set,
    session,
    set_screenshot_order,
    upload_screenshot,
    wait_delivery,
)
from PIL import Image

B2 = "https://api.appstoreconnect.apple.com/v2"
DRAFT = "PREPARE_FOR_SUBMISSION"
IPHONE_69 = "APP_IPHONE_67"  # API name of the 6.9" display type
IPHONE_65 = "APP_IPHONE_65"
SIZE_69 = (1320, 2868)
SIZE_65 = (1284, 2778)


def experiments(s, app_id: str) -> list[dict]:
    return get_all(s, f"/apps/{app_id}/appStoreVersionExperimentsV2", limit=50)


def treatments(s, exp_id: str) -> list[dict]:
    return get_all(s, f"{B2}/appStoreVersionExperiments/{exp_id}/appStoreVersionExperimentTreatments", limit=50)


def treatment_locs(s, tr_id: str) -> list[dict]:
    return get_all(s, f"/appStoreVersionExperimentTreatments/{tr_id}/appStoreVersionExperimentTreatmentLocalizations", limit=50)


def loc_sets(s, loc_id: str) -> dict[str, dict]:
    sets = get_all(s, f"/appStoreVersionExperimentTreatmentLocalizations/{loc_id}/appScreenshotSets", limit=50)
    return {st["attributes"]["screenshotDisplayType"]: st for st in sets}


def to_65(src: Path, dst: Path) -> Path:
    """Scale a 1320x2868 frame to 1284 wide and trim the top to 2778 (only background is cut)."""
    im = Image.open(src).convert("RGB")
    w, h = SIZE_65
    scaled = im.resize((w, round(im.height * w / im.width)), Image.Resampling.LANCZOS)
    extra = scaled.height - h
    scaled.crop((0, extra, w, extra + h)).save(dst, "PNG")
    return dst


def status() -> None:
    cfg = load_app_config("knite")
    s = session(cfg)
    exps = experiments(s, cfg["app_id"])
    if not exps:
        print("No tests.")
    for e in exps:
        a = e["attributes"]
        print(f"{a.get('name')!r}  state={a.get('state')}  traffic={a.get('trafficProportion')}%  "
              f"start={a.get('startDate')}  end={a.get('endDate')}  id={e['id']}")
        for t in treatments(s, e["id"]):
            print(f"  treatment {t['attributes'].get('name')!r} id={t['id']}")
            for loc in treatment_locs(s, t["id"]):
                sets = loc_sets(s, loc["id"])
                counts = {k: len(get_all(s, f"/appScreenshotSets/{v['id']}/appScreenshots", limit=50)) for k, v in sets.items()}
                print(f"    {loc['attributes']['locale']}: {counts or 'no sets'}")


def fill_set(s, loc_id: str, dtype: str, files: list[Path], existing: dict[str, dict], *, dry_run: bool, sizes: set) -> None:
    old = existing.get(dtype)
    if old:
        delete_screenshot_set(s, old, dry_run=dry_run)
    if dry_run:
        for f in files:
            upload_screenshot(s, "", f, dry_run=True, valid_sizes=sizes)
        return
    set_id = post(s, "/appScreenshotSets", {"data": {
        "type": "appScreenshotSets",
        "attributes": {"screenshotDisplayType": dtype},
        "relationships": {"appStoreVersionExperimentTreatmentLocalization": {
            "data": {"type": "appStoreVersionExperimentTreatmentLocalizations", "id": loc_id}}},
    }})["data"]["id"]
    ids = [i for f in files if (i := upload_screenshot(s, set_id, f, dry_run=False, valid_sizes=sizes))]
    stuck = wait_delivery(s, set_id, len(ids))
    if stuck:
        print(f"    warning: {len(stuck)} screenshot(s) still processing in {dtype}")
    set_screenshot_order(s, set_id, ids, dry_run=False)
    print(f"    {dtype}: {len(ids)} uploaded")


def upload(frames_dir: Path, name: str, treatment_name: str, traffic: int, locales: list[str], *, dry_run: bool) -> None:
    for loc in locales:
        files = sorted((frames_dir / loc).glob("*.png"))
        if not files:
            raise SystemExit(f"No PNGs in {frames_dir / loc}")
        for f in files:
            if Image.open(f).size != SIZE_69:
                raise SystemExit(f"{f}: expected {SIZE_69}")

    cfg = load_app_config("knite")
    s = session(cfg)
    app_id = cfg["app_id"]

    exp = next((e for e in experiments(s, app_id) if e["attributes"].get("name") == name), None)
    if exp and exp["attributes"].get("state") != DRAFT:
        raise SystemExit(f"Test {name!r} is {exp['attributes'].get('state')}; only a draft can be edited")
    if not exp:
        print(f"create test {name!r} ({traffic}% to the treatment)")
        if dry_run:
            exp_id = None
        else:
            exp_id = post(s, f"{B2}/appStoreVersionExperiments", {"data": {
                "type": "appStoreVersionExperiments",
                "attributes": {"name": name, "platform": "IOS", "trafficProportion": traffic},
                "relationships": {"app": {"data": {"type": "apps", "id": app_id}}},
            }})["data"]["id"]
    else:
        exp_id = exp["id"]
        print(f"reuse draft test {name!r} id={exp_id}")

    tr = next((t for t in treatments(s, exp_id) if t["attributes"].get("name") == treatment_name), None) if exp_id else None
    if tr:
        tr_id = tr["id"]
    else:
        print(f"create treatment {treatment_name!r}")
        tr_id = None if dry_run else post(s, "/appStoreVersionExperimentTreatments", {"data": {
            "type": "appStoreVersionExperimentTreatments",
            "attributes": {"name": treatment_name},
            "relationships": {"appStoreVersionExperimentV2": {"data": {"type": "appStoreVersionExperiments", "id": exp_id}}},
        }})["data"]["id"]

    have = {l["attributes"]["locale"]: l for l in treatment_locs(s, tr_id)} if tr_id else {}
    with tempfile.TemporaryDirectory() as td:
        for locale in locales:
            print(locale)
            files = sorted((frames_dir / locale).glob("*.png"))
            small_dir = Path(td) / locale
            small_dir.mkdir()
            small = [to_65(f, small_dir / f.name) for f in files]
            loc = have.get(locale)
            if loc:
                loc_id = loc["id"]
            elif dry_run:
                print("  would create treatment localization")
                loc_id = None
            else:
                loc_id = post(s, "/appStoreVersionExperimentTreatmentLocalizations", {"data": {
                    "type": "appStoreVersionExperimentTreatmentLocalizations",
                    "attributes": {"locale": locale},
                    "relationships": {"appStoreVersionExperimentTreatment": {
                        "data": {"type": "appStoreVersionExperimentTreatments", "id": tr_id}}},
                }})["data"]["id"]
            existing = loc_sets(s, loc_id) if loc_id else {}
            if existing:
                print(f"  sets already there: {sorted(existing)}")
            fill_set(s, loc_id, IPHONE_69, files, existing, dry_run=dry_run, sizes={SIZE_69})
            fill_set(s, loc_id, IPHONE_65, small, existing, dry_run=dry_run, sizes={SIZE_65})
    print("Draft ready. Start it in App Store Connect → the app → Product Page Optimization.")


def main() -> None:
    if len(sys.argv) < 2 or sys.argv[1] not in {"status", "upload"}:
        raise SystemExit(__doc__)
    if sys.argv[1] == "status":
        status()
        return
    ap = argparse.ArgumentParser(prog="ios_ppo.py upload")
    ap.add_argument("frames_dir", type=Path)
    ap.add_argument("--name", default="iPhone screenshots 2026-11")
    ap.add_argument("--treatment", default="New screenshots")
    ap.add_argument("--traffic", type=int, default=50, help="Percent of visitors who get a treatment")
    ap.add_argument("--locales", default="en-US")
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args(sys.argv[2:])
    upload(a.frames_dir, a.name, a.treatment, a.traffic, [x for x in a.locales.split(",") if x], dry_run=a.dry_run)


if __name__ == "__main__":
    main()
