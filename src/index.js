#! /usr/bin/env node

import Mustache from 'mustache'
import marked from 'marked'
import toMarkdown from 'to-markdown'
import utils from './utils'
import querystring from 'querystring'
import codeTagConverter from './code-tag-converter'

const toccerize = (markdown, tocTemplate) => {
  let tokens = marked.lexer(markdown)

  let tocTokenIndex
  let tocOptions

  for (const [index, token] of tokens.entries()) {
    if (token.type !== 'paragraph') {
      continue
    }

    const match = token.text.match(/\[\]\((toc.*)\)/)
    if (match) {
      tocOptions = match[1].split(/\s+/).reduce(function (acc, option) {
        let keyValuePair = option.split('=')
        acc[keyValuePair[0]] = keyValuePair[1] || true
        return acc
      }, {})

      tocOptions = querystring.parse(match[1])

      tocTokenIndex = index
      break
    }
  }

  // remove existing TOC
  if (tocTokenIndex && tokens[tocTokenIndex + 1].type === 'list_start') {
    const matchingEnd = utils.findIndexOfMatchingListEnd(tokens, tocTokenIndex + 1)
    tokens.splice(tocTokenIndex + 1, matchingEnd - tocTokenIndex)
  }

  const maxLevel = tocOptions['max-level'] ? parseInt(tocOptions['max-level']) : 100
  const sections = utils.findSections(tokens, maxLevel)

  const tocMarkdown = Mustache.render(tocTemplate, {sections})
  const tocTokens = marked.lexer(tocMarkdown)

  tokens.splice.apply(tokens, [tocTokenIndex + 1, 0].concat(tocTokens))

  const html = marked.parser(tokens).replace(/\n<\/code><\/pre>/g, '</code></pre>')
  console.log(html)
  return toMarkdown(html, {converters: [codeTagConverter]}) + '\n'
}

export default toccerize
