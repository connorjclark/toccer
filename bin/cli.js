#! /usr/bin/env node

var fs = require('fs')
var expand = require('glob-expand')
var toccer = require('../')
var utils = require('../lib/utils')
var path = require('path')

var args = utils.flatten(process.argv.slice(2).map(function (arg) {
  return expand(arg, '!node_modules/**/*.*')
}))

var defaultTocTemplate = fs.readFileSync(path.join(__dirname, '..', 'toc.mustache'), 'utf8')

args.forEach(function (fileName) {
  var input = fs.readFileSync(fileName, 'utf8')
  var output = toccer.toccerize(input, defaultTocTemplate)

  fs.writeFileSync(fileName, output)
})
