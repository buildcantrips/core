import fs from "fs";
import winston from "winston";

winston.emitErrs = true;
const logFolder = "./logs";

if (!fs.existsSync(logFolder)) {
  fs.mkdirSync(logFolder);
}

module.exports = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: process.env.DEBUG ? "debug": "info",
      handleExceptions: true,
      json: false,
      colorize: true
    })
  ],
  exitOnError: true
});
