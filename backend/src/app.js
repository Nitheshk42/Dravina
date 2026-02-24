const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const transferRoutes = require('./routes/transferRoutes');
const swaggerSpec = require('./swagger');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transfer', transferRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Crobo Backend is running! 🚀' });
});

module.exports = app;