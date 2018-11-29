import fs from "fs"
import path from "path"
import { Logger } from "./Logger"

const CONFIG_PATH = path.join(process.cwd(), ".cantrips")

async function parseConfig() {
  if (fs.existsSync(CONFIG_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(CONFIG_PATH))
    } catch (error) {
      Logger.debug(error)
      throw Error(
        `Parsing configuration file ${CONFIG_PATH} failed.\n${error.message}`
      )
    }
  }
}

module.exports = {
  parseConfig
}
