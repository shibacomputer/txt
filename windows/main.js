'use strict'

const html = require('yo-yo')
const css = require('sheetify')
const icons = require('../utils/icons')
const button = require('../bits/button')
const FileExplorer = require('../bits/sidebar')
const editor = require('./editor')

const base = css`
  :host {
    display: flex;
    flex-direction: row;
    color: white;
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

module.exports = mainWindow

function mainWindow(state, prev, send) {
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
        ${editor()}
      </main>
    </body>
  `
}
