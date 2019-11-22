from google.oauth2 import service_account
from googleapiclient.discovery import build
import json

JSON_PATH = "secret/tx-convergent-health-calendar-c60e8f01a468.json"
SCOPES = ["https://www.googleapis.com/auth/calendar"]
CALENDAR_API = {
    "name": "calendar",
    "version": "v3"
}

# Get oauth credentials required
my_creds = service_account.Credentials.from_service_account_file(JSON_PATH).with_scopes(SCOPES)

# Build the calendar api we're using
gcal = build(CALENDAR_API["name"], CALENDAR_API["version"], credentials=my_creds)
