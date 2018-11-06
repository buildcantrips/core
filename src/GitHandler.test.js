/* eslint-env jest */

import GitHandler from '../src/GitHandler'

import path from 'path'
import { expect } from 'chai'
import childProcess from 'child_process'
import fs from 'fs'
import osTmpdir from 'os-tmpdir'

let tempDir = path.join(osTmpdir(), 'cantrips_test_dir')

GitHandler.repoLocation = tempDir

function recreateGitRepository () {
  if (fs.existsSync(tempDir)) {
    deleteFolderRecursive(tempDir)
  }
  fs.mkdirSync(tempDir)
  childProcess.execSync(`cd ${tempDir} && git init &&
    git config user.email "test@example.com" &&
    git config user.name "Test User" &&
    git checkout -b workbranch &&
    git commit --allow-empty -m "test"`)
}

describe('GitHandler', () => {
  afterAll(() => {
    if (fs.existsSync(tempDir)) {
      deleteFolderRecursive(tempDir)
    }
  })
  beforeEach(() => {
    recreateGitRepository()
  })

  describe('status', async () => {
    it('should give back the uncommited changes', async () => {
      fs.writeFileSync(path.join(tempDir, 'new.file'), 'testdatastring')
      expect(await GitHandler.status()).to.be.eql(['new.file'])
    })
    it('should give back empty array if there are no uncommited changes', async () => {
      expect(await GitHandler.status()).to.be.eql([])
    })
  })

  describe('currentBranch', async () => {
    it('gives back the current branch name', async () => {
      expect(await GitHandler.getCurrentBranch()).to.be.equal('workbranch')
    })
  })
})

var deleteFolderRecursive = function (path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file) {
      var curPath = path + '/' + file
      if (fs.statSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath)
      } else { // delete file
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(path)
  }
}
