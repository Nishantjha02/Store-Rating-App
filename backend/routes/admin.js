const express = require('express');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { authenticateToken, requireRole } = require('../middleware/auth');
const User = require('../models/User');
const Store = require('../models/Store');
const Rating = require('../models/Rating');
const { registerValidation, storeValidation } = require('../utils/validation');

const router = express.Router();

// Middleware for admin routes
router.use(authenticateToken);
router.use(requireRole(['admin']));

// Dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const [userCount, storeCount, ratingCount] = await Promise.all([
      User.getCount(),
      Store.getCount(),
      Rating.getCount()
    ]);

    res.json({
      totalUsers: userCount,
      totalStores: storeCount,
      totalRatings: ratingCount
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const filters = {
      name: req.query.name,
      email: req.query.email,
      address: req.query.address,
      role: req.query.role,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder
    };

    const users = await User.getAll(filters);
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new user
router.post('/users', registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, address, role } = req.body;

    // Check if user exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userId = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      role
    });

    res.status(201).json({ message: 'User created successfully', userId });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all stores
router.get('/stores', async (req, res) => {
  try {
    const filters = {
      name: req.query.name,
      email: req.query.email,
      address: req.query.address,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder
    };

    const stores = await Store.getAll(filters);
    res.json(stores);
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new store
router.post('/stores', storeValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, address, ownerEmail, ownerPassword } = req.body;

    // Check if store email exists
    const existingStore = await Store.findByEmail(email);
    if (existingStore) {
      return res.status(400).json({ message: 'Store email already exists' });
    }

    // Check if owner email exists
    const existingOwner = await User.findByEmail(ownerEmail);
    if (existingOwner) {
      return res.status(400).json({ message: 'Owner email already exists' });
    }

    // Create store owner user first
    const hashedPassword = await bcrypt.hash(ownerPassword, 10);
    const ownerId = await User.create({
      name,
      email: ownerEmail,
      password: hashedPassword,
      address,
      role: 'store_owner'
    });

    // Create store
    const storeId = await Store.create({
      name,
      email,
      address,
      owner_id: ownerId
    });

    res.status(201).json({ message: 'Store created successfully', storeId });
  } catch (error) {
    console.error('Create store error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;