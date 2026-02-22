
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const transferRoutes = require('./routes/transferRoutes');
const swaggerSpec = require('./swagger');


const app = express();
const PORT = process.env.PORT || 5001;


//Middleware
app.use(cors());
app.use(express.json());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transfer', transferRoutes);

//Test route
app.get ('/' ,(req, res) => {
    res.json({message: "Crobo Backend is running!"});
    });

//start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
      console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
});