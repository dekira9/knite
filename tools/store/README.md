# Store API (Raglan Planner)

CLI for App Store Connect and Google Play listings. Not part of the Expo app (same setup as KalimbaDrop `tools/store`).

App: bundle / package `com.ilyadylko.knitapp`, App Store app id `6740062991`.

## Setup

```bash
cd tools/store
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Secrets (`~/bare/.secrets/store/`, outside every repo)

One folder shared by all projects in `~/bare` (ExamPrep-platform, KalimbaDrop, knite use the same keys), kept out of repos so AI agents, Cursor indexing and project archives never see it. Folder `chmod 700`, files `chmod 600`. Override the path with `STORE_SECRETS_DIR`. The repo `secrets/` folder holds only `apple.json.example`.

| File | Purpose |
|------|---------|
| `apple.json` | Team key: `issuer_id`, `key_id`, optional `private_key_file` (`apple.json.example`). Individual key: `"key_type": "individual"`, `key_id`, no issuer (`apple.individual.json.example`) |
| `AuthKey_<KEY_ID>.p8` | App Store Connect API key |
| `service-account.json` | Google Play Android Publisher API |

The Play service account (`client_email` in `service-account.json`) must be invited in Play Console → Users and permissions for `com.ilyadylko.knitapp` with store listing permission. `python3 play.py check` tells you whether it is.

Optional `credentials.json` here overrides `app_id`, `support_url`, `privacy_url`, `whats_new`.

### Access limited to some apps (Individual key)

A Team key (Integrations → Team Keys) opens every app of the account. For someone who should reach only their own apps:

- **App Store:** invite them in Users and Access with **App Manager** only (Finance, Customer Support and Admin always mean All Apps), untick Access to All Apps, tick their apps. They sign in and create their own key under Integrations → **Individual Keys**, then put `AuthKey_<KEY_ID>.p8` and an `apple.json` like `apple.individual.json.example` in their `~/bare/.secrets/store/`. The JWT then carries `sub: "user"` instead of `iss` (`credentials.apple_token`). Individual keys cannot use Sales and Finance or Provisioning.
- **Google Play:** a separate service account (new JSON key in Google Cloud), invited in Play Console → Users and permissions with **app permissions** for their apps only, no account permissions. Its JSON is their `service-account.json`.

Check both with `python3 asm.py check` and `python3 play.py check`.

## Listing copy

`metadata/*.json` map locale → text. `pull` writes them from the live store; edit, `validate`, then push.

| File | Store field |
|------|-------------|
| `ios_name.json`, `ios_subtitle.json` | App Store name / subtitle (`asm.py name`) |
| `ios_keywords.json`, `ios_description.json`, `ios_promo.json` | version keywords / description / promotional text |
| `play_title.json`, `play_short.json`, `play_full.json` | Play title / short / full description |

## App Store Connect

```bash
python3 asm.py check          # access + current version state
python3 asm.py pull           # live copy -> metadata/ios_*.json
python3 asm.py validate
python3 asm.py whats-new --text "Bug fixes"
python3 asm.py keywords | description | promo | name
python3 asm.py support [--url ...] | privacy [--url ...]
python3 asm.py category [--primary LIFESTYLE --secondary none]
```

Keywords, description, What's New and name change only on a version in an editable state (`PREPARE_FOR_SUBMISSION`, rejected, `WAITING_FOR_REVIEW`): create the new version in App Store Connect first. Promotional text can change on the live version.

## Google Play

```bash
python3 play.py check         # opens and discards an edit
python3 play.py pull          # live listings -> metadata/play_*.json
python3 play.py validate
python3 play.py update --dry-run
python3 play.py update        # commits; on any error the edit is discarded
```

## More tools (ported from ExamPrep-platform)

All take the app ids from `apps/knite.json` (no secrets there) and the keys from `~/bare/.secrets/store/`. Snapshots and backups go to `docs/aso-snapshots/`.

```bash
python3 dump_listings.py [out_dir]                   # read-only dump of live iOS + Play listings
python3 ios_listings.py apply <metadata.json> [--dry-run]   # name/subtitle/keywords, backup first
python3 ios_listings.py rollback <backup.json>
python3 play_listings.py apply <listings.json> [--dry-run]  # title/short/full, backup first
python3 play_listings.py rollback <backup.json>
python3 ios_screenshots.py backup [out_dir]          # download every live screenshot
python3 ios_screenshots.py replace-ipad <frames_dir> [--version X.Y.Z] [--dry-run]
python3 ios_screenshots.py cpp <spec.json> [--dry-run]       # Custom Product Pages (drafts)
python3 ios_ppo.py status                            # Product Page Optimization tests
python3 ios_ppo.py upload <frames_dir> --locales en-US [--dry-run]
python3 set_subscription_price.py --show --apple-product <id> --play <sub>:<basePlan>
python3 set_subscription_price.py --usd 9.99 --dry-run --apple-product <id> --play <sub>:<basePlan>
python3 retention_messaging.py show|apply|submit [--spec metadata/retention_messaging.json]
```

Each script's docstring has the full usage. `retention_messaging.py` needs a spec at `metadata/retention_messaging.json` (`{"app": "knite", "message": {"referenceName", "subscriptions", "localizations"}, ...}`, see the docstring); knite has none yet.

## EAS

Store keys live outside the repo (`~/bare/.secrets/store/`), so EAS uploads cannot include them. EAS uses `.gitignore` (there is no `.easignore`), which still excludes `tools/store/secrets/**` and `tools/store/venv/`.
