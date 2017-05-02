var fs = require('fs')
var Mustache = require('mustache')
var expand = require('glob-expand')

var utils = require('./lib/utils')

var isCLI = require.main === module

function matchTocCrap (markdown) {
  var match = markdown.match(/([\s\S]*)(<!-- toc[\s\S]* start [\s\S]*-->)([.\s\n]*)(<!-- toc end -->)([\s\S]*)/)
  var beforeToc = match[1]
  var tocHeader = match[2]
  var insideToc = match[3]
  var tocFooter = match[4]
  var afterToc = match[5]

  return {beforeToc, tocHeader, insideToc, tocFooter, afterToc}
}

function toccerize (markdown, tocTemplate) {
  markdown = utils.removeToccerAnchors(markdown)

  // the TOC was inside a span HTML element, but github's markdown renderer ignores stuff inside HTML elements ...
  // So I came up with this
  // <!-- toc start max-level=2 -->
  // <!-- toc end -->

  // remove contents of old table, get attributes
  // :'(
  var tocCrap = matchTocCrap(markdown)

  var maxLevelMatch = tocCrap.tocHeader.match(/max-level=(\d+)/)
  var maxLevel = maxLevelMatch ? maxLevelMatch[1] : 100

  // TODO: refactor this.
  var findSectionsResult = utils.findSections(markdown, maxLevel)
  var sections = findSectionsResult.sections
  var outputLines = findSectionsResult.outputLines

  var tocMarkdown = Mustache.render(tocTemplate, {sections})

  var tocCrap2 = matchTocCrap(outputLines.join('\n'))

  return tocCrap2.beforeToc + tocCrap2.tocHeader + '\n\n' + tocMarkdown + tocCrap2.tocFooter + tocCrap2.afterToc
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
