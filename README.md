# toccer

Tool for adding table of contents to markdown files.

<span id="toc">
* [Installation](#installation)
* [Usage](#usage)
* [This is a header](#this-is-a-header)
* [more header](#more-header)
  * [Limit Level](#limit-level)
</span>


<a class="toccer-anchor" name="installation"></a>
## Installation

To install `toccer` as a CLI tool: `npm install -g toccer`


<a class="toccer-anchor" name="usage"></a>
## Usage

Place this HTML in your markdown

```html
<span id="toc">
* [Installation](#installation)
* [Usage](#usage)
* [This is a header](#this-is-a-header)
* [more header](#more-header)
  * [Limit Level](#limit-level)
</span>
```

Add some level two headers:

```markdown

<a class="toccer-anchor" name="this-is-a-header"></a>
## This is a header

content


<a class="toccer-anchor" name="more-header"></a>
## more header

more content
```

Then, run the command: `toccer path-to-markdown.md`

This will create a TOC in `path-to-markdown.md`!

> Note: Level one headers will not be included in the TOC.


<a class="toccer-anchor" name="limit-level"></a>
### Limit Level

Use the attribute `data-max-level` to limit how deep the TOC goes.

```html
<span id="toc" data-max-level="3">
* [Installation](#installation)
* [Usage](#usage)
* [This is a header](#this-is-a-header)
* [more header](#more-header)
  * [Limit Level](#limit-level)
</span>
```

This will only use up to level 3 headers in the TOC. 
