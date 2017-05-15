import codeTagConverter from '../code-tag-converter'
import toMarkdown from 'to-markdown'

describe('codeTagConverter', function () {
  const htmlWithoutLang = `<pre><code>console.log(1)</code></pre>`
  const htmlWithLang = `<pre><code class="lang-js">console.log(1)</code></pre>`

  it('works without lang', function () {
    expect(toMarkdown(htmlWithoutLang, {converters: [codeTagConverter]})).toMatchSnapshot()
  })

  it('works with lang', function () {
    expect(toMarkdown(htmlWithLang, {converters: [codeTagConverter]})).toMatchSnapshot()
  })
})
