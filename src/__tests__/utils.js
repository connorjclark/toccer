import utils from '../utils'

describe('flatten', function () {
  it('works', function () {
    expect(utils.flatten([])).toEqual([])
    expect(utils.flatten([[1]])).toEqual([1])
    expect(utils.flatten([[1], 2])).toEqual([1, 2])
    expect(utils.flatten([[1], [[2]]])).toEqual([1, 2])
  })
})
