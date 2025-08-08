const express = require('express');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { authenticateToken, requireRole } = require('../middleware/auth');
const Store = require('../models/Store');
const Rating = require('../models/Rating');
const User = require('../models/User');
const { passwordValidation } = require('../utils/validation');

const router = express.Router();

// Middleware for store routes
router.use(authenticateToken);
router.use(requireRole(['store_owner']));

// Get store dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    const store = await Store.getByOwner(req.user.id);
    
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const ratings = await Rating.getStoreRatings(store.id);
    
    res.json({
      store,
      ratings,
      averageRating: store.rating
    });
  } catch (error) {
    console.error('Store dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get store ratings
router.get('/ratings', async (req, res) => {
  try {
    const store = await Store.getByOwner(req.user.id);
    
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const ratings = await Rating.getStoreRatings(store.id);
    res.json(ratings);
  } catch (error) {
    console.error('Get store ratings error:', error);
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