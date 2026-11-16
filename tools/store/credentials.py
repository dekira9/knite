"""Shared App Store Connect + Google Play credentials (local secrets only)."""

from __future__ import annotations

import json
import os
from pathlib import Path

STORE_ROOT = Path(__file__).resolve().parent
# Shared by all projects in ~/bare, outside every repo (chmod 700 dir, 600 files).
# Override with STORE_SECRETS_DIR.
SECRETS_DIR = Path(
    os.environ.get("STORE_SECRETS_DIR", "~/bare/.secrets/store")
).expanduser()
APPS_DIR = STORE_ROOT / "apps"
METADATA_DIR = STORE_ROOT / "metadata"

APPLE_CONFIG_FILE = SECRETS_DIR / "apple.json"
GOOGLE_SERVICE_ACCOUNT_FILE = SECRETS_DIR / "service-account.json"


def _read_private_key_file(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def _default_private_key_file() -> Path:
    explicit = SECRETS_DIR / "AuthKey_7DAR5989A2.p8"
    if explicit.exists():
        return explicit
    matches = sorted(SECRETS_DIR.glob("AuthKey_*.p8"))
    if len(matches) == 1:
        return matches[0]
    if not matches:
        raise FileNotFoundError(
            f"Place AuthKey_<KEY_ID>.p8 in {SECRETS_DIR} (see README)."
        )
    raise FileNotFoundError(
        f"Multiple AuthKey_*.p8 in {SECRETS_DIR}; set private_key_file in apple.json."
    )


def load_apple_auth() -> dict:
    data: dict = {}
    if APPLE_CONFIG_FILE.exists():
        data = json.loads(APPLE_CONFIG_FILE.read_text(encoding="utf-8"))

    issuer_id = data.get("issuer_id") or os.environ.get("ASC_ISSUER_ID")
    key_id = data.get("key_id") or os.environ.get("ASC_KEY_ID")
    if not issuer_id or not key_id:
        raise FileNotFoundError(
            f"Create {APPLE_CONFIG_FILE} with issuer_id and key_id, "
            "or set ASC_ISSUER_ID / ASC_KEY_ID."
        )

    if data.get("private_key"):
        private_key = data["private_key"]
    else:
        key_file = data.get("private_key_file")
        p8 = SECRETS_DIR / key_file if key_file else _default_private_key_file()
        private_key = _read_private_key_file(p8)

    return {
        "issuer_id": issuer_id,
        "key_id": key_id,
        "private_key": private_key,
    }


def google_service_account_file() -> Path:
    if not GOOGLE_SERVICE_ACCOUNT_FILE.exists():
        raise FileNotFoundError(
            f"Copy Play service account JSON to {GOOGLE_SERVICE_ACCOUNT_FILE}"
        )
    return GOOGLE_SERVICE_ACCOUNT_FILE


def list_app_keys() -> list[str]:
    return sorted(p.stem for p in APPS_DIR.glob("*.json"))


def load_app_config(app_key: str = "knite") -> dict:
    """apps/<app_key>.json (store ids, no secrets) merged with the Apple API auth."""
    app_path = APPS_DIR / f"{app_key}.json"
    if not app_path.exists():
        raise KeyError(f"Unknown app config: {app_key} ({app_path})")
    cfg = json.loads(app_path.read_text(encoding="utf-8"))
    cfg.update(load_apple_auth())
    return cfg
