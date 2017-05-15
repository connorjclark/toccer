import toccer from '../'
import fs from 'fs'
import path from 'path'

const readFile = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n')

describe('toccer', function () {
  var src = path.join(__dirname, 'examples')
  var files = fs.readdirSync(src).filter(file => fs.statSync(path.join(src, file)).isFile())

  files.forEach(function (file) {
    var input = readFile(path.join(src, file))
    var tocTemplate = readFile('./toc.mustache')

    var toccerized = toccer(input, tocTemplate)

    it(`example ${file} works`, function () {
      expect(toccerized).toMatchSnapshot()
    })

    it(`example ${file} is idempotent`, function () {
      expect(toccer(toccerized, tocTemplate)).toEqual(toccerized)
    })
  })
})
