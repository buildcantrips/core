import { exec } from "child_process";
import logger from "../Logger";
import ora from "ora";

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
  runCommand
}