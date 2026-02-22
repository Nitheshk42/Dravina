require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const FLAT_FEE = 2.99;

// ─── SEND MONEY ─────────────────────────────────────────────
const sendMoney = async (req, res) => {
  try {
    const { amountSent, amountReceived, currency, country, exchangeRate } = req.body;
    const userId = req.user.userId;

    // 1. Check all fields
    if (!amountSent || !amountReceived || !currency || !country || !exchangeRate) {
      return res.status(400).json({ message: 'All fields are required!' });
    }

    // 2. Check amount is valid
    if (amountSent <= FLAT_FEE) {
      return res.status(400).json({ message: `Amount must be greater than $${FLAT_FEE}!` });
    }

    // 3. Get user from database
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    // 4. Check user has enough balance
    if (user.balance < amountSent) {
      return res.status(400).json({ message: 'Insufficient balance!' });
    }

    // 5. Deduct balance from user
    await prisma.user.update({
      where: { id: userId },
      data: { balance: user.balance - amountSent }
    });

    // 6. Create transaction record
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        amountSent,
        amountReceived,
        currency,
        country,
        exchangeRate,
        fee: FLAT_FEE,
        status: 'Completed'
      }
    });

    // 7. Return success
    res.status(201).json({
      message: 'Transfer successful!',
      transaction
    });

  } catch (error) {
    console.log('Transfer error:', error);
    res.status(500).json({ message: 'Something went wrong!' });
  }
};

// ─── GET HISTORY ────────────────────────────────────────────
const getHistory = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get all transactions for this user
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ transactions });

  } catch (error) {
    console.log('History error:', error);
    res.status(500).json({ message: 'Something went wrong!' });
  }
};

// ─── GET BALANCE ─────────────────────────────────────────────
const getBalance = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true, name: true, email: true }
    });

    res.status(200).json({ user });

  } catch (error) {
    console.log('Balance error:', error);
    res.status(500).json({ message: 'Something went wrong!' });
  }
};

module.exports = { sendMoney, getHistory, getBalance };