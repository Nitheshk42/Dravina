const winston = require('winston');
const LokiTransport = require('winston-loki');
const fs = require('fs');

// Create logs folder if it doesn't exist
if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

const transports = [
  // Always log to console
  new winston.transports.Console(),

  // Always log to file
  new winston.transports.File({
    filename: 'logs/app.log',
    maxsize: 5242880,
    maxFiles: 5,
  }),
];

// Only use Loki in local development
if (process.env.NODE_ENV !== 'production') {
  transports.push(
    new LokiTransport({
      host: 'http://localhost:3100',
      labels: { app: 'nithesh-backend', env: 'local' },
      onConnectionError: (err) => console.error('Loki connection error:', err),
      gracefulShutdown: true,
      replaceTimestamp: true,
    })
  );
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports
});

module.exports = logger;