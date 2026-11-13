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
| `apple.json` | `issuer_id`, `key_id`, optional `private_key_file` (see `apple.json.example`) |
| `AuthKey_<KEY_ID>.p8` | App Store Connect API key |
| `service-account.json` | Google Play Android Publisher API |

The Play service account (`client_email` in `service-account.json`) must be invited in Play Console → Users and permissions for `com.ilyadylko.knitapp` with store listing permission. `python3 play.py check` tells you whether it is.

Optional `credentials.json` here overrides `app_id`, `support_url`, `privacy_url`, `whats_new`.

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

## EAS

Store keys live outside the repo (`~/bare/.secrets/store/`), so EAS uploads cannot include them. EAS uses `.gitignore` (there is no `.easignore`), which still excludes `tools/store/secrets/**` and `tools/store/venv/`.
