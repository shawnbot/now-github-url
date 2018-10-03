#!/usr/bin/env node
const yargs = require('yargs')
const getNowURL = require('.')
const argv = yargs.argv
const [cwd = process.cwd(), ref = 'commit'] = argv._
const options = Object.assign({
  githubToken: process.env.GH_TOKEN
}, argv, {cwd, ref})

getNowURL(options)
  .then(url => console.log(url))
  .catch(error => {
    console.error(error)
    process.exitCode = 1
  })
