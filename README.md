# passenger-management-system

Create a modern responsive web UI for a project called "Passenger Management System".

Theme:
- Professional Travel/Train Management System
- Color Theme:
  Primary : #0F4C81 (Dark Blue)
  Secondary : #00A8A8 (Teal)
  Background : #F5F7FA
  White cards with soft shadow
- Use modern fonts.
- Responsive for desktop and mobile.

The application has 6 pages.

-----------------------------------
1. LOGIN PAGE
-----------------------------------

Title:
Passenger Management System

Description:
Authorized Travel Agents can login to manage passenger bookings.

Fields:

1. User ID
- Textbox
- Minimum 8 characters
- Alphabetic or Alphanumeric

2. Password
- Password field
- Minimum 10 characters
- Must contain:
   - 1 Uppercase letter
   - 1 Number
   - 1 Special Character

Buttons:

- Login
- Reset

Extra:

- Train or travel illustration on side
- Remember me checkbox
- Forgot Password link
- Show/Hide Password icon

-----------------------------------
2. ADD PASSENGER PAGE
-----------------------------------

Page Title:

Add New Passenger

Description:

Create a new booking in the system.

Fields:

1. PNR Number

2. Passenger Name

3. Age

4. Gender
Dropdown:
- Male
- Female
- Other

5. Origin

6. Destination

7. Train Number

8. Ticket Price

Buttons:

- Save
- Reset

Validation:

- All fields mandatory.
- Ticket Price only positive number.
- Age should be between 1 and 120.

Show success popup:

"Passenger added successfully."

Show error popup:

"Unable to add passenger."

-----------------------------------
3. UPDATE PASSENGER PAGE
-----------------------------------

Page Title:

Update Passenger

Search Section:

Enter PNR Number

Button:

Search

After searching:

Display:

- PNR Number (Read Only)
- Passenger Name
- Age
- Gender
- Origin
- Destination
- Train Number
- Ticket Price

Important:

PNR Number should not be editable.

Buttons:

- Update
- Cancel

Show success message:

"Passenger updated successfully."

-----------------------------------
4. DELETE PASSENGER PAGE
-----------------------------------

Page Title:

Delete Passenger

Search using:

PNR Number

Display passenger details.

Buttons:

Delete

Cancel

Before deleting:

Show confirmation modal:

"Are you sure you want to delete this passenger?"

Buttons:

Yes

No

After delete:

"Passenger deleted successfully."

-----------------------------------
5. VIEW ALL PASSENGERS PAGE
-----------------------------------

Page Title:

Passenger List

Display table:

Columns:

- PNR Number
- Passenger Name
- Age
- Gender
- Origin
- Destination
- Train Number
- Ticket Price

Features:

- Search bar
- Sort columns
- Pagination

Show:

10 records per page.

Actions:

Edit button

Delete button

Hover effect for rows.

-----------------------------------
6. SEARCH PASSENGER PAGE
-----------------------------------

Page Title:

Search Passenger

Input:

PNR Number

Button:

Search

If found:

Display:

PNR Number

Passenger Name

Age

Gender

Origin

Destination

Train Number

Ticket Price

If not found:

Display:

"Passenger Not Found"

-----------------------------------

COMMON COMPONENTS

Top Navbar:

Logo

Passenger Management System

Menu:

- Dashboard
- Add Passenger
- Update Passenger
- Delete Passenger
- View Passengers
- Search Passenger
- Logout

Sidebar:

Dashboard statistics:

- Total Passengers
- Today's Bookings
- Total Revenue

Footer:

© 2026 Passenger Management System

Add smooth animations.

Use HTML, CSS and JavaScript only.

Create clean and professional UI.