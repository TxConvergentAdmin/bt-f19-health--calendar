from datetime import timedelta, datetime

RANGE = timedelta(days=1)

class Event: 
    """
    LinkedList Node in a list of events
    ...
    Attributes
    -----
    start : datetime
        Start of this event, derived by an iso formatted string
    end : datetime
        End of this event, derived by an iso formatted string
    priority : int
        From 1 - 10, with the higher priority giving it more importance. When scheduling an event with a high priority, lower 
        priority events that conflict with the one to be scheduled may be removed or re-scheduled.
    id: string
        Event id from google calendar
    next: Event
        Next event chronologically after this one
    """
    
    def __init__ (self, start, end, priority, event_id):
        self.start = datetime.fromisoformat(start)
        self.end = datetime.fromisoformat(end)
        self.priority = priority
        self.eid = event_id
        self.next = None
    
    def add(self, event):
        """
        Add new event after this event. event.next must be set to None
        ...
        Parameters
        -----
        event : Event
            An event object to be added after. If passed event is before, the state of the list doesn't change
        """
        # First check if this event is before this Event or if this already part of a list
        if event.start < self.start or event.next != None:
            return
        # Try to find free space for the event
        curr = self
        while curr.next != None
            # Can we add now?
            if curr.next.start < event.start:
                # No we can't
                curr = curr.next
            else
                # next event starts at or after passed event's start, is there free space to fit the event from current event?
                if event.end <= curr.next.start:
                    # can add without rescheduling
                    temp = curr.next
                    curr.next = event
                    event.next = temp
                    return
                else:
                    # We see some conflict. 
                    if event.priority <= curr.next.priority:
                        # We can't do anything
                        return
                    # Add this and update the next chronological event
                    temp = curr.next
                    temp.start = event.end
                    curr.next = event
                    event.next = temp
                    return
        if curr.next == None



class Scheduler:

    def __init__ (self, service, cal_id):
        self.root = None
        self.gcal = service
        self.cid = cal_id
        self.build_from_gcal()

    def build_from_gcal (self):
        # start building my stuff from here
        end_dt = datetime.now() + RANGE
        max_string = end_dt.isoformat()
        # get google calendar events
        response = self.gcal.events().list(
            calendarId=self.cid, 
            orderBy="startTime", 
            timeMax=max_string).execute()
        events = response["items"]
        # Now add this to our LL
        for event in events:
            e = Event(
                    start=event["start"]["dateTime"],
                    end=event["end"]["dateTime"],
                    priority=5,
                    event_id=event["id"]
                )
            if (self.root == None):
                self.root = e
            else:
                self.root.add(e)

