# toccer

Tool for adding table of contents to markdown files.

[](toc)

*   [Installation](#installation)
*   [Usage](#usage)
    *   [Limit Level](#limit-level)

## Installation

To install `toccer` as a CLI tool: `npm install -g toccer`

## Usage

Place link token somewhere in your markdown

```markdown
[](toc)
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

### Limit Level

Use the option `max-level` to limit how deep the TOC goes.

```markdown
[](toc max-level=3)
```

This will only use up to level 3 headers in the TOC.
