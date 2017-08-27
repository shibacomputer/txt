const html = require('choo/html')
const style = require('./style')

module.exports = noteTitle

function noteTitle (title, parentPath, modified) {
  title = typeof title === "string" ? title : 'Untitled'
  return html`
    <header class="${style} ${modified? 'modified' : 'unmodified'}">
      <svg>
        <use xlink:href="#txt-file" />
      </svg>
      <h1>
        ${ title }
      </h1>
    </header>
  `
}
