'use strict'

const html = require('choo/html')
const css = require('sheetify')
const icons = require('../utils/icons')
const button = require('../components/button')
const FileExplorer = require('../components/sidebar')
const files = require('../utils/files')
const folders = require('../utils/folders')
const editor = require('../components/editor')

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
  files.open('file.txt')
  folders.ls('.')
  folders.mk('test2')
  folders.rm('test3')
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
