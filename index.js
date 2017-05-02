var fs = require('fs')
var Mustache = require('mustache')
var expand = require('glob-expand')
var marked = require('marked')
var toMarkdown = require('to-markdown')

var utils = require('./lib/utils')

var isCLI = require.main === module

function toccerize (markdown, tocTemplate) {
  var tokens = marked.lexer(markdown)

  var tocTokenIndex
  var tocOptions

  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i]

    if (token.type === 'paragraph') {
      var match = token.text.match(/\[\]\((toc.*)\)/)
      if (match) {
        tocOptions = match[1].split(/\s+/).reduce(function (acc, option) {
          var keyValuePair = option.split('=')
          acc[keyValuePair[0]] = keyValuePair[1] || true
          return acc
        }, {})
        tocTokenIndex = i
        break
      }
    }
  }

  // remove existing TOC
  if (tocTokenIndex && tokens[tocTokenIndex + 1].type === 'list_start') {
    var matchingEnd = utils.findIndexOfMatchingListEnd(tokens, tocTokenIndex + 1)
    tokens.splice(tocTokenIndex + 1, matchingEnd - tocTokenIndex)
  }

  var maxLevel = tocOptions['max-level'] ? parseInt(tocOptions['max-level']) : 100
  var sections = utils.findSections(tokens, maxLevel)

  var tocMarkdown = Mustache.render(tocTemplate, {sections})
  var tocTokens = marked.lexer(tocMarkdown)

  tokens.splice.apply(tokens, [tocTokenIndex + 1, 0].concat(tocTokens))

  var html = marked.parser(tokens)
  html = html.replace(/\n<\/code><\/pre>/g, '</code></pre>')

  return toMarkdown(html) + '\n'
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
