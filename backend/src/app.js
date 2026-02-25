const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const transferRoutes = require('./routes/transferRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const swaggerSpec = require('./swagger');

const app = express();

// Middleware
app.use(cors());
// For Stripe webhooks, we need raw body, so we set this route before the JSON parser
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));
// For all other routes, use JSON body parser
app.use(express.json());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transfer', transferRoutes);
app.use('/api/payment', paymentRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Crobo Backend is running! 🚀' });
});

module.exports = app;