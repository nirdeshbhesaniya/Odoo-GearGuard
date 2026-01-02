const Equipment = require('../models/Equipment');
const MaintenanceRequest = require('../models/MaintenanceRequest');
const { paginate } = require('../utils/pagination');
const asyncHandler = require('../utils/asyncHandler');
const { NotFoundError, BadRequestError } = require('../utils/AppError');

// @desc    Get all equipment
// @route   GET /api/equipment
// @access  Private
exports.getEquipment = asyncHandler(async (req, res) => {
  const {
    page, limit, status, category, search,
  } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { serialNumber: { $regex: search, $options: 'i' } },
      { manufacturer: { $regex: search, $options: 'i' } },
    ];
  }

  const result = await paginate(Equipment, filter, {
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 100,
    populate: 'maintenanceTeam defaultTechnician createdBy',
    sort: '-createdAt',
  });

  res.json({
    status: 'success',
    data: result,
  });
});

// @desc    Get equipment by ID
// @route   GET /api/equipment/:id
// @access  Private
exports.getEquipmentById = asyncHandler(async (req, res) => {
  const equipment = await Equipment.findById(req.params.id)
    .populate('maintenanceTeam defaultTechnician createdBy');

  if (!equipment) {
    throw new NotFoundError('Equipment not found');
  }

  res.json({
    status: 'success',
    data: { equipment },
  });
});

// @desc    Get maintenance history
// @route   GET /api/equipment/:id/history
// @access  Private
exports.getMaintenanceHistory = asyncHandler(async (req, res) => {
  const history = await MaintenanceRequest.find({ equipment: req.params.id })
    .populate('maintenanceTeam defaultTechnician createdBy')
    .sort('-createdAt');

  res.json({
    status: 'success',
    data: { history },
  });
});

// @desc    Create equipment
// @route   POST /api/equipment
// @access  Private (Admin, Manager)
exports.createEquipment = asyncHandler(async (req, res) => {
  const equipment = await Equipment.create({
    ...req.body,
    createdBy: req.user.id,
  });

  res.status(201).json({
    status: 'success',
    data: { equipment },
  });
});

// @desc    Update equipment
// @route   PUT /api/equipment/:id
// @access  Private (Admin, Manager)
exports.updateEquipment = asyncHandler(async (req, res) => {
  const equipment = await Equipment.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true },
  );

  if (!equipment) {
    throw new NotFoundError('Equipment not found');
  }

  res.json({
    status: 'success',
    data: { equipment },
  });
});

// @desc    Delete equipment
// @route   DELETE /api/equipment/:id
// @access  Private (Admin, Manager)
exports.deleteEquipment = asyncHandler(async (req, res) => {
  // Check if equipment has active maintenance requests
  const activeRequests = await MaintenanceRequest.countDocuments({
    equipment: req.params.id,
    status: { $in: ['New', 'In Progress'] },
  });

  if (activeRequests > 0) {
    throw new BadRequestError(
      `Cannot delete equipment with ${activeRequests} active maintenance request(s). `
      + 'Please complete or reassign them first.',
    );
  }

  const equipment = await Equipment.findByIdAndDelete(req.params.id);

  if (!equipment) {
    throw new NotFoundError('Equipment not found');
  }

  res.json({
    status: 'success',
    message: 'Equipment deleted successfully',
  });
});
