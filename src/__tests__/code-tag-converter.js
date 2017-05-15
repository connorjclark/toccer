import codeTagConverter from '../code-tag-converter'
import toMarkdown from 'to-markdown'

describe('codeTagConverter', function () {
  const htmlWithoutLang = `<pre><code>console.log(1)</code></pre>`
  const htmlWithLang = `<pre><code class="lang-js">console.log(1)</code></pre>`

  const convert = html => toMarkdown(html, {converters: [codeTagConverter]})

  it('works without lang', function () {
    expect(convert(htmlWithoutLang)).toMatchSnapshot()
  })

  it('works with lang', function () {
    expect(convert(htmlWithLang)).toMatchSnapshot()
  })
})
