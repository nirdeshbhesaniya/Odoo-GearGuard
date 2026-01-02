# 🔄 Maintenance Request Workflow - Implementation Guide

## ✅ Implemented Features

### Flow 1: The Breakdown - Complete Workflow

---

## 📋 Workflow Steps

### Step 1: Request Creation (Any User)

**Who**: Any authenticated user  
**Action**: Create a maintenance request

**Process**:
1. Navigate to **Requests** → **+ New Request**
2. Select **Request Type**:
   - **Corrective**: For broken/malfunctioning equipment
   - **Preventive**: For scheduled maintenance (Manager/Admin only)
3. Fill in required fields:
   - **Subject**: Brief description
   - **Equipment**: Select from dropdown
   - **Scheduled Date**: When maintenance should occur

**✨ Auto-Fill Feature**:
When equipment is selected:
- System automatically fetches equipment details
- Auto-fills **Maintenance Team** if assigned to equipment
- Auto-fills **Assigned Technician** if default technician exists
- This ensures proper team assignment from the start

**Initial State**: Request starts in **"New"** status

---

### Step 2: Assignment Phase

**Who**: Manager or Technician  
**Action**: Self-assignment or manager assignment

**Methods**:

#### Option A: Self-Assignment (Technician)
1. Open the request detail page
2. Click **"Assign to Me"** button
3. System assigns current user as technician
4. Request remains in **"New"** status

#### Option B: Manager Assignment
1. Manager opens request detail
2. Manager assigns specific technician
3. Technician receives notification
4. Request remains in **"New"** status

**Permissions**:
- ✅ Admin: Can assign anyone
- ✅ Manager: Can assign technicians
- ✅ Technician: Can assign to themselves
- ❌ Regular User: Cannot assign

---

### Step 3: Work Execution

**Who**: Assigned Technician  
**Action**: Start and perform maintenance work

**Process**:
1. Technician views assigned requests on Dashboard or Kanban Board
2. Opens request detail page
3. Clicks **"Start Work"** button
4. Status automatically changes: **"New"** → **"In Progress"**
5. Technician performs maintenance work
6. Can add comments/notes during work

**Status Change**: 
- Before: **New**
- After: **In Progress**

**Tracking**:
- Start time recorded automatically
- Work can be paused and resumed
- Comments can be added for progress updates

---

### Step 4: Completion Phase

**Who**: Assigned Technician  
**Action**: Mark request as complete and record actual hours

**Process**:
1. When work is finished, technician clicks **"Mark as Complete"**
2. System opens modal asking for:
   - **Actual Hours Spent** (required)
   - Shows estimated hours for reference
3. Technician enters actual duration (e.g., 2.5 hours)
4. Clicks **"Complete"** button
5. System updates:
   - Status: **"In Progress"** → **"Repaired"**
   - Duration: Updates from estimated to actual hours
   - Completion Time: Records current timestamp
   - Completed By: Records technician ID

**Important**:
- Actual hours **replaces** estimated hours
- Completion time is auto-recorded
- Status history is maintained
- Equipment status may be updated

**Alternative Outcome**: 
- If equipment cannot be repaired, technician can mark as **"Scrap"**

---

## 🎯 Status Flow Diagram

```
┌─────────┐
│   New   │ ← Request Created (Any User)
└────┬────┘
     │
     │ 1. Technician/Manager assigns
     │    themselves or assigns someone
     │
     ▼
┌─────────┐
│   New   │ ← Assigned but not started
└────┬────┘
     │
     │ 2. Assigned Technician clicks
     │    "Start Work"
     │
     ▼
┌─────────────┐
│ In Progress │ ← Work is being performed
└──────┬──────┘
       │
       │ 3. Technician completes work
       │    and records actual hours
       │
       ├───────────────┬──────────────┐
       │               │              │
       ▼               ▼              ▼
  ┌─────────┐    ┌─────────┐    ┌─────────┐
  │Repaired │    │  Scrap  │    │  (back) │
  └─────────┘    └─────────┘    │In Prog. │
   Terminal       Terminal       └─────────┘
   Status         Status          (Reopen)
```

