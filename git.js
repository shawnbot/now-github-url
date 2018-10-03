const parseRepo = require('github-repo-from-config')
const execa = require('execa')
const fse = require('fs-extra')
const {resolve} = require('path')

function getBranch(execOptions = {}) {
  return execa('git', ['symbolic-ref', '--short', 'HEAD'], execOptions)
    .then(proc => proc.stdout)
}

function getSHA(execOptions = {}) {
  return execa('git', ['rev-parse', 'HEAD'], execOptions)
    .then(proc => proc.stdout)
}

function getRepo(execOptions = {}) {
  const {cwd = '.'} = execOptions
  const gitConfigPath = resolve(cwd, '.git/config')
  return fse.readFile(gitConfigPath).then(parseRepo)
    .then(({account, repo}) => ({owner: account, repo}))
}

module.exports = {
  getBranch,
  getSHA,
  getRepo
}
