import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "error.log", level: "error" }),
  ],
});

logger.info("Server started successfully!");
logger.error("Database connection failed!");