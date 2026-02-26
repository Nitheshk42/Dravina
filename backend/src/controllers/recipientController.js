require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const logger = require('../logger');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// ─── ADD RECIPIENT ───────────────────────────────────────────
const addRecipient = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { fullName, email, phone, country, bankAccount, ifscCode, transferringTo } = req.body;

    if (!fullName || !email || !phone || !country || !bankAccount || !ifscCode) {
      return res.status(400).json({ message: 'All fields are required!' });
    }

    const recipient = await prisma.recipient.create({
      data: {
        userId,
        fullName,
        email,
        phone,
        country,
        bankAccount,
        ifscCode,
        transferringTo: transferringTo || 'Someone Else'
      }
    });

    logger.info('Recipient added', { userId, recipientId: recipient.id });

    res.status(201).json({ message: 'Recipient added successfully!', recipient });

  } catch (error) {
    logger.error('Add recipient error', { error: error.message });
    res.status(500).json({ message: 'Something went wrong!' });
  }
};

// ─── GET ALL RECIPIENTS ──────────────────────────────────────
const getRecipients = async (req, res) => {
  try {
    const userId = req.user.userId;

    const recipients = await prisma.recipient.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    logger.info('Recipients fetched', { userId, count: recipients.length });

    res.status(200).json({ recipients });

  } catch (error) {
    logger.error('Get recipients error', { error: error.message });
    res.status(500).json({ message: 'Something went wrong!' });
  }
};

// ─── UPDATE RECIPIENT ────────────────────────────────────────
const updateRecipient = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { fullName, email, phone, country, bankAccount, ifscCode, transferringTo } = req.body;

    const recipient = await prisma.recipient.findUnique({ where: { id } });

    if (!recipient || recipient.userId !== userId) {
      return res.status(404).json({ message: 'Recipient not found!' });
    }

    const updated = await prisma.recipient.update({
      where: { id },
      data: { fullName, email, phone, country, bankAccount, ifscCode, transferringTo }
    });

    logger.info('Recipient updated', { userId, recipientId: id });

    res.status(200).json({ message: 'Recipient updated!', recipient: updated });

  } catch (error) {
    logger.error('Update recipient error', { error: error.message });
    res.status(500).json({ message: 'Something went wrong!' });
  }
};

// ─── DELETE RECIPIENT ────────────────────────────────────────
const deleteRecipient = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const recipient = await prisma.recipient.findUnique({ where: { id } });

    if (!recipient || recipient.userId !== userId) {
      return res.status(404).json({ message: 'Recipient not found!' });
    }

    await prisma.recipient.delete({ where: { id } });

    logger.info('Recipient deleted', { userId, recipientId: id });

    res.status(200).json({ message: 'Recipient deleted successfully!' });

  } catch (error) {
    logger.error('Delete recipient error', { error: error.message });
    res.status(500).json({ message: 'Something went wrong!' });
  }
};

module.exports = { addRecipient, getRecipients, updateRecipient, deleteRecipient };