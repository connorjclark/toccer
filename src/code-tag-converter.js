export default {
  filter: node => node.nodeName === 'PRE' && node.firstChild.nodeName === 'CODE',
  replacement: (content, node) => {
    const lang = node.firstChild.className.replace('lang-', '')
    return '```' + `${lang}\n${node.firstChild.textContent}\n` + '```\n\n'
  }
}
