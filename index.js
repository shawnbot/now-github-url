const qs = require('querystring')
const octokit = require('@octokit/rest')
const url = require('url')
const {getBranch, getSHA, getRepo} = require('./git')
const nowFetch = require('now-fetch')()

const NOW_CONTEXT = 'deployment/now'

module.exports = function getNowURL(options = {}) {
  const {
    dir,
    ref,
    githubToken
  } = options

  const github = octokit()

  if (githubToken) {
    github.authenticate({
      type: 'token',
      token: githubToken
    })
  }

  const getRef = {
    branch: getBranch(),
    commit: getSHA()
  }[ref] || Promise.resolve(ref)

  return Promise.all([getRef, getRepo()])
    .then(([ref, {owner, repo}]) => {
      console.warn(`getting statuses for: https://github.com/${owner}/${repo}/tree/${ref} ...`)
      return github.repos.getStatuses({ref, owner, repo})
    })
    .then(res => {
      const statuses = res.data
      if (statuses.length === 0) {
        console.warn('No statuses found')
        return undefined
      }
      console.warn('got %d statuses...', statuses.length)
      const matches = statuses.filter(status => status.context === NOW_CONTEXT)
      if (matches.length) {
        const nowStatus = matches[0]
        const targetUrl = nowStatus.target_url
        const {deploymentId} = qs.parse(url.parse(targetUrl).query)
        return nowFetch(`/v2/now/deployments/${deploymentId}`)
          .then(deployment => `https://${deployment.host}`)
      } else {
        console.warn('no matching statuses in:', statuses.map(d => d.context).join(', '))
        return undefined
      }
    })
}
