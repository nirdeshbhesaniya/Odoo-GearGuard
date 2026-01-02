# GearGuard - User Guide

## 📋 Table of Contents
1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [User Roles & Permissions](#user-roles--permissions)
4. [Dashboard Overview](#dashboard-overview)
5. [Managing Requests](#managing-requests)
6. [Kanban Board](#kanban-board)
7. [Equipment Management](#equipment-management)
8. [Calendar & Scheduling](#calendar--scheduling)
9. [Analytics & Reports](#analytics--reports)
10. [Teams & Users](#teams--users)
11. [Profile Settings](#profile-settings)
12. [Common Workflows](#common-workflows)

---

## 📖 Introduction

**GearGuard** is a comprehensive Maintenance Management System designed to help organizations efficiently track, manage, and optimize their equipment maintenance operations.

### Key Features:
- ✅ Real-time maintenance request tracking
- 📊 Visual Kanban board for workflow management
- 🛠️ Equipment inventory management
- 📅 Maintenance scheduling
- 👥 Team and technician assignment
- 📈 Analytics and reporting
- 🔔 Notifications and alerts

---

## 🚀 Getting Started

### 1. Accessing the System

1. Open your web browser
2. Navigate to: `http://localhost:3000` (or your deployment URL)
3. You'll see the login page

### 2. First Time Login

**If you're a new user:**
1. Click **"Sign Up"** on the login page
2. Fill in the registration form:
   - Full Name
   - Email Address
   - Password (minimum 6 characters)
   - Confirm Password
3. Click **"Create Account"**
4. You'll be automatically logged in after successful registration

**If you already have an account:**
1. Enter your **Email** and **Password**
2. Click **"Sign In"**

**Forgot Password?**
1. Click **"Forgot Password?"** link on login page
2. Enter your email address
3. Check your email for the OTP (6-digit code)
4. Enter the OTP code
5. Set your new password
6. You'll be automatically logged in

### 3. Interface Overview

After logging in, you'll see:
- **Left Sidebar**: Main navigation menu
- **Top Header**: Welcome message, notifications, and profile menu
- **Main Content Area**: Active page content

---

## 👤 User Roles & Permissions

GearGuard has 4 user roles with different access levels:

### 1. **Admin** 
- Full system access
- Can manage users, teams, equipment, and requests
- Access to all analytics and reports
- Can assign and reassign tasks

### 2. **Manager**
- Can create and manage requests
- Can manage teams and equipment
- Can assign technicians
- Access to analytics and reports
- Cannot manage user accounts

### 3. **Technician**
- Can view and update assigned requests
- Can view equipment details
- Can add comments to requests
- Can update request status
- Limited administrative access

### 4. **User** (Regular User)
- Can create corrective maintenance requests
- Can view own requests
- Can view equipment information
- Basic dashboard access
- Cannot create preventive maintenance

---

## 📊 Dashboard Overview

The Dashboard is your main hub for monitoring maintenance activities.

### Dashboard Components:

1. **Statistics Cards** (Top Section)
   - **Total Requests**: All maintenance requests in the system
   - **New**: Requests awaiting action
   - **In Progress**: Currently being worked on
   - **Repaired**: Completed repairs
   - **Equipment**: Total equipment count
   - **Teams**: Number of maintenance teams

2. **Charts** (Bottom Section)
   - **Requests by Priority**: Pie chart showing distribution
   - **Requests by Type**: Bar chart (Corrective vs Preventive)

### How to Use:
- Click on any statistic card to filter and view detailed requests
- Charts update automatically based on current data
- Hover over chart elements to see exact numbers

---

## 🎫 Managing Requests

### Creating a New Request

1. Click **"Requests"** in the sidebar
2. Click **"+ New Request"** button (top right)
3. Fill in the form:

   **Step 1: Choose Request Type**
   - **Corrective**: For broken or malfunctioning equipment
   - **Preventive**: For scheduled maintenance

   **Step 2: Fill Required Fields**
   - **Subject**: Brief description (e.g., "Motor overheating")
   - **Equipment**: Select from dropdown
   - **Scheduled Date**: When should this be done?

   **Step 3: Optional Fields**
   - **Maintenance Team**: Assign to a team
   - **Assigned Technician**: Assign to specific person
   - **Duration**: Estimated hours needed
   - **Description**: Detailed information

4. Click **"Create Request"**

### Viewing Requests

**List View:**
1. Go to **Requests** page
2. You'll see a table with all requests
3. Use filters to narrow down:
   - Status (New, In Progress, Repaired, Scrap)
   - Type (Corrective, Preventive)
   - Equipment
   - Search by request number or description

**Individual Request:**
1. Click on any request in the list
2. View full details, history, and comments
3. See assigned team and technician
4. Check equipment information

### Updating Request Status

1. Open a request
2. If you have permission, you'll see status update options
3. Click to change status:
   - **New** → **In Progress** (Start working)
   - **In Progress** → **Repaired** (Mark complete)
   - **In Progress** → **Scrap** (Equipment scrapped)

---

## 📋 Kanban Board

The Kanban Board provides a visual workflow management system.

### Accessing Kanban Board
- Click **"Kanban Board"** in the sidebar

### Board Columns
- **New**: Pending requests
- **In Progress**: Active work
- **Repaired**: Completed repairs
- **Scrap**: Scrapped equipment

### How to Use:

**View Requests:**
- Each card shows:
  - Request number
  - Subject
  - Equipment details
  - Assigned team/technician
  - Scheduled date

**Move Requests:**
1. Click and hold a request card
2. Drag it to another column
3. Release to drop
4. Status updates automatically

**Filter Board:**
- Use filters at the top:
  - **Request Type**: Corrective or Preventive
  - **Maintenance Team**: Filter by team

**Refresh:**
- Click **"Refresh"** button to reload latest data

---

## 🛠️ Equipment Management

### Viewing Equipment

1. Click **"Equipment"** in sidebar
2. Browse equipment list
3. Use search bar to find specific items
4. Filter by status:
   - Operational
   - Under Maintenance
   - Out of Service
   - Decommissioned

### Adding New Equipment

1. Click **"+ Add Equipment"** button
2. Fill in the form:

   **Basic Information:**
   - **Equipment Name**: e.g., "CNC Machine"
   - **Serial Number**: Unique identifier (auto-uppercase)
   - **Department**: Where it's used
   - **Location**: Physical location

   **Purchase & Warranty:**
   - **Purchase Date**: When was it bought?
   - **Warranty Expiry**: When does warranty end?

   **Assignment (Optional):**
   - **Maintenance Team**: Default team for this equipment
   - **Default Technician**: Primary person responsible

   **Additional Info:**
   - **Notes**: Any special information

3. Click **"Add Equipment"**

### Viewing Equipment Details

1. Click on any equipment in the list
2. View:
   - Basic information
   - Maintenance history
   - Associated requests
   - Team assignments
   - Warranty status

---

## 📅 Calendar & Scheduling

### Viewing Calendar

1. Click **"Calendar"** in sidebar
2. See scheduled maintenance in calendar view
3. Different colors indicate:
   - Corrective maintenance
   - Preventive maintenance
   - Overdue tasks

### Creating from Calendar

1. Click on a date in the calendar
2. Select time slot
3. Creates a new request with pre-filled date
4. Complete the form and save

### Filtering Calendar View

- **By Date Range**: Use date pickers
- **By Request Type**: Show only specific types
- **By Team**: Filter by maintenance team

---

## 📈 Analytics & Reports

### Analytics Dashboard

1. Click **"Analytics"** in sidebar
2. View visual insights:
   - **Team Workload**: Pie chart of requests by team
   - **Equipment Breakdown**: Top 10 equipment with most issues
   - **Trend Analysis**: Request patterns over time

3. Use date range filters to analyze specific periods

### Reports

1. Click **"Reports"** in sidebar
2. Set filters:
   - Start Date
   - End Date
   - Request Type
   - Status
   - Team

3. Click **"Generate Report"** to see statistics:
   - Total requests
   - Breakdown by type
   - Breakdown by status
   - Average duration

4. Click **"Export to CSV"** to download data for offline analysis

---

## 👥 Teams & Users

*(Admin and Manager only)*

### Managing Teams

1. Click **"Teams"** in sidebar
2. View all maintenance teams
3. Click **"+ Create Team"** to add new team
4. Assign team members
5. Set team lead

### Managing Users

1. Click **"Users"** in sidebar
2. View all system users
3. Click **"+ Add User"** to create new account
4. Set user role and permissions
5. Assign to teams

---

## ⚙️ Profile Settings

### Accessing Your Profile

1. Click on your **avatar** (top right)
2. Select **"My Profile"** from dropdown

### Profile Tabs

**1. Profile Information:**
- Update your name
- Change email address
- Update phone number
- Upload profile picture (click camera icon)

**2. Security:**
- Change your password
- Requires current password
- New password must be at least 6 characters

### Notifications

- Click **bell icon** (top right) to view notifications
- See alerts for:
  - New assignments
  - Request updates
  - Overdue tasks

### Logging Out

1. Click your **avatar** (top right)
2. Click **"Logout"**

---

## 🔄 Common Workflows

### Workflow 1: Reporting Equipment Breakdown

1. Go to **Requests** → **+ New Request**
2. Select **"Corrective"** type
3. Fill in:
   - Subject: "Motor failure"
   - Equipment: Select affected equipment
   - Scheduled Date: ASAP or specific time
   - Description: Detail the problem
4. Submit request
5. Manager/Admin will assign technician
6. Track progress on Kanban board

### Workflow 2: Scheduling Preventive Maintenance

*(Manager/Admin only)*

1. Go to **Calendar**
2. Click on scheduled maintenance date
3. Select **"Preventive"** type
4. Choose equipment for maintenance
5. Assign team and technician
6. Set duration estimate
7. Add maintenance checklist in description
8. Save request

### Workflow 3: Completing a Repair

*(Technician workflow)*

1. Check **Dashboard** or **Kanban Board** for assigned tasks
2. Click on your assigned request
3. Move to **"In Progress"** status
4. Review equipment details and requirements
5. Add comments with progress updates
6. When complete, move to **"Repaired"**
7. Add completion notes

### Workflow 4: Equipment Lifecycle Management

*(Admin/Manager)*

1. **Add Equipment**: When new equipment arrives
2. **Assign Team**: Set default maintenance team
3. **Schedule Preventive**: Create recurring maintenance
4. **Track Usage**: Monitor through requests
5. **Analyze Performance**: Use Analytics page
6. **Decommission**: Update status when end-of-life

### Workflow 5: Team Performance Review

*(Manager/Admin)*

1. Go to **Analytics**
2. Set date range (e.g., last month)
3. Review **Team Workload** chart
4. Check **Equipment Breakdown** for problem areas
5. Go to **Reports** for detailed data
6. Export to CSV for further analysis
7. Schedule team meetings based on insights

---

## 💡 Tips & Best Practices

### For All Users:
- ✅ Keep request descriptions detailed and clear
- ✅ Update request status promptly
- ✅ Check notifications regularly
- ✅ Use filters to find information quickly
- ✅ Add comments to requests for communication

### For Technicians:
- ✅ Check Kanban board daily for new assignments
- ✅ Update progress with comments
- ✅ Mark requests as complete when done
- ✅ Report equipment issues immediately

### For Managers:
- ✅ Review pending requests daily
- ✅ Assign tasks promptly
- ✅ Balance team workload
- ✅ Schedule preventive maintenance proactively
- ✅ Review analytics weekly

### For Admins:
- ✅ Keep equipment inventory updated
- ✅ Monitor system usage and performance
- ✅ Manage user access appropriately
- ✅ Review reports monthly
- ✅ Ensure teams are properly staffed

---

## 🆘 Troubleshooting

### Can't Login?
- Check email and password are correct
- Use "Forgot Password" to reset
- Contact admin if account is inactive

### Don't See Expected Data?
- Refresh the page
- Check filters are not too restrictive
- Verify you have permission for that data

### Can't Create Request?
- Verify all required fields are filled
- Check you have permission (Preventive = Manager only)
- Ensure equipment is selected

### Can't Move Kanban Card?
- Verify you have permission to change status
- Some transitions may be restricted
- Check if request is locked by another user

---

## 📞 Support

### Need Help?
- Check this user guide first
- Contact your system administrator
- Email: support@gearguard.com
- Report bugs through your admin

### Feature Requests
- Submit suggestions to your manager
- Managers can forward to system admin
- Keep suggestions clear and specific

---

## 🔐 Security Best Practices

- ✅ Use strong passwords (minimum 6 characters)
- ✅ Don't share your login credentials
- ✅ Logout when using shared computers
- ✅ Report suspicious activity
- ✅ Keep browser updated

---

## 📱 Mobile Access

GearGuard is fully responsive and works on:
- 📱 Smartphones
- 📱 Tablets
- 💻 Laptops
- 🖥️ Desktop computers

Simply access the same URL from any device and login.

---

## 🎯 Quick Reference

| Action | Steps |
|--------|-------|
| Create Request | Requests → + New Request → Fill Form → Submit |
| View Dashboard | Click "Dashboard" in sidebar |
| Update Status | Open Request → Change Status Dropdown |
| Add Equipment | Equipment → + Add Equipment → Fill Form |
| View Calendar | Click "Calendar" in sidebar |
| Check Notifications | Click bell icon (top right) |
| Update Profile | Avatar → My Profile → Edit → Save |
| Logout | Avatar → Logout |
| Filter List | Use filter dropdowns or search bar |
| Export Report | Reports → Generate → Export to CSV |

---

## 📚 Glossary

- **Corrective Maintenance**: Repairs for broken/malfunctioning equipment
- **Preventive Maintenance**: Scheduled maintenance to prevent issues
- **Kanban**: Visual board for tracking workflow
- **OTP**: One-Time Password (for password reset)
- **Request Number**: Unique identifier for each maintenance request
- **Serial Number**: Unique identifier for equipment
- **Duration**: Estimated time for maintenance in hours
- **Status**: Current state of a request (New, In Progress, Repaired, Scrap)

---

## 🎓 Training Resources

### For New Users:
1. Read "Getting Started" section
2. Create a test request
3. Explore the dashboard
4. Practice using filters

### For Technicians:
1. Review "Managing Requests" section
2. Practice with Kanban board
3. Learn status updates
4. Test comment system

### For Managers:
1. Complete all basic training
2. Learn team assignment
3. Practice creating preventive maintenance
4. Review analytics regularly

---

**Last Updated**: January 2, 2026
**Version**: 1.0

---

*For the latest updates and features, check with your system administrator.*
