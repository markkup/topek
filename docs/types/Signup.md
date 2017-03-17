Signup
======

User Scenarios
--------------
1. Admin has a list of items that are needed. (no date/time reference - donation list)
2. Admin has a list of jobs to be filled (on a day but no specific time reference). (event jobs)
3. Admin has a list of time-slots that need to be filled (specific date/time slots - parent-teacher meetings)

Description
-----------
Creates a list of items (things needed or tasks).
Allows members to "signup" for one or more.
May limit to X per member.
When member signs up they are assigned a task.
Items or tasks may have a due date.

Requirements
------------

Limitations
-----------
1. 

Structure
---------
```
{
  title: "Bring food for launch party",
  details: [],
  items[
    item: {
      name: "Soda and cups"
      member: null
    },
    item: {
      name: "Chips and pretzels",
      member: "HK6R4H8"
    },
    item: {
      name: "Vegetable platter",
      member: null
    },
  ],
  dueDate: "3/4/2017"
}
```

