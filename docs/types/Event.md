Event
=====

User Scenarios
--------------
1. Admin is having a meeting or general event and wants to share with attendees.
2. Admin wants to know who can attend: Yes|Maybe|No
3. Admin wants to provide an early reminder (Alert) to users for the event.
4. Admin wants to be able to review the attendee list (or rejection or maybe list) at any time
5. Admin wants to be able to select a maximum RSVP's for an event (maybe) and have users informed that the event is full.

Description
-----------
Admins want to publicize an event that is occurring in the future.  After they define the event, users will see the event details and have the ability to respond whether they will attend.  In addition, users will be able to see other details of the event including:
- event title
- event description
- event date
- event start time/(optional) end time
- event location name and coordinates
- event RSVP due date
- event remaining seats

Action Item Behavior
--------------------
1. If an RSVP is available for the event, the RSVP should be added to the Action Item list with the RSVP date.
2. The Action Item will be removed once the user responds to the RSVP request.
2. (Should something related to "Attending the Event" be added to the Action Item list?  I feel not, but let's discuss.)

Calendar Behavior
-----------------
1. If the RSVP has a due date, then the event RSVP should be added to the calendar.
2. The event should be added to the calendar.

Requirements
------------
1. Admin should be able to create a new event topic.
2. Admin should be able to provide event information.
3. Admin should be able to choose whether or not users can see other attendees.
4. Admin should be able to name the event and provide a description.
5. Admin should be able to control whether or not RSVP is required/available and include max number of RSVPs.
6. Admin should be able to allow users to add favorite pictures from the event to the topic.
7. Admin should be able to specify whether users can chat aboue the event (or maybe NOT allow them to chat)
8. Users should be able to view the event in their topic feed.
9. Users should be able to view the event details.
10. Users should be able to respond whether they will be attending the event.
11. Users should be able to add the event to their calendar - either after they indicate they are attending or manually by clicking a button.
12. Users should be able to get quick directions for the event - and launch their mapping program.

Limitations
-----------
1. Events will be single occurrance events in Version 1.0.  Recurring events will be added in a future release.

Structure
---------
```
{
  type: "event",
  allDay: bool,
  startDate: datetime,
  endDate: datetime,
  reminder: Reminder,
  location: Location,
  locationName: string,
  ack: bool, // whether we should ask for RSVP 
}

Reminder = {
  amount: int, // number of period
  period: string, // minutes|hours|days|weeks|months
  text: string, // textual description of amount & period, ie '1 week before'
}

Location = {
  name: string,
  geo: {
    lat: decimal,
    lng: decimal
  },
  address: string,
  viewport: {
    lat: decimal,
    lng: decimal
  }
}
```

Result
------
```
{
  type: "event",
  response: int, // 0=no, 1=yes, 2=maybe
}
```

