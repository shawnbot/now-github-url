#!/usr/bin/env node
const yargs = require('yargs')
const getNowURL = require('.')
const argv = yargs.argv
const [cwd = process.cwd()] = argv._
const options = Object.assign({
  ref: 'sha',
  githubToken: process.env.GH_TOKEN
}, argv, {cwd})

getNowURL(options)
  .then(url => console.log(url))
  .catch(error => {
    console.error(error)
    process.exitCode = 1
  })
