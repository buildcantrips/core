/* eslint-env mocha */

import { expect } from "chai"
import { runCommandSync } from "./ProcessUtils"

describe("processUtils", () => {
  describe("runCommandSync", async () => {
    it("returns the result of the command which was run", async () => {
      expect(runCommandSync("echo 'test string'")).to.equal(
        "test string\n"
      )
    })
    it("returns empty string if the result is empty", async () => {
      expect(runCommandSync("ls -la >> /tmp/testfile")).to.equal(
        ""
      )
    })
    it("throws error if the command fails", async () => {
      expect(() => runCommandSync("invalid command")).to.throw(
        /Command failed: invalid command.*/
      )
    })
  })
})
