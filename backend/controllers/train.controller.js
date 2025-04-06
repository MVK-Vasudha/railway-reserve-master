
const Train = require('../models/Train');

// @desc    Get all trains
// @route   GET /api/trains
// @access  Public
exports.getTrains = async (req, res, next) => {
  try {
    const trains = await Train.find();
    
    res.status(200).json({
      success: true,
      count: trains.length,
      data: trains
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single train
// @route   GET /api/trains/:id
// @access  Public
exports.getTrain = async (req, res, next) => {
  try {
    const train = await Train.findById(req.params.id);
    
    if (!train) {
      return res.status(404).json({
        success: false,
        message: `Train not found with id of ${req.params.id}`
      });
    }
    
    res.status(200).json({
      success: true,
      data: train
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new train
// @route   POST /api/trains
// @access  Private/Admin
exports.createTrain = async (req, res, next) => {
  try {
    const train = await Train.create(req.body);
    
    res.status(201).json({
      success: true,
      data: train
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update train
// @route   PUT /api/trains/:id
// @access  Private/Admin
exports.updateTrain = async (req, res, next) => {
  try {
    let train = await Train.findById(req.params.id);
    
    if (!train) {
      return res.status(404).json({
        success: false,
        message: `Train not found with id of ${req.params.id}`
      });
    }
    
    train = await Train.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: train
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete train
// @route   DELETE /api/trains/:id
// @access  Private/Admin
exports.deleteTrain = async (req, res, next) => {
  try {
    const train = await Train.findById(req.params.id);
    
    if (!train) {
      return res.status(404).json({
        success: false,
        message: `Train not found with id of ${req.params.id}`
      });
    }
    
    await train.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Search trains
// @route   GET /api/trains/search
// @access  Public
exports.searchTrains = async (req, res, next) => {
  try {
    const { source, destination, date } = req.query;
    
    if (!source || !destination || !date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide source, destination and date'
      });
    }
    
    // Search for trains matching source and destination
    const trains = await Train.find({
      source: source,
      destination: destination
    });
    
    if (trains.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No trains found for this route'
      });
    }
    
    // Convert date string to day of week
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
    
    // Filter trains that run on this day of week or are daily
    const availableTrains = trains.filter(train => 
      train.days.includes(dayOfWeek) || train.days.includes('Daily')
    );
    
    res.status(200).json({
      success: true,
      count: availableTrains.length,
      data: availableTrains
    });
  } catch (err) {
    next(err);
  }
};
