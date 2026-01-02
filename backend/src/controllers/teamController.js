const Team = require('../models/Team');
const { paginate } = require('../utils/pagination');

// @desc    Get all teams
// @route   GET /api/teams
// @access  Private
exports.getTeams = async (req, res, next) => {
  try {
    const {
      page, limit, isActive, search,
    } = req.query;

    const filter = {};
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const result = await paginate(Team, filter, {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
      populate: 'teamLead members createdBy',
      sort: 'name',
    });

    res.json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get team by ID
// @route   GET /api/teams/:id
// @access  Private
exports.getTeamById = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('teamLead members createdBy');

    if (!team) {
      return res.status(404).json({
        status: 'error',
        message: 'Team not found',
      });
    }

    res.json({
      status: 'success',
      data: { team },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create team
// @route   POST /api/teams
// @access  Private (Admin, Manager)
exports.createTeam = async (req, res, next) => {
  try {
    const team = await Team.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.status(201).json({
      status: 'success',
      data: { team },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update team
// @route   PUT /api/teams/:id
// @access  Private (Admin, Manager)
exports.updateTeam = async (req, res, next) => {
  try {
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!team) {
      return res.status(404).json({
        status: 'error',
        message: 'Team not found',
      });
    }

    res.json({
      status: 'success',
      data: { team },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete team
// @route   DELETE /api/teams/:id
// @access  Private (Admin, Manager)
exports.deleteTeam = async (req, res, next) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);

    if (!team) {
      return res.status(404).json({
        status: 'error',
        message: 'Team not found',
      });
    }

    res.json({
      status: 'success',
      message: 'Team deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
