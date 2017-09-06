// Setup SVGs
const fs = window.require('fs')

module.exports = icons

function icons() {
  const svgSheet = fs.readFileSync('icons.svg', 'utf8')
  const _el = document.createElement('div')
  _el.innerHTML = svgSheet
  return _el.childNodes[0]
}
