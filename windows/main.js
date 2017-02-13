'use strict'

const html = require('yo-yo')
const css = require('sheetify')

const Toolbar = require('../bits/toolbar.js')
const FileExplorer = require('../bits/sidebar.js')
const base = css`
  :host {
    display: flex;
    flex-direction: row;
    color: white;
    background-color: #242529;
  }
`

module.exports = mainWindow

function mainWindow(state, prev, send) {
  document.title = 'Text'
  const toolbar = Toolbar({})
  const sidebar = FileExplorer({})

  return html`
    <body class="b-myc ${base}">
      ${sidebar}
      <main>
        ${toolbar}
      </main>
    </body>
  `
}
