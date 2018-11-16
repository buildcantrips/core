import fs from "fs";
import { exec } from "child_process";
import logger from "./Logger";
import ora from "ora";

function normalizeString(string) {
  return string
    .split("/")
    .join("-")
    .toLowerCase();
}

function isNormalizedString(string) {
  return !string.includes("/") && string === string.toLowerCase();
}

function deleteFolderRecursive(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file) {
      var curPath = path + "/" + file;
      if (fs.statSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

async function runCommand(command, details = undefined, { silent } = {}) {
  let spinner;
  let result = '';
  if (!silent) {
    spinner = ora(details || command).start();
  }
  const childProcess = exec(command, { cwd: process.cwd() }, error => {
    if (error) {
      if (!silent) {
        spinner.fail();
      }
      logger.error(`exec error: ${error}`);
    }
  });
  if (process.env.DEBUG) {
    childProcess.stdout.pipe(process.stdout);
  }
  return new Promise(resolve => {
    childProcess.stdout.on('data', function(data) {
      result += data.toString();
    });
    childProcess.on("exit", () => {
      if (!silent) {
        spinner.succeed();
      }
      resolve(result);
    });
  });
}

module.exports = {
  normalizeString: normalizeString,
  deleteFolderRecursive: deleteFolderRecursive,
  runCommand: runCommand,
  isNormalizedString: isNormalizedString
};
