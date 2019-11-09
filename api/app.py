from flask import Flask, request
app = Flask(__name__)

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

@app.route('/')
def index():
    return "Hello World!"