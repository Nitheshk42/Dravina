require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const logger = require('../logger');  // ← ADDED

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// ─── REGISTER ───────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if all fields are provided
    if (!name || !email || !password) {
      logger.warn('Register failed - missing fields', { email });  // ← ADDED
      return res.status(400).json({ message: 'All fields are required!' });
    }

    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      logger.warn('Register failed - email already exists', { email });  // ← ADDED
      return res.status(400).json({ message: 'Email already registered!' });
    }

    // 3. Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Save user to database
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    });

    logger.info('New user registered', { userId: user.id, email: user.email });  // ← ADDED

    // 5. Return success
    res.status(201).json({
      message: 'Account created successfully!',
      user: { id: user.id, name: user.name, email: user.email }
    });

  } catch (error) {
    logger.error('Register error', { error: error.message });  // ← ADDED
    res.status(500).json({ message: 'Something went wrong!' });
  }
};

// ─── LOGIN ──────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if all fields are provided
    if (!email || !password) {
      logger.warn('Login failed - missing fields', { email });  // ← ADDED
      return res.status(400).json({ message: 'All fields are required!' });
    }

    // 2. Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      logger.warn('Login failed - user not found', { email });  // ← ADDED
      return res.status(400).json({ message: 'Invalid email or password!' });
    }

    // 3. Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      logger.warn('Login failed - wrong password', { email });  // ← ADDED
      return res.status(400).json({ message: 'Invalid email or password!' });
    }

    // 4. Create JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    logger.info('User logged in successfully', { userId: user.id, email });  // ← ADDED

    // 5. Return token + user info
    res.status(200).json({
      message: 'Login successful!',
      token,
      user: { id: user.id, name: user.name, email: user.email, balance: user.balance }
    });

  } catch (error) {
    logger.error('Login error', { error: error.message });  // ← ADDED
    res.status(500).json({ message: 'Something went wrong!' });
  }
};

module.exports = { register, login };