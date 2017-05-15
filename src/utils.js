const flatten = list => list.reduce(
  (acc, value) => acc.concat(Array.isArray(value) ? flatten(value) : value),
  []
)

const findSections = (tokens, maxLevel) => {
  const sections = []

  for (const token of tokens) {
    if (token.type === 'heading') {
      const headerLevel = token.depth
      const headerText = token.text.trim()
      const headerId = headerText.replace(/([\s_/\\])+/g, '-').toLowerCase()

      if (headerLevel >= 2 && headerLevel <= maxLevel) {
        sections.push({
          text: headerText,
          level: headerLevel,
          levels: Array(headerLevel - 2).fill('*'),
          id: headerId
        })
      }
    }
  }

  return sections
}

const findIndexOfMatchingListEnd = (tokens, startIndex) => {
  let listDepth = 1

  for (let i = startIndex + 1; i < tokens.length; i++) {
    if (tokens[i].type === 'list_start') {
      listDepth += 1
    } else if (tokens[i].type === 'list_end') {
      listDepth -= 1
    }

    if (listDepth === 0) {
      return i
    }
  }

  throw new Error('Could not find matching list_end')
}

export default {flatten, findIndexOfMatchingListEnd, findSections}
