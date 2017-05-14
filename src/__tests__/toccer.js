var assert = require('assert')
var fs = require('fs')
var path = require('path')
// var utils = require('../lib/utils')
// var toccer = require('../lib')
import toccer from '../'

function readFile (path) {
  return fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n')
}

// describe('flatten', function () {
//   it('works', function () {
//     assert.deepEqual(utils.flatten([]), [])
//     assert.deepEqual(utils.flatten([[1]]), [1])
//     assert.deepEqual(utils.flatten([[1], 2]), [1, 2])
//     assert.deepEqual(utils.flatten([[1], [[2]]]), [1, 2])
//   })
// })

describe('toccerize', function () {
  var src = path.join(__dirname, 'examples')
  var dirs = fs.readdirSync(src).filter(file => fs.statSync(path.join(src, file)).isDirectory())

  dirs.forEach(function (element) {
    var input = readFile(path.join(src, element, 'input.md'))
    var expected = readFile(path.join(src, element, 'expected.md'))
    var tocTemplate = readFile('./toc.mustache')

    var toccerized = toccer.toccerize(input, tocTemplate)

    it('example ' + element + ' works', function () {
      assert.equal(toccerized, expected)
    })

    it('example ' + element + ' is idempotent', function () {
      assert.equal(toccer.toccerize(toccerized, tocTemplate), toccerized)
    })
  })
})
