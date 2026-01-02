# 🔐 Test Accounts - GearGuard

## Quick Access for Testing

Use these credentials to test different user roles in the GearGuard system.

---

## 📋 Test Accounts

### 1. **Admin Account** 🔴
- **Email**: `admin@gearguard.com`
- **Password**: `password123`
- **Role**: Administrator
- **Permissions**: Full system access
- **Name**: Admin User
- **Phone**: +1-555-0001
- **Department**: IT

**What Admin Can Do:**
- ✅ Manage all users and teams
- ✅ Create/edit/delete equipment
- ✅ Create/manage all maintenance requests
- ✅ Assign tasks to anyone
- ✅ Access all analytics and reports
- ✅ Full system configuration

---

### 2. **Manager Account** 🟡
- **Email**: `manager@gearguard.com`
- **Password**: `password123`
- **Role**: Manager
- **Permissions**: Management access
- **Name**: John Manager
- **Phone**: +1-555-0002
- **Department**: Operations

**What Manager Can Do:**
- ✅ Create/manage maintenance requests (Corrective & Preventive)
- ✅ Manage teams and equipment
- ✅ Assign technicians to tasks
- ✅ Access analytics and reports
- ✅ View all system data
- ❌ Cannot manage user accounts (create/delete users)

---

### 3. **Technician Accounts** 🔵

#### Technician #1 - Team Lead
- **Email**: `tech1@gearguard.com`
- **Password**: `password123`
- **Role**: Technician
- **Name**: Alice Technician
- **Phone**: +1-555-0003
- **Department**: Maintenance
- **Team**: Mechanical Team (Lead)

#### Technician #2
- **Email**: `tech2@gearguard.com`
- **Password**: `password123`
- **Role**: Technician
- **Name**: Bob Engineer
- **Phone**: +1-555-0004
- **Department**: Maintenance
- **Team**: Electrical Team (Lead)

**What Technicians Can Do:**
- ✅ View assigned maintenance requests
- ✅ Update request status
- ✅ Add comments and notes
- ✅ View equipment details
- ✅ Update work progress
- ❌ Cannot create preventive maintenance
- ❌ Cannot manage teams or users

---

### 4. **Regular User Account** 🟢
- **Email**: `user@gearguard.com`
- **Password**: `password123`
- **Role**: User
- **Permissions**: Basic access
- **Name**: Regular User
- **Phone**: +1-555-0005
- **Department**: Production

**What Regular User Can Do:**
- ✅ Create corrective maintenance requests
- ✅ View own requests
- ✅ View equipment information
- ✅ View basic dashboard
- ❌ Cannot create preventive maintenance
- ❌ Cannot manage teams or equipment
- ❌ Cannot assign tasks

---

## 🚀 How to Setup Test Data

### Option 1: Run Seed Script (Recommended)

1. **Open Terminal** in backend directory:
   ```bash
   cd backend
   ```

2. **Run the seed script**:
   ```bash
   node src/scripts/seed.js
   ```

3. **You should see**:
   ```
   ✅ MongoDB Connected
   🗑️  Clearing existing data...
   👥 Creating users...
   ✅ Users created
   👥 Creating teams...
   ✅ Teams created
   🔧 Creating equipment...
   ✅ Equipment created
   📋 Creating maintenance requests...
   ✅ Maintenance requests created
   ✅ Database seeded successfully!
   ```

4. **All test accounts are now ready!**

### Option 2: Manual Registration

1. Go to the **Sign Up** page
2. Create an account with your email
3. By default, you'll be a **Regular User**
4. Contact admin to upgrade your role

---

## 🧪 Testing Scenarios

### Scenario 1: Test Admin Features
1. Login as **admin@gearguard.com**
2. Go to **Users** page → Create new user
3. Go to **Teams** page → Create new team
4. Go to **Equipment** → Add new equipment
5. Test full system access

