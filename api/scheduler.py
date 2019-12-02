from datetime import timedelta, datetime
from pytz import timezone

CENTRAL = timezone("US/Central")

MORNING = (6, 12)
AFTERNOON = (12, 18)
EVENING = (18, 23)

# GACK
def converted_hour (dt):
    res = dt.hour - 6
    if (res < 0):
        res = 24 - res
    return res

def in_sleep_range (dt, sleep_start, sleep_end):
    if (sleep_start >= 12):
        # starts sleeping before midnight
        return converted_hour(dt) > sleep_start or converted_hour(dt) < sleep_end
    else:
        # late sleeper starting after midnight, simple comparison
        return converted_hour(dt) > sleep_start and converted_hour(dt) < sleep_end

def range_overlaps_slot_for_duration (range_start, range_end, slot, hours):
    # our start falls into the slot
    if converted_hour(range_start) >= slot[0] and converted_hour(range_start) <= slot[1]:
        end = converted_hour(range_start) + hours
        if end <= slot[1] and end <= converted_hour(range_end):
            return range_start
        else:
            return None
    # start doesn't fall into slot
    starting_from_prev_day = False
    range_delta = range_end - range_start
    diff = slot[0] - converted_hour(range_start)
    if converted_hour(range_start) > slot[0]:
        starting_from_prev_day = True
        diff = 24 - converted_hour(range_start)
        diff += slot[0]
    slot_from_start_delta = timedelta(hours=diff)
    if range_delta - slot_from_start_delta >= timedelta(hours=hours):
        result = range_start
        if starting_from_prev_day:
            hours_from_next = 24 - converted_hour(hours)
            result += timedelta(hours=hours_from_next)
        result.replace(hour=slot[0])
        return result
    return None
    

def naive_schedule (events, hrs=1, sleep_start=23, sleep_end=7, preferred_time=AFTERNOON, max_days=3):
    # can we fit before the first event
    best_fit = None
    now = CENTRAL.localize(datetime.now())
    print(now.tzinfo)
    print(events[0]["start"].tzinfo)
    event_len = timedelta(hours=hrs)
    if in_sleep_range(now, sleep_start, sleep_end) or in_sleep_range(now + event_len, sleep_start, sleep_end):
        if sleep_start > sleep_end and converted_hour(now) < 24:
            # Go to next day
            hour_diff = 24 - converted_hour(now)
            now = now + timedelta(hours=hour_diff)
        now.replace(hour=sleep_end)
    if (events[0]["start"] - now >= event_len):
        best_fit = now
    # find a good gap
    max_date = CENTRAL.localize(datetime.now()) + timedelta(days=max_days)
    for i in range(len(events) - 1):
        # check if we haven't gone over our max days
        if events[i]["start"] > max_date:
            break
        # if we haven't found a best fit, choose the first fit. else, find a better time, pref in our preferred time range
        if best_fit == None:
            if events[i + 1]["start"] - events[i]["end"] >= event_len:
                best_fit = events[i]["start"]
                print("found first fit")
                print(best_fit.strftime("%b %d at %I:%M %p %Z"))
        else:
            # If we find something in our preferred location, break
            better = range_overlaps_slot_for_duration(events[i]["end"], events[i + 1]["start"], preferred_time, hrs)
            if (better):
                print("found better fit")
                print(better.strftime("%b %d at %I:%M %p %Z"))
                best_fit = better
                break
    if best_fit:
        return { "start": best_fit, "end": best_fit + event_len }
    return None