function determineCiServer() {
  if (process.env.CIRCLECI) {
    return "CircleCi";
  }
  if (process.env.TEAMCITY_VERSION) {
    return "TeamCity";
  }
  if (process.env.BUILD_NUMBER) {
    return "Jenkins";
  }

  throw Error("Unknown CI server environment");
}

export class ParameterProvider {
  constructor() {
    this.ciServer = determineCiServer();
    this.parameterMap = {
      DockerRegistry: {
        CircleCi: process.env.DOCKER_REGISTRY || "",
        Jenkins: process.env.DOCKER_REGISTRY || "",
        TeamCity: process.env.DOCKER_REGISTRY || ""
      },
      Tag: {
        CircleCi: process.env.CIRCLE_TAG || "",
        Jenkins: process.env.BRANCH_NAME || "",
        TeamCity: process.env.BRANCH_NAME || ""
      },
      ReleaseTagFormat: {
        CircleCi: process.env.RELEASE_TAG_FORMAT || "release-",
        Jenkins: process.env.RELEASE_TAG_FORMAT || "release-",
        TeamCity: process.env.RELEASE_TAG_FORMAT || "release-"
      },
      BranchName: {
        CircleCi: process.env.CIRCLE_BRANCH || "",
        Jenkins: process.env.BRANCH_NAME || "",
        TeamCity: process.env.BRANCH_NAME || ""
      },
      BuildNumber: {
        CircleCi: "",
        Jenkins: process.env.BUILD_NUMBER || "",
        TeamCity: process.env.BUILD_NUMBER || ""
      }
    };
    this.computeDerivedParameters();
  }

  computeDerivedParameters() {
    let isRelease =
      this.getParameter("Tag") &&
      this.getParameter("Tag").startsWith(this.getParameter("Tag"));

    let releaseVersion = this.getParameter("Tag").replace(
      this.getParameter("ReleaseTagFormat"),
      ""
    );
    this.parameterMap = Object.assign({}, this.parameterMap, {
      IsRelease: {
        CircleCi: isRelease,
        Jenkins: isRelease,
        TeamCity: isRelease
      },
      ReleaseVersion: {
        CircleCi: releaseVersion,
        Jenkins: process.env.BRANCH_NAME || "",
        TeamCity: releaseVersion
      },
      ProjectName: {
        CircleCi: () => {
          const result = `${process.env.CIRCLE_PROJECT_USERNAME || ""}/${process
            .env.CIRCLE_PROJECT_REPONAME || ""}`;
          return result !== "/" ? result : "unknown";
        },
        Jenkins: process.env.JOB_NAME || "",
        TeamCity: () => {
          const result = `${process.env.PROJECT_GROUP || ""}/${process.env
            .PROJECT_NAME || ""}`;
          return result !== "/" ? result : "unknown";
        }
      }
    });
  }

  getParameter(parameter) {
    if (!Object.keys(this.parameterMap).includes(parameter)) {
      throw Error(`Unknown parameter: ${parameter}`);
    }
    const result = this.parameterMap[parameter][this.ciServer];
    if (typeof result === "function") {
      return result();
    }
    return result;
  }
}

export default ParameterProvider;
