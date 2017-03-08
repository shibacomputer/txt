'use strict'

const html = require('yo-yo')
const css = require('sheetify')
const icons = require('../utils/icons')
const button = require('../bits/button')
const FileExplorer = require('../bits/sidebar')
const fileManager = require('../utils//fileio')
const editor = require('./editor')

module.exports = mainWindow

const base = css`
  :host {
    display: flex;
    flex-direction: row;
    color: var(--w);
    background-color: var(--k);
  }
`

const editorWindow = css`
  :host {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
`

const editContainer = css`
  :host {
    height: calc(100vh - 2px - 2.5rem);
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }
`

function mainWindow(state, prev, send) {
  fileManager.readFile('file.txt')
  document.title = 'Text'
  const editingTools = html`
    <div class="tools">
      ${button({
        name: 'new',
        classes: 'c',
        click: function() { console.log('hello')}
      })}
    </div>
  `
  const sidebar = FileExplorer({})
  return html`
    <body class="b-myc ${base}">
      ${icons()}
      ${sidebar}
      <main class="${editorWindow}">
        <header class="toolbar">
          <nav class="left">
          </nav>
          <nav class="mid">
          </nav>
          <nav class="right">
            ${button({
              icon: 'new',
              classes: 'c',
              click: function() { console.log('hi')}
            })}
          </nav>
        </header>
        <div class="${editContainer}">
          ${editor()}
        </div>
      </main>
    </body>
  `
}
