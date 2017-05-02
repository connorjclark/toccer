var fs = require('fs')
var Mustache = require('mustache')
var cheerio = require('cheerio')
var expand = require('glob-expand')

var utils = require('./lib/utils')

var isCLI = require.main === module

function toccerize (markdown, tocTemplate) {
  markdown = utils.removeToccerAnchors(markdown)

  var maxLevel = parseInt(cheerio.load(markdown)('span#toc').data('max-level')) || 100

  // TODO: refactor this.
  var findSectionsResult = utils.findSections(markdown, maxLevel)
  var sections = findSectionsResult.sections
  var outputLines = findSectionsResult.outputLines

  var tocMarkdown = Mustache.render(tocTemplate, {sections})

  var $ = cheerio.load(outputLines.join('\n'), {
    decodeEntities: false
  })
  $('span#toc').text('\n' + tocMarkdown)
  return $.html()
}

if (isCLI) {
  var args = utils.flatten(process.argv.slice(2).map(function (arg) {
    return expand(arg, '!node_modules/**/*.*')
  }))

  var defaultTocTemplate = fs.readFileSync('toc.mustache', 'utf8')

  args.forEach(function (fileName) {
    var input = fs.readFileSync(fileName, 'utf8')
    var output = toccerize(input, defaultTocTemplate)

    fs.writeFileSync(fileName, output)
  })
} else {
  module.exports = {toccerize}
}
