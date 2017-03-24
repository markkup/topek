CompletionList
==============

User Scenarios
--------------
1. Admin wants to be able to create a list of students that are required to turn in a permission slip for the upcoming event and track who's returned them.
2. Admin wants to be able to track which members have paid their annual dues.

Description
-----------
Admins need to be able to track a list of people who have completed the same task (I AM NOT SURE IF THIS IS DUPLICATIVE WITH TASKS).  The admin will create a specific action item and select the users who are required to complete this task.  Users will then complete the task (outside of app - manual process) and then indicate that they have completed the task or the admin will indicate that it has been completed.  The admin will be able to see the list or people and their status of completion.  The users will be able to either see the whole list of who needs to complete the action item or only themself, depending on the settings set by the admin.

The CompletionList topic will include:
- action item title
- action item description
- action item due date/time
- users who need to complete this item
- flag indicating whether user can complete the action item or only the admin.
- flag indicating whether users can see the other users who are on the list (and their status).

Requirements
------------
1. Admin should be able to create a new CompletionList topic.
2. Admin should be able to provide the basic action item information.
3. Admin should be able to indicate whether or not users are able to complete the action item.
4. Admin should be able to select the users who are required to complete the action item.
5. Admin should be able to view a list of the users and the status of their completion of the action item.
6. Users should be able to view the checklist details - information and possibly other users who are on the list.
7. Users should be able to complete the action item if the settings permit them.
8. Admin should be able to complete the action item.

Action Item Behavior
--------------------
1. Upon creation of the completion list, the users will see an action item that includes the task title, task description, and optional due date.
2. The user will be able to indicate that they have successfully completed the required 

Limitations
-----------
1. 

Structure
---------
```
{
}
```
