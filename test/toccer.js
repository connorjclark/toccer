var assert = require('assert')
var fs = require('fs')
var path = require('path')
var utils = require('../lib/utils')
var toccer = require('../')

function readFile (path) {
  return fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n')
}

describe('flatten', function () {
  it('works', function () {
    assert.deepEqual(utils.flatten([]), [])
    assert.deepEqual(utils.flatten([[1]]), [1])
    assert.deepEqual(utils.flatten([[1], 2]), [1, 2])
    assert.deepEqual(utils.flatten([[1], [[2]]]), [1, 2])
  })
})

describe('removeToccerAnchors', function () {
  var markdown = '<a class="toccer-anchor"></a>Blah'

  it('works', function () {
    assert.equal(utils.removeToccerAnchors(''), '')
    assert.equal(utils.removeToccerAnchors(markdown), 'Blah')
  })
})

describe('removeExtraneousNewlines', function () {
  var input = readFile('./test/snippets/removeExtraneousNewlines-input.md', 'utf8')
  var expected = readFile('./test/snippets/removeExtraneousNewlines-expected.md', 'utf8')

  it('works', function () {
    assert.equal(utils.removeExtraneousNewlines(''), '')
    assert.equal(utils.removeExtraneousNewlines(input), expected)
  })
})

describe('toccerize', function () {
  var src = path.join('test', 'examples')
  var dirs = fs.readdirSync(src).filter(file => fs.statSync(path.join(src, file)).isDirectory())

  dirs.forEach(function (element) {
    it('example ' + element + ' works', function () {
      var input = readFile(path.join(src, element, 'input.md'))
      var expected = readFile(path.join(src, element, 'expected.md'))
      var tocTemplate = readFile('./toc.mustache')

      assert.equal(toccer.toccerize(input, tocTemplate), expected)
    })
  })
})
