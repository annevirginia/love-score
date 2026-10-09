"""
Google Sheets integration module for Love Score Quiz
Saves quiz results to Google Sheet using gspread and Service Account.
Includes safe local fallback when credentials are not configured.
"""

import os
import json
import logging
from datetime import datetime
from typing import Dict, Any

logger = logging.getLogger("uvicorn.error")

SHEET_NAME = os.getenv("SHEET_NAME", "LoveScore")
GOOGLE_CREDS_PATH = os.getenv("GOOGLE_CREDS", "credentials.json")
LOCAL_BACKUP_FILE = os.path.join(os.path.dirname(__file__), "submissions_backup.json")

# Header structure requested in spec:
# Timestamp | Name 1 | Name 2 | Score | Tier | Communication | Trust | Fun | Values | Romance
HEADERS = [
    "Timestamp", "Name 1", "Name 2", "Score", "Tier",
    "Communication", "Trust", "Fun", "Values", "Romance"
]


def _append_to_local_backup(row_dict: Dict[str, Any]):
    """Saves submission locally as backup."""
    records = []
    if os.path.exists(LOCAL_BACKUP_FILE):
        try:
            with open(LOCAL_BACKUP_FILE, "r", encoding="utf-8") as f:
                records = json.load(f)
        except Exception as e:
            logger.warning(f"Could not read local backup file: {e}")
            records = []
    records.append(row_dict)
    try:
        with open(LOCAL_BACKUP_FILE, "w", encoding="utf-8") as f:
            json.dump(records, f, indent=2, ensure_ascii=False)
    except Exception as e:
        logger.error(f"Failed to write to local backup file: {e}")


def save_to_sheet(
    name1: str,
    name2: str,
    score: int,
    tier: str,
    categories: Dict[str, int]
) -> Dict[str, Any]:
    """
    Appends a row to Google Sheets.
    If credentials.json is missing or invalid, stores locally and returns graceful status.
    """
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    row_values = [
        timestamp,
        name1,
        name2,
        score,
        tier,
        categories.get("Communication", 0),
        categories.get("Trust", 0),
        categories.get("Fun", 0),
        categories.get("Values", 0),
        categories.get("Romance", 0)
    ]

    record_dict = dict(zip(HEADERS, row_values))
    _append_to_local_backup(record_dict)

    creds_full_path = GOOGLE_CREDS_PATH
    if not os.path.isabs(creds_full_path):
        creds_full_path = os.path.join(os.path.dirname(__file__), creds_full_path)

    if not os.path.exists(creds_full_path):
        logger.info(
            f"Google credentials file '{creds_full_path}' not found. "
            f"Saved result locally to submissions_backup.json."
        )
        return {
            "status": "saved_locally",
            "message": "Saved to local backup (Google credentials.json not yet configured)"
        }

    try:
        import gspread
        from google.oauth2.service_account import Credentials

        scopes = [
            "https://www.googleapis.com/auth/spreadsheets",
            "https://www.googleapis.com/auth/drive"
        ]
        credentials = Credentials.from_service_account_file(creds_full_path, scopes=scopes)
        client = gspread.authorize(credentials)

        # Open sheet or create if needed
        try:
            sheet = client.open(SHEET_NAME).sheet1
        except Exception:
            # If spreadsheet not found by title, try to create or log
            logger.warning(f"Spreadsheet '{SHEET_NAME}' not found or inaccessible.")
            return {
                "status": "sheet_not_found",
                "message": f"Google Sheet '{SHEET_NAME}' not found. Please share sheet with service account email."
            }

        # Check if header row exists
        first_row = sheet.row_values(1)
        if not first_row or len(first_row) < len(HEADERS):
            sheet.insert_row(HEADERS, index=1)

        sheet.append_row(row_values)
        logger.info(f"Successfully appended record for {name1} & {name2} to Google Sheet '{SHEET_NAME}'")
        return {"status": "saved_to_sheets", "message": f"Successfully recorded to Google Sheet '{SHEET_NAME}'"}

    except Exception as e:
        logger.error(f"Error saving to Google Sheets: {e}")
        return {
            "status": "error",
            "message": f"Google Sheets error: {str(e)} (saved locally)"
        }
