
const express = require('express');
const router = express.Router();
const { 
  getTrains, 
  getTrain, 
  createTrain, 
  updateTrain, 
  deleteTrain,
  searchTrains
} = require('../controllers/train.controller');
const { protect, authorize } = require('../middleware/auth');

// Search trains route
router.get('/search', searchTrains);

// Base train routes
router.route('/')
  .get(getTrains)
  .post(protect, authorize('admin'), createTrain);

router.route('/:id')
  .get(getTrain)
  .put(protect, authorize('admin'), updateTrain)
  .delete(protect, authorize('admin'), deleteTrain);

module.exports = router;
