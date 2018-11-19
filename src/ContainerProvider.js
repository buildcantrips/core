import { runCommand } from "./Utils/ProcessUtils";
import logger from "./Logger";

export default async (...args) => {
  const container = new Container(...args);
  await container.initializeContainer();
  return container;
};

export class Container {
  constructor(imageUrl, options, commandRunner = undefined) {
    this.imageUrl = imageUrl;
    this.volumes = options ? options.volumes : [];
    this.environment = options ? options.environment : {};
    this.runCommand = commandRunner || runCommand;
  }

  addEnvironmentVariable(name, value) {
    logger.debug(`Adding environment variable ${name} to container`);
    this.environment[name] = value;
  }

  async initializeContainer() {
    await this.runCommand(
      `docker pull ${this.imageUrl}`,
      `Pulling image ${this.imageUrl}`,
      { silent: true }
    );
  }

  async run(command, details = "") {
    var environmentString = "";
    for (let key of Object.keys(this.environment)) {
      environmentString += ` -e ${key}=${this.environment[key]}`;
    }
    var commandToRun = "docker run ";
    commandToRun += environmentString;
    commandToRun += ` ${this.volumes.length ? "-v " : ""}${this.volumes.join(
      "-v "
    )}`;
    commandToRun += this.imageUrl;
    commandToRun += ` ${command}`;
    return this.runCommand(commandToRun, details);
  }
}
