News
======

User Scenarios
--------------
1. Admin needs to alert users of information that users need to know - general organizational information, congratulatory messages, etc.
2. Admin wants to alert users of closings, delays, cancellations, postponements, etc.
3. Admin needs users to be alerted of emergency information.
4. Admin needs to be able to communicate extra information, instructions, etc. to the users related to the notice.

Description
-----------
Admins want to be able to send simple news/notification information to the users in the organization. These news messages will be created for various issues and can include normal, mundane information or for high-importance/emergency issues.  These messages will be seen in the user's topic feed and they will be able to view the full details of the notice.  Users may not want to see the news message in their topic feed any more and the ability to dismiss the notice would remove it from their feed.  Admins may want news messages to appear on the user's Action Item list.

Notifications will include:
- title
- description
- image (optional)

Action Item Behavior
--------------------
1. If the Admin marks the news message as "Show in Action Item list" then the news message will be added to the Action Item list.
2. The news message item will be removed from the Action Item list once the news message is read.

Calendar Behavior
-----------------
1. The topic does not interact with the calendar.

Requirements
------------
1. Admin should be able to create a new message topic.
2. Admin should be able to select an alert level for the news message including: low priority, normal priority, high priority, and emergency notification.  The different levels of alert will control how it appears in the app.
3. Admin should be able to create the content of the notification including plain text, marked/decorated up text, image, etc.
4. User should be able to view the notification (can this be a different notification than the typical phone notification)?
5. User should be able to view the notification details.
6. User should be able to "dismiss" the notification.

Limitations
-----------
1. 

Structure
---------
```
{

}
```
