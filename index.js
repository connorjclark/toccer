#! /usr/bin/env node

var Mustache = require('mustache')
var marked = require('marked')
var toMarkdown = require('to-markdown')
var utils = require('./lib/utils')
var querystring = require('querystring')

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

        tocOptions = querystring.parse(match[1])

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

  return toMarkdown(html, {converters: [testConverter]}) + '\n'
}

var testConverter = {
  filter: function (node) {
    return node.nodeName === 'PRE' && node.firstChild.nodeName === 'CODE'
  },
  replacement: function (content, node) {
    var lang = node.firstChild.className.replace('lang-', '')
    return '```' + lang + '\n' + node.firstChild.textContent + '\n```\n\n'
  }
}

module.exports = {toccerize}
