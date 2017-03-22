Meeting Date Sync
=================

User Scenarios
--------------
1. Admin needs to coordinate a meeting date between two or more people
2. Admin needs to determine who can make what dates/times for a meeting.

Description
-----------
An admin will be able to create a meeting response request which will include a number of meeting dates/times for users to select one or more suitable times.  Users will be able to see if others have responded and include their responses for suitable dates/times.  The admin will then use that information to create an event.

Requirements
------------
1. Admin should be able to create a MeetingDateRequest topic.
2. Admin should be able to invite one or more members.
3. Admin should be able to choose dates (with no time) to choose from.
4. Admin should be able to choose dates with times to choose from.
5. Users should be able to view the meeting request topic details including the seleciton of dates/times.
6. Users should be able to select which dates and/or times are suitable for them.
7. Users should be able to see other responses from other users if they are available.
8. Users should be able to modify their selections by returning to the meeting request topic.
9. Admins should be able to verify the final date and/or time and close the topic for changes.
10. Users should be able to see the selected date and/or time.

Limitations
-----------
1. Version 1 will only include result information and will not automatically be able to create an event from the response info.  Admin will need to begin an event through the Add Event process.

Structure
---------
```
{

}
```
