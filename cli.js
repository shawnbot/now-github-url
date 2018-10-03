#!/usr/bin/env node
const yargs = require('yargs')
const getNowURL = require('.')
const argv = yargs.argv
const [dir = process.cwd(), ref = 'commit'] = argv._
const options = Object.assign({}, argv, {dir, ref})

getNowURL(options)
  .then(url => console.log(url))
  .catch(error => {
    console.error(`Error: ${error.message}`)
    process.exitCode = 1
  })
