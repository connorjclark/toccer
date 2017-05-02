var cheerio = require('cheerio')

function flatten (arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten)
  }, [])
}

function removeToccerAnchors (markdown) {
  var $ = cheerio.load(markdown, {
    decodeEntities: false
  })

  $('a.toccer-anchor').remove()

  return $.html()
}

// remove consecutive newlines preceding headers
function removeExtraneousNewlines (markdown) {
  return markdown.replace(/\n*(\n\n\s*#+)/g, '$1')
}

function findSections (markdown, maxLevel) {
  var sections = []

  var outputLines = flatten(markdown.split('\n').map(function (line) {
    var resultingLines = [line]

    var trimmedLine = line.trim()

    if (trimmedLine.startsWith('#')) {
      var match = trimmedLine.match(/(#+)(.*)/)
      var headerLevel = match[1].length
      var headerText = match[2].trim()
      var headerId = headerText.replace(/([\s_/\\])+/g, '-').toLowerCase()

      if (headerLevel >= 2 && headerLevel <= maxLevel) {
        resultingLines.unshift(`<a class="toccer-anchor" name="${headerId}"></a>`)
        sections.push({
          text: headerText,
          level: headerLevel,
          levels: Array(headerLevel - 2).fill('*'),
          id: headerId
        })
      }
    }

    return resultingLines
  }))

  return {outputLines, sections}
}

module.exports = {flatten, removeToccerAnchors, removeExtraneousNewlines, findSections}
