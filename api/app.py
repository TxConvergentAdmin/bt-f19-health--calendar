from flask import Flask, request, jsonify
from pymongo import MongoClient
from pymongo.collection import ReturnDocument
from bson.objectid import ObjectId
from google_calendar import gcal
from datetime import datetime, timezone
import pytz 

import scheduler

app = Flask(__name__)

# Set up mongodb
mongo_host = "localhost"
mongo_port = 27017
client = MongoClient(mongo_host, mongo_port)
# Get collections from db
db = client["caren"]
events = db["events"]
users = db["users"]

DEFAULT_UID = "i_stan_tswift"
DEFAULT_CALID = "8luv5btr9qiv0e9ifglnbvqfg8@group.calendar.google.com" # this is so dirty

def print_event (event):
    print(event["event_info"]["title"] + " | " + event["start"].strftime("%b %d at %I:%M %p %Z") + " – " + event["end"].strftime("%b %d at %I:%M %p %Z"))

def reset_db (uid):
    users.find_one_and_update({ "user_id": uid }, { "$set": { "events": [] } })
    events.delete_many({})

def populate_gcal_event (cal_id, db_event):
    eid = db_event["event_info"]
    result = gcal.events().get(calendarId=cal_id, eventId=eid).execute()
    populated = db_event.copy()
    populated["event_info"] = {
        "title": result.get("summary")
    }
    if (result.get("description")):
        populated["event_info"]["description"] = result["description"]
    if (result.get("location")):
        populated["event_info"]["location"] = result["location"]
    return populated

def populate_mongo_events (event__ids):
    populated = []
    tz = pytz.timezone("UTC")
    for eid in event__ids:
        query = events.find_one({ "_id": eid, "end.datetime":  { "$gte": datetime.now() } })
        if (query != None):
            query["start"] = datetime.fromisoformat(query["start"]["string"])
            query["end"] = datetime.fromisoformat(query["end"]["string"])
            populated.append(query)
    populated.sort( key=lambda event: event["start"] )
    return populated

def update_user_events (uid, force=False):
    if (force):
        reset_db(uid)
    gcal_events = []
    response = gcal.events().list(calendarId=DEFAULT_CALID).execute()
    for gevent in response["items"]:
        e = { 
            "event_info": gevent["id"], 
            "start": {
                "string": gevent["start"]["dateTime"],
                "datetime": datetime.fromisoformat(gevent["start"]["dateTime"])
            }, 
            "end": {
                "string": gevent["end"]["dateTime"],
                "datetime": datetime.fromisoformat(gevent["end"]["dateTime"])
            }, 
        }
        gcal_events.append(e)
    # Go through user events and see which gcal events are new
    query = users.find_one({ "user_id": uid })
    db_eids = []
    for uevent in populate_mongo_events(query["events"]):
        db_eids.append(uevent["event_info"])
    to_insert = []
    # Find events not in our db
    for event in gcal_events:
        found = False
        for eid in db_eids:
            if (event["event_info"] == eid):
                found = True
                break
        if not found:
            to_insert.append(event)
    # Insert them
    inserted_ids = []
    default_addons = { "priority": 2, "type": "any" }
    for event in to_insert:
        event.update(default_addons)
        result = events.insert_one(event)
        inserted_ids.append(result.inserted_id)
    updated = query["events"] + inserted_ids
    return users.find_one_and_update({ "user_id": uid }, { "$set": { "events": updated } }, return_document=ReturnDocument.AFTER)

"""
Routes we want

    init (POST) – Create a new entry in our database for a new user, with a list of google calendar events appended with our own 
        metadata about event priority and such. This should also take answers from the initial question screen in the app and 
        and change information about the user's entry based on that.
    
    createEvent (POST) – Create new event in our database, marking it with event priority and other info, done through directly
        inputting event info. .Update user's GCalendar.

    createEventFromQuestions (POST) – Create new event in our database based on answers given by prompted questions. Updates 
        the user's GCalendar as well. (involves ML)

    editEvent (POST) – Edit event in our database, updating event in user's GCalendar as well

    deleteEvent (POST) – Delete a user event in both our database and in the user's GCalendar as well

    getEvents (GET) – List events starting at our current time

"""

@app.route("/")
def index():
    return "Hello World"

@app.route("/events", methods=["GET"])
def get_events ():
    # Get request args
    uid = request.args.get("uid")
    oauth_code = request.args.get("code")
    # We'll probably just be using the default for our MVP
    if (uid == None):
        uid = DEFAULT_UID
    # reset_db(uid)
    query = update_user_events(uid, force=True)
    # if (query == None):
    #     # We will create a new gcalendar for this user
    #     service = gcal # Fix this later
    #     response = service.calendars().insert(body={
    #         "summary": "Caren Calendar",
    #         "description": "A calendar automatically generated by a scheduler."
    #     }).execute()
    #     # Lets add this uid into the database of users and create a new calendar in its calendars
    #     doc = {
    #         "user_id": uid,
    #         "calendar_id": response["id"],
    #         "events": []
    #     }
    #     result = users.insert_one(doc)
    #     if (result.acknowledged):
    #         query = doc
    # Get the events
    # { user_id: String, events: [ List ] }
    # events = populate_mongo_events(query["events"])
    events = populate_mongo_events(query["events"])
    json_events = []
    for event in events:
        with_gcal = populate_gcal_event(DEFAULT_CALID, event)
        del with_gcal["_id"]
        json_events.append(with_gcal)
    return jsonify(user_id=uid, cal_id=query["calendar_id"], events=json_events)

@app.route("/events/schedule", methods=["POST"])
def schedule_event ():
    # passes in a uid and how many to schedule
    uid = request.json.get("uid")
    # num_to_schedule = request.form.get("count")
    event_info = request.json.get("info")
    # Info will contain an event title and other optional things like location and description and priority
    if (uid == None):
        uid = DEFAULT_UID
    # Get the user's events and build dictionary of starts and ends from it
    query = users.find_one({"user_id": uid})
    user_events = populate_mongo_events(query["events"])
    for event in user_events:
        del event["_id"]
    # Pass this into a scheduler
    scheduled_slot = scheduler.naive_schedule(user_events)
    # Insert new event into gcalendar
    body = {
        "summary": event_info["title"],
        "start": {
            "dateTime": scheduled_slot["start"].isoformat()
        }, 
        "end": {
            "dateTime": scheduled_slot["end"].isoformat()
        }
    }
    desc = event_info.get("description")
    loc = event_info.get("location")
    if desc:
        body["description"] = desc
    if loc:
        body["location"] = loc
    result = gcal.events().insert(calendarId=DEFAULT_CALID, body=body).execute()
    gcal_eid = result["id"]
    # Put in our db
    priority = event_info.get("priority")
    etype = event_info.get("type")
    doc_body = {
        "event_info": gcal_eid,
        "start": {
            "string": scheduled_slot["start"].isoformat(),
            "datetime": scheduled_slot["start"]
        },
        "end": {
            "string": scheduled_slot["end"].isoformat(),
            "datetime": scheduled_slot["end"]
        }
    }
    if priority:
        doc_body["priority"] = priority
    if etype:
        doc_body["type"] = etype
    doc_id = events.insert_one(doc_body).inserted_id
    users.find_one_and_update({ "user_id": uid }, { "$push": { "events": doc_id } })
    # Return event scheduled
    return jsonify(event=body)
    