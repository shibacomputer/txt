const html = require('choo/html')
const style = require('./style')
const remote = window.require('electron').remote
const { shell } = remote.require('electron')

module.exports = noteTitle

function noteTitle (title, parentPath, modified) {
  title = typeof title === "string" ? title : 'Untitled'
  return html`
    <header class="${style} ${modified? 'modified' : 'unmodified'}" oncontextmenu=${ showfile }>
      <svg>
        <use xlink:href="#txt-file" />
      </svg>
      <h1>
        ${ title }
      </h1>
    </header>
  `

  function showfile() {
    shell.showItemInFolder(parentPath)
  }
}
