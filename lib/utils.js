'use strict';

function flatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}

function findSections(tokens, maxLevel) {
  var sections = [];

  tokens.forEach(function (token) {
    if (token.type === 'heading') {
      var headerLevel = token.depth;
      var headerText = token.text.trim();
      var headerId = headerText.replace(/([\s_/\\])+/g, '-').toLowerCase();

      if (headerLevel >= 2 && headerLevel <= maxLevel) {
        sections.push({
          text: headerText,
          level: headerLevel,
          levels: Array(headerLevel - 2).fill('*'),
          id: headerId
        });
      }
    }
  });

  return sections;
}

function findIndexOfMatchingListEnd(tokens, startIndex) {
  var listDepth = 1;

  for (var i = startIndex + 1; i < tokens.length; i++) {
    if (tokens[i].type === 'list_start') {
      listDepth += 1;
    } else if (tokens[i].type === 'list_end') {
      listDepth -= 1;
    }

    if (listDepth === 0) {
      return i;
    }
  }

  throw new Error('Could not find matching list_end');
}

module.exports = { flatten: flatten, findIndexOfMatchingListEnd: findIndexOfMatchingListEnd, findSections: findSections };