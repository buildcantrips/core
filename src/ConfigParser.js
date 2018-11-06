import fs from "fs";
import path from "path";

const CONFIG_PATH = path.join(process.cwd(), ".cantrips");

async function parseConfig() {
  if (fs.existsSync(CONFIG_PATH)) {
    return JSON.parse(fs.readFileSync(CONFIG_PATH));
  }
}

module.exports = {
  parseConfig
};
