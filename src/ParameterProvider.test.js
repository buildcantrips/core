/* eslint-env mocha */
import ParameterProvider from "./ParameterProvider"

import { expect } from "chai"

describe("parameterProvider", () => {
  var provider

  it("throws error using in unknown environment", async () => {
    process.env.CIRCLECI = ""
    expect(() => new ParameterProvider())
      .to.throw(Error)
      .that.ownProperty("message")
      .which.includes("Unknown CI")
  })

  describe("core", () => {
    before(() => {
      process.env.CIRCLECI = "CIRCLECI"
      provider = new ParameterProvider()
    })
    describe("getParameter", () => {
      it("throws error on asking for not existing parameter", async () => {
        expect(() => provider.getParameter("notExistingParameter"))
          .to.throw(Error)
          .that.ownProperty("message")
          .which.includes("Unknown parameter")
      })
    })
  })
  describe("environments", () => {
    describe("CircleCI", () => {
      before(() => {
        process.env.CIRCLECI = "CIRCLECI"
        process.env.CIRCLE_BRANCH = "validBranchName"
        process.env.CIRCLE_PROJECT_USERNAME = "validUser"
        process.env.CIRCLE_PROJECT_REPONAME = "validRepoName"
        provider = new ParameterProvider()
      })
      it("resolves variables", async () => {
        expect(await provider.getParameter("BranchName")).to.be.eql(
          "validBranchName"
        )
      })
      it("constructs derived values", async () => {
        expect(await provider.getParameter("ProjectName")).to.be.eql(
          "validUser/validRepoName"
        )
      })
    })
    describe("TeamCity", () => {
      before(() => {
        process.env.CIRCLECI = ""
        process.env.TEAMCITY_VERSION = "2018.1"
        process.env.BUILD_NUMBER = "1234"
        process.env.BRANCH_NAME = "validBranchName"
        process.env.PROJECT_GROUP = "validGroup"
        process.env.PROJECT_NAME = "validRepoName"
        process.env.BUILD_VCS_NUMBER = "1234567890"
        provider = new ParameterProvider()
      })
      it("resolves branch name", async () => {
        expect(await provider.getParameter("BranchName")).to.be.eql(
          "validBranchName"
        )
      })
      it("resolves tag", async () => {
        expect(await provider.getParameter("Tag")).to.be.eql("validBranchName")
      })
      it("resolves build number", async () => {
        expect(await provider.getParameter("BuildNumber")).to.be.eql("1234")
      })
      it("resolves build hash", async () => {
        expect(await provider.getParameter("Hash")).to.be.eql("1234567890")
      })
      it("computes short hash correctly", async () => {
        expect(await provider.getParameter("ShortHash")).to.be.eql("12345678")
      })
      it("determines release mode correctly", async () => {
        process.env.BRANCH_NAME = "release-1.2.3"
        provider = new ParameterProvider()
        expect(await provider.getParameter("IsRelease")).to.be.eql(true)
      })
      it("computes release version correctly", async () => {
        process.env.BRANCH_NAME = "release-1.2.3"
        provider = new ParameterProvider()
        expect(await provider.getParameter("ReleaseVersion")).to.be.eql(
          "1.2.3"
        )
      })
      it("constructs project name correctly", async () => {
        expect(await provider.getParameter("ProjectName")).to.be.eql(
          "validGroup/validRepoName"
        )
      })
    })
  })
})
