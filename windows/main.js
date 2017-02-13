'use strict'

const html = require('yo-yo')
const css = require('sheetify')
const icons = require('../utils/icons')

const Toolbar = require('../bits/toolbar')
const FileExplorer = require('../bits/sidebar')

const base = css`
  :host {
    display: flex;
    flex-direction: row;
    color: white;
    background-color: #242529;
  }
`

const editorWindow = css`
  :host {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
`

module.exports = mainWindow

function mainWindow(state, prev, send) {
  document.title = 'Text'

  const toolbar = Toolbar({})
  const sidebar = FileExplorer({})

  return html`
    <body class="b-myc ${base}">
      ${icons()}
      ${sidebar}
      <main class="${editorWindow}">
        ${toolbar}
      </main>
    </body>
  `
}
