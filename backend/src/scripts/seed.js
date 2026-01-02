require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Models
const User = require('../models/User');
const Equipment = require('../models/Equipment');
const Team = require('../models/Team');
const MaintenanceRequest = require('../models/MaintenanceRequest');

// Constants
const {
  USER_ROLES, REQUEST_TYPES, REQUEST_PRIORITY, EQUIPMENT_STATUS,
} = require('../config/constants');

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
    const hashedPassword = await bcrypt.hash('password123', 10);

    await User.create({
      email: 'admin@gearguard.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: USER_ROLES.ADMIN,
      phone: '+1-555-0001',
      department: 'IT',
      isActive: true,
    });

    const manager = await User.create({
      email: 'manager@gearguard.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Manager',
      role: USER_ROLES.MANAGER,
      phone: '+1-555-0002',
      department: 'Operations',
      isActive: true,
    });

    const tech1 = await User.create({
      email: 'tech1@gearguard.com',
      password: hashedPassword,
      firstName: 'Alice',
      lastName: 'Technician',
      role: USER_ROLES.TECHNICIAN,
      phone: '+1-555-0003',
      department: 'Maintenance',
      isActive: true,
    });

    const tech2 = await User.create({
      email: 'tech2@gearguard.com',
      password: hashedPassword,
      firstName: 'Bob',
      lastName: 'Engineer',
      role: USER_ROLES.TECHNICIAN,
      phone: '+1-555-0004',
      department: 'Maintenance',
      isActive: true,
    });

    const user1 = await User.create({
      email: 'user@gearguard.com',
      password: hashedPassword,
      firstName: 'Regular',
      lastName: 'User',
      role: USER_ROLES.USER,
      phone: '+1-555-0005',
      department: 'Production',
      isActive: true,
    });

    console.log('✅ Users created');

    // Create Teams
    console.log('👥 Creating teams...');
    const team1 = await Team.create({
      name: 'Mechanical Team',
      description: 'Handles all mechanical equipment maintenance',
      lead: tech1._id,
      members: [tech1._id, tech2._id],
      specializations: ['HVAC', 'Pumps', 'Compressors'],
      isActive: true,
      createdBy: manager._id,
    });

    const team2 = await Team.create({
      name: 'Electrical Team',
      description: 'Handles all electrical equipment maintenance',
      lead: tech2._id,
      members: [tech2._id],
      specializations: ['Electrical', 'Controls', 'Automation'],
      isActive: true,
      createdBy: manager._id,
    });

    console.log('✅ Teams created');

    // Create Equipment
    console.log('🔧 Creating equipment...');
    const equipment1 = await Equipment.create({
      name: 'Industrial Chiller #1',
      category: 'HVAC',
      serialNumber: 'CHIL-001-2023',
      manufacturer: 'Carrier',
      model: 'AquaEdge 19DV',
      status: EQUIPMENT_STATUS.OPERATIONAL,
      location: {
        building: 'Building A',
        floor: '1',
        room: 'Mechanical Room',
      },
      purchaseDate: new Date('2023-01-15'),
      warrantyExpiry: new Date('2026-01-15'),
      lastMaintenanceDate: new Date('2025-11-01'),
      nextMaintenanceDate: new Date('2026-02-01'),
      assignedTo: team1._id,
      createdBy: manager._id,
    });

    const equipment2 = await Equipment.create({
      name: 'Air Compressor #3',
      category: 'Compressor',
      serialNumber: 'COMP-003-2022',
      manufacturer: 'Atlas Copco',
      model: 'GA 37',
      status: EQUIPMENT_STATUS.OPERATIONAL,
      location: {
        building: 'Building B',
        floor: 'Ground',
        room: 'Compressor Room',
      },
      purchaseDate: new Date('2022-06-10'),
      warrantyExpiry: new Date('2025-06-10'),
      lastMaintenanceDate: new Date('2025-12-15'),
      nextMaintenanceDate: new Date('2026-01-15'),
      assignedTo: team1._id,
      createdBy: manager._id,
    });

    const equipment3 = await Equipment.create({
      name: 'Electrical Panel #5',
      category: 'Electrical',
      serialNumber: 'ELEC-005-2023',
      manufacturer: 'Schneider Electric',
      model: 'PowerPact',
      status: EQUIPMENT_STATUS.OPERATIONAL,
      location: {
        building: 'Building A',
        floor: '2',
        room: 'Electrical Room',
      },
      purchaseDate: new Date('2023-03-20'),
      warrantyExpiry: new Date('2028-03-20'),
      assignedTo: team2._id,
      createdBy: manager._id,
    });

    console.log('✅ Equipment created');

    // Create Maintenance Requests
    console.log('📋 Creating maintenance requests...');
    await MaintenanceRequest.create({
      title: 'Chiller Annual Inspection',
      description: 'Annual preventive maintenance and inspection of chiller system',
      type: REQUEST_TYPES.PREVENTIVE,
      priority: REQUEST_PRIORITY.MEDIUM,
      status: 'pending',
      equipment: equipment1._id,
      assignedTeam: team1._id,
      assignedTechnicians: [tech1._id],
      scheduledDate: new Date('2026-02-01'),
      estimatedDuration: 4,
      createdBy: manager._id,
    });

    await MaintenanceRequest.create({
      title: 'Compressor Oil Leak Repair',
      description: 'Oil leak detected at main seal. Requires immediate attention.',
      type: REQUEST_TYPES.CORRECTIVE,
      priority: REQUEST_PRIORITY.HIGH,
      status: 'in_progress',
      equipment: equipment2._id,
      assignedTeam: team1._id,
      assignedTechnicians: [tech1._id, tech2._id],
      scheduledDate: new Date(),
      startedAt: new Date(),
      estimatedDuration: 6,
      createdBy: user1._id,
    });

    await MaintenanceRequest.create({
      title: 'Electrical Panel Thermal Scan',
      description: 'Quarterly thermal imaging scan of electrical panel',
      type: REQUEST_TYPES.PREVENTIVE,
      priority: REQUEST_PRIORITY.LOW,
      status: 'completed',
      equipment: equipment3._id,
      assignedTeam: team2._id,
      assignedTechnicians: [tech2._id],
      scheduledDate: new Date('2025-12-20'),
      startedAt: new Date('2025-12-20'),
      completedAt: new Date('2025-12-21'),
      estimatedDuration: 2,
      actualDuration: 1.5,
      workPerformed: 'Thermal scan completed. No hotspots detected. All connections secure.',
      createdBy: manager._id,
      closedBy: tech2._id,
    });

    console.log('✅ Maintenance requests created');

    console.log('\n🎉 Seed data created successfully!');
    console.log('\n📧 Test User Credentials:');
    console.log('─────────────────────────────────────');
    console.log('Admin: admin@gearguard.com / password123');
    console.log('Manager: manager@gearguard.com / password123');
    console.log('Technician 1: tech1@gearguard.com / password123');
    console.log('Technician 2: tech2@gearguard.com / password123');
    console.log('User: user@gearguard.com / password123');
    console.log('─────────────────────────────────────\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

// Run seeder
connectDB().then(() => seedData());
