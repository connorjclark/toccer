# toccer

Tool for adding table of contents to markdown files.

<!-- toc start -->

* [Installation](#installation)
* [Usage](#usage)
* [Limit Level](#limit-level)
<!-- toc end -->


<a class="toccer-anchor" name="installation"></a>
## Installation

To install `toccer` as a CLI tool: `npm install -g toccer`


<a class="toccer-anchor" name="usage"></a>
## Usage

Place this HTML in your markdown

```html
<!-- toc start -->
<!-- toc end -->
```

Add some level two headers:

```markdown
## This is a header

content

## more header

more content
```

Then, run the command: `toccer path-to-markdown.md`

This will create a TOC in `path-to-markdown.md`!

> Note: Level one headers will not be included in the TOC.


<a class="toccer-anchor" name="limit-level"></a>
### Limit Level

Use the attribute `max-level` to limit how deep the TOC goes.

```html
<!-- toc start max-level=3 -->
<!-- toc end -->
```

This will only use up to level 3 headers in the TOC. 
