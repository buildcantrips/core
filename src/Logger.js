import { format, createLogger, transports } from "winston"
const { colorize, combine, printf } = format

module.exports = createLogger({
  transports: [
    new transports.Console({
      level: process.env.DEBUG ? "debug" : "info",
      format: combine(
        colorize({ message: true }),
        printf(info => {
          return info.message
        })
      )
    })
  ]
})
