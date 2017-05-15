#! /usr/bin/env node

import fs from 'fs'
import expand from 'glob-expand'
import toccer from './'
import utils from './utils'

const filePaths = utils.flatten(
  process.argv.slice(2).map(arg => expand(arg, '!node_modules/**/*.*'))
)

for (const filePath of filePaths) {
  const input = fs.readFileSync(filePath, 'utf8')
  const output = toccer(input)
  fs.writeFileSync(filePath, output)
}
