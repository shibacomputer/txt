const html = require('choo/html')
const style = require('./style')

module.exports = noteTitle

function noteTitle (title) {
  title = typeof title === "string" ? title : 'Untitled'
  return html`
    <header class="${style}">
      <svg>
        <use xlink:href="#txt-file" />
      </svg>
      <h1>
        ${ title }
      </h1>
    </header>
  `
}
