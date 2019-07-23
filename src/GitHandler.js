import simpleGit from "simple-git"
var map = Array.prototype.map

class GitHandler {
  repoLocation = __dirname

  status = () => {
    let result = null
    return new Promise((resolve, reject) => {
      simpleGit(this.repoLocation).status(function(err, status) {
        if (err != null) {
          reject(err)
        }
        result = map.call(status["files"], function(file) {
          return file["path"]
        })
        resolve(result)
      })
    })
  }

  getCurrentBranch = () => {
    return new Promise(resolve => {
      simpleGit(this.repoLocation).branch(function(err, summary) {
        if (err != null) {
          throw err
        }
        resolve(summary["current"])
      })
    })
  }
}

export default new GitHandler()
