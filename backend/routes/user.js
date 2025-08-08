const express = require('express');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { authenticateToken, requireRole } = require('../middleware/auth');
const Rating = require('../models/Rating');
const User = require('../models/User');
const { passwordValidation, ratingValidation } = require('../utils/validation');

const router = express.Router();

// Middleware for user routes
router.use(authenticateToken);
router.use(requireRole(['user']));

// Get stores with user ratings
router.get('/stores', async (req, res) => {
  try {
    const filters = {
      name: req.query.name,
      address: req.query.address,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder
    };

    const stores = await Rating.getStoresWithUserRatings(req.user.id, filters);
    res.json(stores);
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit or update rating
router.post('/rating', ratingValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { storeId, rating } = req.body;
    
    await Rating.create(req.user.id, storeId, rating);
    res.json({ message: 'Rating submitted successfully' });
  } catch (error) {
    console.error('Submit rating error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update rating
router.put('/rating', ratingValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { storeId, rating } = req.body;
    
    await Rating.create(req.user.id, storeId, rating);
    res.json({ message: 'Rating updated successfully' });
  } catch (error) {
    console.error('Update rating error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update password
router.put('/password', passwordValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await User.updatePassword(req.user.id, hashedPassword);
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;