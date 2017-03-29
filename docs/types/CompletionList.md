CompletionList
==============

User Scenarios
--------------
1. Admin wants to be able to create a list of students that are required to turn in a permission slip for the upcoming event and track who's returned them.
2. Admin wants to be able to track which members have paid their annual dues.

Description
-----------
Admins need to be able to track a list of people who have completed the same task.  The admin will create a specific action item and select the users who are required to complete this task.  Users will then complete the task (outside of app - a manual process) and then indicate that they have completed the task or the admin will mark that it has been completed (the admin will control who can complete the task).  The admin will be able to see the list or people and their status of completion.  The users will be able to either see the whole list of who needs to complete the action item or only themself, depending on the settings set by the admin.

The CompletionList topic will include:
- action item title
- action item description
- action item due date/time
- users who need to complete this item
- flag indicating whether user can complete the action item or only the admin.
- flag indicating whether users can see the other users who are on the list (and their status).

Action Item Behavior
--------------------
1. Upon creation of the completion list, the users will see an action item that includes the task title, task description, and optional due date.
2. The user will be able to indicate that they have successfully completed the required task.  If the user is able to officially complete the task, then the item will be removed from the action items.  If the user is not able to officially complete the task, then the user can mark that it's been completed but the action item will remain until the Admin completes the item.

Calendar Behavior
-----------------
1. If the task has a due date, then the item should be added to the calendar on the date it is due.

Requirements
------------
1. Admin should be able to create a new CompletionList topic.
2. Admin should be able to provide the basic action item information.
3. Admin should be able to indicate whether or not users are able to complete the action item.
4. If the admin chooses that only the admin can complete the task, then the user should be able to indicate that they have completed the task - but it does not officially complete the task.  It is only marked by the user that they have done the task.
4. Admin should be able to select the users who are required to complete the action item.
5. Admin should be able to view a list of the users and the status of their completion of the action item.  If the Admin is the only one who can complete the tasks, then the viewable list of tasks should be able to visually indicate that the user has indicated they they have completed the item, but the Admin would still need to complete it officially.
6. Users should be able to view the checklist details - information and possibly other users who are on the list.
7. Users should be able to complete the action item if the settings permit them.
8. Admin should be able to complete the action item.

Limitations
-----------
1. 

Structure
---------
```
{
}
```
