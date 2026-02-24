const https = require('https');
const fs = require('fs');
const path = require('path');
const winston = require('winston');
const LokiTransport = require('winston-loki');
const app = require('./app');
require('dotenv').config();

// Loki logger (Splunk-style)
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new LokiTransport({
      host: 'http://localhost:3100',
      labels: { app: 'nithesh-backend', env: 'local' },
      onConnectionError: (err) => console.error('Loki connection error:', err),
      gracefulShutdown: true,
      clearOnError: false,
      replaceTimestamp: true,
    })
  ]
});

const PORT = process.env.PORT || 5001;

// Load SSL certificates
const options = {
  cert: fs.readFileSync(path.join(__dirname, '../../../certs/localhost.crt')),
  key: fs.readFileSync(path.join(__dirname, '../../../certs/localhost.key'))
};

// Log startup
logger.info('🚀 Backend starting', { port: PORT, env: process.env.NODE_ENV });

https.createServer(options, app).listen(PORT, () => {
  logger.info('🔒 HTTPS Server running', { 
    url: `https://localhost:${PORT}`,
    swagger: `https://localhost:${PORT}/api-docs`
  });
  console.log(`🔒 HTTPS Server running on https://localhost:${PORT}`);
  console.log(`📚 Swagger docs at https://localhost:${PORT}/api-docs`);
});