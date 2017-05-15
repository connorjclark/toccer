import utils from '../utils'

const TOKEN = (type, props = {}) => Object.assign({type}, props)
const START = TOKEN('list_start')
const END = TOKEN('list_end')
const OTHER = TOKEN('OTHER')
const HEADER = (depth, text) => TOKEN('heading', {depth, text})

describe('flatten', function () {
  it('works', function () {
    const test = (input, expected) => expect(utils.flatten(input)).toEqual(expected)

    test(
      [],
      []
    )

    test(
      [[1]],
      [1]
    )

    test(
      [[1], 2],
      [1, 2]
    )

    test(
      [[1], [[2]]],
      [1, 2]
    )
  })
})

// kind of a bad test ;(
describe('findSections', function () {
  it('basic', function () {
    /* eslint-disable */
    const tokens = [
      HEADER(5, 'hello world'),
      OTHER
    ]
    /* eslint-enable */

    expect(utils.findSections(tokens, 100)).toEqual([{
      text: 'hello world',
      level: 5,
      levels: ['*', '*', '*'],
      id: 'hello-world'
    }])
  })

  it('respects max level', function () {
    /* eslint-disable */
    const tokens = [
      HEADER(4, 'hello world'),
      HEADER(5, 'ignore me'),
      OTHER
    ]
    /* eslint-enable */

    expect(utils.findSections(tokens, 4)).toEqual([{
      text: 'hello world',
      level: 4,
      levels: ['*', '*'],
      id: 'hello-world'
    }])
  })
})

describe('findIndexOfMatchingListEnd', function () {
  it('basic', function () {
    /* eslint-disable */
    const tokens = [
      START,
        OTHER,
      END
    ]
    /* eslint-enable */

    expect(utils.findIndexOfMatchingListEnd(tokens, 0)).toEqual(2)
  })

  it('nested', function () {
    /* eslint-disable */
    const tokens = [
      START,
        OTHER,
        START,
          OTHER,
        END,
      END
    ]
    /* eslint-enable */

    expect(utils.findIndexOfMatchingListEnd(tokens, 0)).toEqual(5)
    expect(utils.findIndexOfMatchingListEnd(tokens, 2)).toEqual(4)
  })

  it('consecutive', function () {
    /* eslint-disable */
    const tokens = [
      START,
        OTHER,
      END,
      OTHER,
      START,
        OTHER,
      END
    ]
    /* eslint-enable */

    expect(utils.findIndexOfMatchingListEnd(tokens, 0)).toEqual(2)
    expect(utils.findIndexOfMatchingListEnd(tokens, 4)).toEqual(6)
  })

  it('throws error on invalid input', function () {
    /* eslint-disable */
    const tokens = [
      START,
        OTHER,
      END,
      START,
        OTHER
    ]
    /* eslint-enable */

    // throw b/c of invalid START
    expect(() => utils.findIndexOfMatchingListEnd(tokens, 1)).toThrow()

    // throw b/c of no matching END token
    expect(() => utils.findIndexOfMatchingListEnd(tokens, 3)).toThrow()
  })
})
