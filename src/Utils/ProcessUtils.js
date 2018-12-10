import { exec, execSync } from "child_process"
import ora from "ora"

async function runCommand(command, details = undefined, { silent } = {}) {
  let spinner
  let result = ""
  if (!silent) {
    spinner = ora(details || command).start()
  }
  return new Promise(resolve => {
    const childProcess = exec(command, { cwd: process.cwd() }, error => {
      if (error) {
        if (!silent) {
          spinner.fail()
        }
        throw `Command failed: ${command}:\n${error}`
      }
    })
    if (process.env.DEBUG) {
      childProcess.stdout.pipe(process.stdout)
    }

    childProcess.stdout.on("data", function(data) {
      result += data.toString()
    })
    childProcess.on("exit", (code) => {
      if (!silent && !code) {
        spinner.succeed()
      }
      if (!code) {
        resolve(result)
      }
    })
  })
}

function runCommandSync(command, details = undefined, { silent } = {}) {
  let spinner
  if (!silent) {
    spinner = ora(details || command).start()
  }

  try {
    const childProcess = execSync(command, { cwd: process.cwd(), stdio: process.env.DEBUG ? 'inherit': 'pipe'})
    if (!silent) {
      spinner.succeed()
    }
    return childProcess.toString()
  } catch (e) {
    if (!silent) {
      spinner.fail()
    }
    throw `Command failed: ${command}:\n${e.message}`
  }
}

module.exports = {
  runCommand,
  runCommandSync
}
