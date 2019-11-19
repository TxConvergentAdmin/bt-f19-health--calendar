from flask import Flask, request, jsonify
from pymongo import MongoClient
from google_calendar import gcal

# Instantiate flask app
app = Flask(__name__)

# Set up mongodb
client = MongoClient("localhost", 27017)
db = client.caren
collection = db["events"]

# Routes we want

#     createEvent (POST) – Create new event in our database, marking it with event priority and other info, done through directly
#         inputting event info. .Update user's GCalendar.

#     createEventFromQuestions (POST) – Create new event in our database based on answers given by prompted questions. Updates 
#         the user's GCalendar as well. (involves ML)

#     getEvents (GET) – List events starting at our current time

@app.route("/")
def index():
    return "Hello World!"

@app.route("/events")
def getEvents():
    return jsonify(
        foo="bar"
    )