---

## 👤 User Roles & Permissions

### 1. **Regular User**
- ✅ Create corrective requests
- ✅ View own requests
- ✅ View list of technicians (for context)
- ❌ Cannot assign requests
- ❌ Cannot change status
- ❌ Cannot create preventive maintenance
- ❌ Cannot manage users

### 2. **Technician**
- ✅ All Regular User permissions
- ✅ View all requests
- ✅ View list of teams and technicians
- ✅ Self-assign requests
- ✅ Start work (New → In Progress)
- ✅ Complete work (record hours)
- ✅ Mark as Repaired or Scrap
- ❌ Cannot create preventive maintenance
- ❌ Cannot manage users

### 3. **Manager**
- ✅ All Technician permissions
- ✅ Create preventive maintenance
- ✅ Assign requests to any technician
- ✅ Reassign requests
- ✅ Override status changes
- ✅ Create/edit equipment
- ✅ Create users (but cannot delete)
- ❌ Cannot delete users

### 4. **Admin**
- ✅ All Manager permissions
- ✅ Full system access
- ✅ Manage users and teams (create, edit, delete)
- ✅ Override all restrictions
- ✅ Delete users and equipment

---

## 📊 Duration Tracking

### Estimated vs Actual Hours

**During Creation**:
- Field label: **"Estimated Duration (Hours)"**
- Purpose: Initial time estimate
- Default: 1 hour
- Can be adjusted by user

**During Completion**:
- Modal prompts: **"Actual Hours Spent"**
- Required field (must be filled)
- Shows estimated hours for comparison
- Replaces estimated value in database

**On Request Detail Page**:
- Before completion: Shows "X hours (Estimated)"
- After completion: Shows "X hours (Actual)"

---

## 🖥️ User Interface Components

### Request Create Page
- **Equipment Dropdown**: Triggers auto-fill on selection
- **Team Field**: Auto-populated from equipment
- **Technician Field**: Auto-populated if default exists
- **Duration Field**: Shows "(Estimated)" in label

### Request Detail Page

**Action Buttons** (Context-sensitive):
1. **"Assign to Me"** 
   - Shows: When status is "New" and user not assigned
   - Action: Assigns current user

2. **"Start Work"**
   - Shows: When status is "New" and user is assigned
   - Action: Changes to "In Progress"

3. **"Mark as Complete"**
   - Shows: When status is "In Progress" and user is assigned
   - Action: Opens hours modal → Marks as "Repaired"

4. **"Mark as Scrap"**
   - Shows: When status is "In Progress" and user is assigned
   - Action: Changes to "Scrap" status

**Information Sections**:
- Request details (subject, description, type)
- Equipment details (auto-pulled)
- Timeline (created, scheduled, completed)
- Duration (estimated vs actual)
- Assignment (team, technician, creator)

### Completion Modal
- Title: "Complete Request"
- Input: Actual hours spent (number, step 0.5)
- Reference: Shows estimated hours
- Buttons: Cancel / Complete

---

## 🔔 Notifications (Future Enhancement)

Recommended notifications:
1. **Assignment**: Notify technician when assigned
2. **Status Change**: Notify creator when status updates
3. **Overdue**: Notify if scheduled date passed
4. **Completion**: Notify relevant parties when completed

---

## 📱 Kanban Board Integration

**Drag & Drop**:
- Requests can be moved between columns
- Automatically updates status
- Respects workflow rules:
  - New → In Progress
  - In Progress → Repaired/Scrap
  - Admin can override restrictions

**Columns**:
- **New**: Pending assignments and new requests
- **In Progress**: Active work in progress
- **Repaired**: Successfully completed
- **Scrap**: Equipment scrapped/unrecoverable

---

## 🧪 Testing Scenarios

### Scenario 1: Complete Corrective Workflow
1. **User** creates corrective request for "Printer 01"
   - Equipment selected → Team auto-filled
