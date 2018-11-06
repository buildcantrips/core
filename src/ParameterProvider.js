"use strict";

function determineCiServer() {
  if (process.env.CIRCLECI) {
    return "CircleCi";
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
      DockerTarget: {
        CircleCi: process.env.DOCKER_TARGET || "",
        Jenkins: process.env.DOCKER_TARGET || ""
      },
      Tag: {
        CircleCi: process.env.CIRCLE_TAG || "",
        Jenkins: process.env.BRANCH_NAME || ""
      },
      ReleaseTagFormat: {
        CircleCi: process.env.RELEASE_TAG_FORMAT || "release-",
        Jenkins: process.env.RELEASE_TAG_FORMAT || "release-"
      },
      ReleaseVersion: {
        CircleCi: process.env.RELEASE_VERSION || "",
        Jenkins: process.env.RELEASE_VERSION || ""
      },
      BranchName: {
        CircleCi: process.env.CIRCLE_BRANCH || "",
        Jenkins: process.env.BRANCH_NAME || ""
      },
      BuildNumber: {
        CircleCi: "",
        Jenkins: process.env.BUILD_NUMBER || ""
      }
    };
    this.computeDerivedParamters();
  }

  computeDerivedParamters() {
    this.parameterMap = Object.assign({}, this.parameterMap, {
      IsRelease: {
        CircleCi:
          this.getParameter("Tag") &&
          this.getParameter("Tag").startsWith(
            this.getParameter("ReleaseTagFormat")
          ),
        Jenkins:
          this.getParameter("Tag") &&
          this.getParameter("Tag").startsWith(
            this.getParameter("ReleaseTagFormat")
          )
      },
      ProjectName: {
        CircleCi: () => {
          const result = `${process.env.CIRCLE_PROJECT_USERNAME || ""}/${process
            .env.CIRCLE_PROJECT_REPONAME || ""}`;
          return result !== "/" ? result : "unknown";
        },
        Jenkins: process.env.JOB_NAME || ""
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
