const winston = require('winston');
const LokiTransport = require('winston-loki');

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
      replaceTimestamp: true,
    })
  ]
});

module.exports = logger;