2. **Technician** views dashboard, sees new request
3. **Technician** clicks "Assign to Me"
4. **Technician** clicks "Start Work"
5. **Technician** performs maintenance (30 mins)
6. **Technician** clicks "Mark as Complete"
7. **Technician** enters actual hours: 0.5
8. Status changed to "Repaired"

### Scenario 2: Manager Preventive Workflow
1. **Manager** creates preventive request
   - Selects equipment with default team
   - Assigns specific technician
2. **Technician** sees assignment notification
3. **Technician** starts work on scheduled date
4. **Technician** completes and records 2 hours
5. Request marked as repaired

### Scenario 3: Equipment Scrap
1. **Technician** starts working on repair
2. Discovers equipment beyond repair
3. Clicks "Mark as Scrap" button
4. Equipment status updated
5. Request closed as Scrap

---

## 📈 Reporting & Analytics

**Data Captured**:
- Total requests by status
- Average completion time
- Estimated vs actual hours variance
- Technician workload
- Equipment breakdown frequency

**Metrics**:
- Completion rate
- Average response time
- Time to resolution
- Accuracy of estimates

---

## 🔐 Security & Validation

**Backend Validations**:
- ✅ Request type matches user role
- ✅ Status transitions follow workflow
- ✅ Only assigned technician can complete
- ✅ Actual hours must be positive
- ✅ Equipment must exist

**Frontend Validations**:
- ✅ Required fields enforced
- ✅ Buttons shown based on permissions
- ✅ Hours input validated (min 0.5)
- ✅ Date in future for scheduling

---

## 🚀 Quick Start Guide

### For Users:
1. Go to **Requests** page
2. Click **+ New Request**
3. Select equipment (team auto-fills)
4. Set scheduled date
5. Submit request

### For Technicians:
1. Check **Dashboard** for assignments
2. Open request detail
3. Click **Assign to Me** if needed
4. Click **Start Work**
5. Do the maintenance
6. Click **Mark as Complete**
7. Enter actual hours
8. Done!

### For Managers:
1. Create preventive maintenance
2. Assign to team/technician
3. Monitor progress on Kanban
4. Review completed requests
5. Generate reports

---

## 💡 Best Practices

1. **Always record accurate hours**: Helps improve future estimates
2. **Add comments during work**: Documents progress and issues
3. **Update status promptly**: Keeps dashboard accurate
4. **Review auto-filled data**: Verify team assignments are correct
5. **Use preventive maintenance**: Reduces corrective requests

---

## 🐛 Troubleshooting

**Team not auto-filling?**
- Check if equipment has assigned maintenance team
- Update equipment record with default team

**Can't assign to yourself?**
- Check you have technician, manager, or admin role
- Check request is in "New" status

**Can't mark as complete?**
- Must be assigned to you
- Must be in "In Progress" status
- Must enter valid hours

**Hours not updating?**
- Check you entered positive number
- Check modal completed successfully
- Refresh page if needed

---

## 📚 API Endpoints Used

```
GET    /api/equipment/:id           - Get equipment details (for auto-fill)
POST   /api/requests/corrective     - Create corrective request
POST   /api/requests/preventive     - Create preventive request
GET    /api/requests/:id            - Get request details
PUT    /api/requests/:id            - Update request (assignment, completion)
PATCH  /api/requests/:id/status     - Update status only
```

---

## ✨ Key Features Summary

✅ **Auto-Fill Logic**: Equipment selection populates team  
✅ **Self-Assignment**: Technicians can assign themselves  
✅ **Status Flow**: New → In Progress → Repaired/Scrap  
✅ **Hours Tracking**: Estimated vs Actual duration  
✅ **Role-Based Access**: Different permissions per role  
✅ **Completion Modal**: Records actual hours spent  
✅ **Status History**: Tracks all status changes  
✅ **Audit Trail**: Who did what and when  

---

**Last Updated**: January 2, 2026  
**Version**: 1.0  
**Status**: ✅ Fully Implemented