### Scenario 2: Test Manager Workflow
1. Login as **manager@gearguard.com**
2. Create a **Preventive Maintenance** request
3. Assign it to **Mechanical Team**
4. Assign technician **Alice Technician**
5. Check **Analytics** page
6. Generate and export **Reports**

### Scenario 3: Test Technician Workflow
1. Login as **tech1@gearguard.com**
2. Check **Dashboard** for assigned tasks
3. Go to **Kanban Board**
4. Move a request from **New** to **In Progress**
5. Add comments to the request
6. Complete the task → Move to **Repaired**

### Scenario 4: Test Regular User
1. Login as **user@gearguard.com**
2. Create a **Corrective Maintenance** request
3. Try to create **Preventive** (should be blocked)
4. View request in **Requests** page
5. Check request status updates

### Scenario 5: Test Role Restrictions
1. Login as **user@gearguard.com**
2. Try accessing **Users** page (should redirect)
3. Try accessing **Teams** page (should redirect)
4. Login as **tech1@gearguard.com**
5. Try accessing **Users** page (should redirect)
6. Login as **manager@gearguard.com**
7. Try accessing **Users** page (should redirect)
8. Login as **admin@gearguard.com**
9. Access **Users** page (should work)

---

## 🔄 Switching Between Accounts

1. Click your **avatar** (top right)
2. Click **"Logout"**
3. Login with different test account
4. Test different features based on role

---

## 🛠️ Troubleshooting

### Problem: "Invalid credentials"
**Solution**: 
- Make sure you ran the seed script first
- Check that backend is running
- Verify MongoDB is connected

### Problem: "No test data appears"
**Solution**:
```bash
cd backend
node src/scripts/seed.js
```

### Problem: "Can't access certain pages"
**Solution**:
- Check you're using correct role account
- Some pages are role-restricted
- See permissions list above

### Problem: "Password not working"
**Solution**:
- Default password is: `password123`
- Case-sensitive, no spaces
- If changed, run seed script again

---

## 🔐 Security Notes

⚠️ **IMPORTANT**: These are test accounts for development only!

- **Never use these in production**
- **Change all passwords before deploying**
- **Delete test accounts in production**
- **Use strong passwords in production**
- **Enable 2FA in production (if available)**

---

## 📝 Quick Reference Table

| Role | Email | Password | Main Purpose |
|------|-------|----------|--------------|
| **Admin** | admin@gearguard.com | password123 | Full system control |
| **Manager** | manager@gearguard.com | password123 | Team & request management |
| **Technician** | tech1@gearguard.com | password123 | Execute maintenance tasks |
| **Technician** | tech2@gearguard.com | password123 | Execute maintenance tasks |
| **User** | user@gearguard.com | password123 | Report issues |

---

## 🎯 Testing Checklist

### Admin Testing
- [ ] Create new user
- [ ] Edit user roles
- [ ] Deactivate user
- [ ] Create/delete teams
- [ ] Add equipment
- [ ] Create all request types
- [ ] View all analytics
- [ ] Export reports

### Manager Testing
- [ ] Create preventive maintenance
- [ ] Create corrective maintenance
- [ ] Assign tasks to teams
- [ ] Assign tasks to technicians
- [ ] View team workload
- [ ] Generate reports
- [ ] Cannot access Users page

### Technician Testing
- [ ] View assigned tasks
- [ ] Update request status
- [ ] Add comments
- [ ] View equipment details
- [ ] Cannot create preventive maintenance
- [ ] Cannot access admin pages

### User Testing
- [ ] Create corrective request
- [ ] View own requests
- [ ] Cannot create preventive maintenance
- [ ] Cannot access admin pages
- [ ] Cannot manage teams

---

## 📞 Need Help?

- Check [USER_GUIDE.md](USER_GUIDE.md) for detailed instructions
- Run seed script if data is missing
- Contact system administrator

---

**Last Updated**: January 2, 2026
**Version**: 1.0

---

*Remember: These are test credentials. Always use secure passwords in production!*
