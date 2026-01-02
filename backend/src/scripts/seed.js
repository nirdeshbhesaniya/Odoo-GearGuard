require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Models
const User = require('../models/User');
const Equipment = require('../models/Equipment');
const Team = require('../models/Team');
const MaintenanceRequest = require('../models/MaintenanceRequest');

// Constants
const { USER_ROLES } = require('../config/constants');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Equipment.deleteMany({});
    await Team.deleteMany({});
    await MaintenanceRequest.deleteMany({});

    // Create Users
    console.log('👥 Creating users...');
    // Don't hash password here - let the User model's pre-save hook handle it
    const plainPassword = 'password123';

    const admin = await User.create({
      email: 'admin@gearguard.com',
      password: plainPassword,
      name: 'Admin User',
      role: USER_ROLES.ADMIN,
      phone: '+1-555-0001',
      department: 'IT',
      isActive: true,
    });

    const manager1 = await User.create({
      email: 'manager@gearguard.com',
      password: plainPassword,
      name: 'John Manager',
      role: USER_ROLES.MANAGER,
      phone: '+1-555-0002',
      department: 'Operations',
      isActive: true,
    });

    const manager2 = await User.create({
      email: 'manager2@gearguard.com',
      password: plainPassword,
      name: 'Sarah Williams',
      role: USER_ROLES.MANAGER,
      phone: '+1-555-0012',
      department: 'Maintenance',
      isActive: true,
    });

    const tech1 = await User.create({
      email: 'tech1@gearguard.com',
      password: plainPassword,
      name: 'Alice Technician',
      role: USER_ROLES.TECHNICIAN,
      phone: '+1-555-0003',
      department: 'Maintenance',
      isActive: true,
    });

    const tech2 = await User.create({
      email: 'tech2@gearguard.com',
      password: plainPassword,
      name: 'Bob Engineer',
      role: USER_ROLES.TECHNICIAN,
      phone: '+1-555-0004',
      department: 'Maintenance',
      isActive: true,
    });

    const tech3 = await User.create({
      email: 'tech3@gearguard.com',
      password: plainPassword,
      name: 'Charlie Martinez',
      role: USER_ROLES.TECHNICIAN,
      phone: '+1-555-0013',
      department: 'Maintenance',
      isActive: true,
    });

    const tech4 = await User.create({
      email: 'tech4@gearguard.com',
      password: plainPassword,
      name: 'Diana Chen',
      role: USER_ROLES.TECHNICIAN,
      phone: '+1-555-0014',
      department: 'Maintenance',
      isActive: true,
    });

    const tech5 = await User.create({
      email: 'tech5@gearguard.com',
      password: plainPassword,
      name: 'Erik Patel',
      role: USER_ROLES.TECHNICIAN,
      phone: '+1-555-0015',
      department: 'Maintenance',
      isActive: true,
    });

    const tech6 = await User.create({
      email: 'tech6@gearguard.com',
      password: plainPassword,
      name: 'Fiona Rodriguez',
      role: USER_ROLES.TECHNICIAN,
      phone: '+1-555-0016',
      department: 'Maintenance',
      isActive: true,
    });

    const user1 = await User.create({
      email: 'user@gearguard.com',
      password: plainPassword,
      name: 'Regular User',
      role: USER_ROLES.USER,
      phone: '+1-555-0005',
      department: 'Production',
      isActive: true,
    });

    const user2 = await User.create({
      email: 'user2@gearguard.com',
      password: plainPassword,
      name: 'Mike Johnson',
      role: USER_ROLES.USER,
      phone: '+1-555-0017',
      department: 'Production',
      isActive: true,
    });

    const user3 = await User.create({
      email: 'user3@gearguard.com',
      password: plainPassword,
      name: 'Lisa Anderson',
      role: USER_ROLES.USER,
      phone: '+1-555-0018',
      department: 'Quality Control',
      isActive: true,
    });

    console.log('✅ 12 Users created (1 Admin, 2 Managers, 6 Technicians, 3 Regular Users)');

    // Create Teams
    console.log('👥 Creating teams...');
    const mechanicalTeam = await Team.create({
      teamName: 'Mechanical Team',
      description: 'Handles all mechanical equipment maintenance including HVAC, pumps, and compressors',
      teamLead: tech1._id,
      members: [tech1._id, tech2._id, tech3._id],
      specializations: ['HVAC', 'Pumps', 'Compressors', 'Pneumatics'],
      isActive: true,
      createdBy: manager1._id,
    });

    const electricalTeam = await Team.create({
      teamName: 'Electrical Team',
      description: 'Handles all electrical equipment maintenance, controls, and automation systems',
      teamLead: tech2._id,
      members: [tech2._id, tech4._id],
      specializations: ['Electrical', 'Controls', 'Automation', 'PLC'],
      isActive: true,
      createdBy: manager1._id,
    });

    const facilityTeam = await Team.create({
      teamName: 'Facility Maintenance',
      description: 'General facility maintenance and building systems',
      teamLead: tech5._id,
      members: [tech5._id, tech6._id],
      specializations: ['Plumbing', 'Building Systems', 'General Maintenance'],
      isActive: true,
      createdBy: manager2._id,
    });

    const emergencyTeam = await Team.create({
      teamName: 'Emergency Response',
      description: 'Rapid response team for urgent breakdowns and critical issues',
      teamLead: tech3._id,
      members: [tech3._id, tech4._id, tech5._id],
      specializations: ['Emergency Repair', 'Troubleshooting', 'Quick Response'],
      isActive: true,
      createdBy: manager1._id,
    });

    console.log('✅ 4 Maintenance Teams created');

    // Create Equipment
    console.log('🔧 Creating equipment...');
    const chiller1 = await Equipment.create({
      name: 'Industrial Chiller #1',
      serialNumber: 'CHIL-001-2023',
      department: 'HVAC Systems',
      location: 'Building A - Mechanical Room',
      purchaseDate: new Date('2023-01-15'),
      warrantyExpiry: new Date('2026-01-15'),
      maintenanceTeam: mechanicalTeam._id,
      defaultTechnician: tech1._id,
      notes: 'Primary cooling system for Building A',
      createdBy: manager1._id,
    });

    const compressor1 = await Equipment.create({
      name: 'Air Compressor #1',
      serialNumber: 'COMP-001-2022',
      department: 'Compressed Air',
      location: 'Building B - Compressor Room',
      purchaseDate: new Date('2022-06-10'),
      warrantyExpiry: new Date('2025-06-10'),
      maintenanceTeam: mechanicalTeam._id,
      defaultTechnician: tech2._id,
      notes: 'Main production air compressor',
      createdBy: manager1._id,
    });

    const compressor2 = await Equipment.create({
      name: 'Air Compressor #2',
      serialNumber: 'COMP-002-2021',
      department: 'Compressed Air',
      location: 'Building B - Compressor Room',
      purchaseDate: new Date('2021-03-15'),
      warrantyExpiry: new Date('2024-03-15'),
      maintenanceTeam: mechanicalTeam._id,
      defaultTechnician: tech3._id,
      notes: 'Backup air compressor',
      createdBy: manager1._id,
    });

    const electricalPanel1 = await Equipment.create({
      name: 'Main Electrical Panel A',
      serialNumber: 'ELEC-001-2023',
      department: 'Electrical Systems',
      location: 'Building A - Electrical Room',
      purchaseDate: new Date('2023-03-20'),
      warrantyExpiry: new Date('2028-03-20'),
      maintenanceTeam: electricalTeam._id,
      defaultTechnician: tech2._id,
      notes: '480V main distribution panel',
      createdBy: manager1._id,
    });

    const electricalPanel2 = await Equipment.create({
      name: 'Main Electrical Panel B',
      serialNumber: 'ELEC-002-2023',
      department: 'Electrical Systems',
      location: 'Building B - Electrical Room',
      purchaseDate: new Date('2023-04-10'),
      warrantyExpiry: new Date('2028-04-10'),
      maintenanceTeam: electricalTeam._id,
      defaultTechnician: tech4._id,
      notes: '480V main distribution panel',
      createdBy: manager1._id,
    });

    const hvacUnit1 = await Equipment.create({
      name: 'Rooftop HVAC Unit #1',
      serialNumber: 'HVAC-001-2020',
      department: 'HVAC Systems',
      location: 'Building A - Roof',
      purchaseDate: new Date('2020-05-20'),
      warrantyExpiry: new Date('2025-05-20'),
      maintenanceTeam: mechanicalTeam._id,
      defaultTechnician: tech1._id,
      notes: '50-ton rooftop unit',
      createdBy: manager1._id,
    });

    const hvacUnit2 = await Equipment.create({
      name: 'Rooftop HVAC Unit #2',
      serialNumber: 'HVAC-002-2020',
      department: 'HVAC Systems',
      location: 'Building B - Roof',
      purchaseDate: new Date('2020-06-15'),
      warrantyExpiry: new Date('2025-06-15'),
      maintenanceTeam: mechanicalTeam._id,
      defaultTechnician: tech1._id,
      notes: '40-ton rooftop unit',
      createdBy: manager1._id,
    });

    const boiler1 = await Equipment.create({
      name: 'Industrial Boiler #1',
      serialNumber: 'BOIL-001-2019',
      department: 'Heating Systems',
      location: 'Building A - Boiler Room',
      purchaseDate: new Date('2019-11-01'),
      warrantyExpiry: new Date('2024-11-01'),
      maintenanceTeam: mechanicalTeam._id,
      defaultTechnician: tech3._id,
      notes: 'Primary heating boiler - Natural gas',
      createdBy: manager1._id,
    });

    const conveyor1 = await Equipment.create({
      name: 'Production Conveyor Belt #1',
      serialNumber: 'CONV-001-2022',
      department: 'Production',
      location: 'Building B - Production Floor',
      purchaseDate: new Date('2022-09-10'),
      warrantyExpiry: new Date('2027-09-10'),
      maintenanceTeam: mechanicalTeam._id,
      defaultTechnician: tech2._id,
      notes: 'Main production line conveyor',
      createdBy: manager2._id,
    });

    const forklift1 = await Equipment.create({
      name: 'Electric Forklift #5',
      serialNumber: 'FORK-005-2023',
      department: 'Warehouse',
      location: 'Building C - Warehouse',
      purchaseDate: new Date('2023-07-01'),
      warrantyExpiry: new Date('2028-07-01'),
      maintenanceTeam: facilityTeam._id,
      defaultTechnician: tech5._id,
      notes: '5000 lb capacity electric forklift',
      createdBy: manager2._id,
    });

    const pump1 = await Equipment.create({
      name: 'Water Pump #1',
      serialNumber: 'PUMP-001-2021',
      department: 'Utilities',
      location: 'Building A - Utility Room',
      purchaseDate: new Date('2021-04-15'),
      warrantyExpiry: new Date('2026-04-15'),
      maintenanceTeam: mechanicalTeam._id,
      defaultTechnician: tech3._id,
      notes: 'Primary water circulation pump',
      createdBy: manager1._id,
    });

    const generator1 = await Equipment.create({
      name: 'Emergency Generator',
      serialNumber: 'GEN-001-2018',
      department: 'Electrical Systems',
      location: 'Building A - Generator Room',
      purchaseDate: new Date('2018-03-01'),
      warrantyExpiry: new Date('2023-03-01'),
      maintenanceTeam: electricalTeam._id,
      defaultTechnician: tech4._id,
      notes: '500 KW diesel backup generator',
      createdBy: manager1._id,
    });

    const printer1 = await Equipment.create({
      name: 'Industrial Label Printer #1',
      serialNumber: 'PRINT-001-2024',
      department: 'Production',
      location: 'Building B - Packaging Area',
      purchaseDate: new Date('2024-01-10'),
      warrantyExpiry: new Date('2027-01-10'),
      maintenanceTeam: facilityTeam._id,
      defaultTechnician: tech6._id,
      notes: 'High-speed label printer',
      createdBy: manager2._id,
    });

    const cnc1 = await Equipment.create({
      name: 'CNC Machine #3',
      serialNumber: 'CNC-003-2022',
      department: 'Manufacturing',
      location: 'Building B - Machine Shop',
      purchaseDate: new Date('2022-10-20'),
      warrantyExpiry: new Date('2027-10-20'),
      maintenanceTeam: mechanicalTeam._id,
      defaultTechnician: tech2._id,
      notes: '3-axis CNC milling machine',
      createdBy: manager2._id,
    });

    const chiller2 = await Equipment.create({
      name: 'Industrial Chiller #2',
      serialNumber: 'CHIL-002-2024',
      department: 'HVAC Systems',
      location: 'Building C - Mechanical Room',
      purchaseDate: new Date('2024-02-01'),
      warrantyExpiry: new Date('2029-02-01'),
      maintenanceTeam: mechanicalTeam._id,
      defaultTechnician: tech1._id,
      notes: 'New high-efficiency chiller',
      createdBy: manager1._id,
    });

    console.log('✅ 15 Equipment items created');

    // Create Maintenance Requests
    console.log('📋 Creating maintenance requests...');

    // NEW REQUESTS (Pending Assignment)
    await MaintenanceRequest.create({
      subject: 'Quarterly HVAC Filter Replacement',
      description: 'Replace all filters in Rooftop HVAC Unit #1 as part of preventive maintenance schedule',
      requestType: 'Preventive',
      status: 'New',
      equipment: hvacUnit1._id,
      scheduledDate: new Date('2026-02-15T09:00:00'),
      durationHours: 2,
      createdBy: manager1._id,
    });

    await MaintenanceRequest.create({
      subject: 'Printer Paper Jam Issue',
      description: 'Industrial label printer experiencing frequent paper jams. Requires inspection and adjustment.',
      requestType: 'Corrective',
      status: 'New',
      equipment: printer1._id,
      scheduledDate: new Date('2026-01-05T14:00:00'),
      durationHours: 1,
      createdBy: user2._id,
    });

    await MaintenanceRequest.create({
      subject: 'Forklift Battery Replacement',
      description: 'Battery showing signs of degradation. Schedule replacement during next maintenance window.',
      requestType: 'Corrective',
      status: 'New',
      equipment: forklift1._id,
      scheduledDate: new Date('2026-01-08T10:00:00'),
      durationHours: 3,
      createdBy: user3._id,
    });

    // NEW WITH TEAM ASSIGNED
    await MaintenanceRequest.create({
      subject: 'Annual Boiler Inspection',
      description: 'Annual safety inspection and tune-up of industrial boiler. Required by insurance.',
      requestType: 'Preventive',
      status: 'New',
      equipment: boiler1._id,
      maintenanceTeam: mechanicalTeam._id,
      scheduledDate: new Date('2026-02-01T08:00:00'),
      durationHours: 4,
      createdBy: manager1._id,
    });

    await MaintenanceRequest.create({
      subject: 'Generator Load Bank Testing',
      description: 'Quarterly load bank test to ensure generator operates at full capacity',
      requestType: 'Preventive',
      status: 'New',
      equipment: generator1._id,
      maintenanceTeam: electricalTeam._id,
      scheduledDate: new Date('2026-01-20T07:00:00'),
      durationHours: 3,
      createdBy: manager2._id,
    });

    // IN PROGRESS REQUESTS
    await MaintenanceRequest.create({
      subject: 'Compressor Oil Leak Repair',
      description: 'Oil leak detected at main seal of Air Compressor #1. Requires immediate attention and seal replacement.',
      requestType: 'Corrective',
      status: 'In Progress',
      equipment: compressor1._id,
      maintenanceTeam: mechanicalTeam._id,
      assignedTechnician: tech2._id,
      scheduledDate: new Date('2026-01-02T10:00:00'),
      durationHours: 4,
      createdBy: user1._id,
    });

    await MaintenanceRequest.create({
      subject: 'Conveyor Belt Alignment',
      description: 'Production conveyor belt tracking off-center. Needs realignment to prevent damage.',
      requestType: 'Corrective',
      status: 'In Progress',
      equipment: conveyor1._id,
      maintenanceTeam: mechanicalTeam._id,
      assignedTechnician: tech3._id,
      scheduledDate: new Date('2026-01-02T13:00:00'),
      durationHours: 2,
      createdBy: user2._id,
    });

    await MaintenanceRequest.create({
      subject: 'CNC Machine Calibration',
      description: 'Monthly calibration check and adjustment of CNC machine axes',
      requestType: 'Preventive',
      status: 'In Progress',
      equipment: cnc1._id,
      maintenanceTeam: mechanicalTeam._id,
      assignedTechnician: tech1._id,
      scheduledDate: new Date('2026-01-02T11:00:00'),
      durationHours: 3,
      createdBy: manager2._id,
    });

    await MaintenanceRequest.create({
      subject: 'Electrical Panel Thermal Inspection',
      description: 'Infrared thermal scan of main electrical panel to detect hot spots',
      requestType: 'Preventive',
      status: 'In Progress',
      equipment: electricalPanel1._id,
      maintenanceTeam: electricalTeam._id,
      assignedTechnician: tech4._id,
      scheduledDate: new Date('2026-01-02T09:00:00'),
      durationHours: 2,
      createdBy: manager1._id,
    });

    // REPAIRED REQUESTS (Completed)
    await MaintenanceRequest.create({
      subject: 'Chiller Refrigerant Recharge',
      description: 'Low refrigerant levels detected. Performed leak test and recharged system.',
      requestType: 'Corrective',
      status: 'Repaired',
      equipment: chiller1._id,
      maintenanceTeam: mechanicalTeam._id,
      assignedTechnician: tech1._id,
      scheduledDate: new Date('2025-12-28T08:00:00'),
      durationHours: 3.5,
      completedAt: new Date('2025-12-28T12:30:00'),
      createdBy: user1._id,
    });

    await MaintenanceRequest.create({
      subject: 'Water Pump Bearing Replacement',
      description: 'Replaced worn bearings in water pump. System tested and operating normally.',
      requestType: 'Corrective',
      status: 'Repaired',
      equipment: pump1._id,
      maintenanceTeam: mechanicalTeam._id,
      assignedTechnician: tech3._id,
      scheduledDate: new Date('2025-12-20T10:00:00'),
      durationHours: 4,
      completedAt: new Date('2025-12-20T15:00:00'),
      createdBy: user3._id,
    });

    await MaintenanceRequest.create({
      subject: 'HVAC Filter Replacement',
      description: 'Quarterly filter replacement completed on Rooftop HVAC Unit #2',
      requestType: 'Preventive',
      status: 'Repaired',
      equipment: hvacUnit2._id,
      maintenanceTeam: mechanicalTeam._id,
      assignedTechnician: tech1._id,
      scheduledDate: new Date('2025-12-15T09:00:00'),
      durationHours: 1.5,
      completedAt: new Date('2025-12-15T11:00:00'),
      createdBy: manager1._id,
    });

    await MaintenanceRequest.create({
      subject: 'Electrical Panel B Inspection',
      description: 'Annual electrical panel inspection completed. All connections tight, no issues found.',
      requestType: 'Preventive',
      status: 'Repaired',
      equipment: electricalPanel2._id,
      maintenanceTeam: electricalTeam._id,
      assignedTechnician: tech2._id,
      scheduledDate: new Date('2025-12-10T08:00:00'),
      durationHours: 2,
      completedAt: new Date('2025-12-10T10:30:00'),
      createdBy: manager1._id,
    });

    await MaintenanceRequest.create({
      subject: 'Compressor #2 Oil Change',
      description: 'Scheduled oil change and filter replacement on backup air compressor',
      requestType: 'Preventive',
      status: 'Repaired',
      equipment: compressor2._id,
      maintenanceTeam: mechanicalTeam._id,
      assignedTechnician: tech2._id,
      scheduledDate: new Date('2025-12-05T13:00:00'),
      durationHours: 2,
      completedAt: new Date('2025-12-05T15:30:00'),
      createdBy: manager2._id,
    });

    // SCRAP REQUEST
    await MaintenanceRequest.create({
      subject: 'Old Chiller Decommission',
      description: 'Chiller #2 beyond economic repair. Equipment marked for scrap and replacement approved.',
      requestType: 'Corrective',
      status: 'Scrap',
      equipment: chiller2._id,
      maintenanceTeam: mechanicalTeam._id,
      assignedTechnician: tech1._id,
      scheduledDate: new Date('2025-11-30T08:00:00'),
      durationHours: 6,
      completedAt: new Date('2025-11-30T16:00:00'),
      createdBy: manager1._id,
    });

    console.log('✅ 16 Maintenance requests created');
    console.log('   - 3 New (unassigned)');
    console.log('   - 2 New (team assigned)');
    console.log('   - 4 In Progress');
    console.log('   - 5 Repaired');
    console.log('   - 1 Scrap');

    console.log('\n🎉 Seed data created successfully!');
    console.log('\n📊 Database Summary:');
    console.log('═══════════════════════════════════════════');
    console.log('👥 Users: 12 total');
    console.log('   - 1 Admin');
    console.log('   - 2 Managers');
    console.log('   - 6 Technicians');
    console.log('   - 3 Regular Users');
    console.log('');
    console.log('👥 Teams: 4 maintenance teams');
    console.log('   - Mechanical Team (3 members)');
    console.log('   - Electrical Team (2 members)');
    console.log('   - Facility Maintenance (2 members)');
    console.log('   - Emergency Response (3 members)');
    console.log('');
    console.log('🔧 Equipment: 15 items');
    console.log('   - All with assigned teams');
    console.log('   - All with default technicians');
    console.log('   - Various departments & locations');
    console.log('');
    console.log('📋 Requests: 16 maintenance requests');
    console.log('   - 3 New (unassigned)');
    console.log('   - 2 New (team assigned)');
    console.log('   - 4 In Progress');
    console.log('   - 5 Repaired (completed)');
    console.log('   - 1 Scrap');
    console.log('═══════════════════════════════════════════');
    console.log('\n📧 Test User Credentials:');
    console.log('─────────────────────────────────────────────');
    console.log('🔴 Admin:');
    console.log('   admin@gearguard.com / password123');
    console.log('');
    console.log('🟡 Managers:');
    console.log('   manager@gearguard.com / password123');
    console.log('   manager2@gearguard.com / password123');
    console.log('');
    console.log('🔵 Technicians:');
    console.log('   tech1@gearguard.com / password123 (Alice)');
    console.log('   tech2@gearguard.com / password123 (Bob)');
    console.log('   tech3@gearguard.com / password123 (Charlie)');
    console.log('   tech4@gearguard.com / password123 (Diana)');
    console.log('   tech5@gearguard.com / password123 (Erik)');
    console.log('   tech6@gearguard.com / password123 (Fiona)');
    console.log('');
    console.log('🟢 Regular Users:');
    console.log('   user@gearguard.com / password123');
    console.log('   user2@gearguard.com / password123');
    console.log('   user3@gearguard.com / password123');
    console.log('─────────────────────────────────────────────');
    console.log('\n✅ All dropdowns now populated with data!');
    console.log('✅ Equipment has teams & technicians assigned');
    console.log('✅ Requests span all statuses for testing');
    console.log('✅ Ready to test complete workflow!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

// Run seeder
connectDB().then(() => seedData());
