'use strict'

const html = require('bel')
const css = require('sheetify')

const base = css`
  :host {
    height: 100vh;
    background-color: var(--k)
    display: flex;
    flex-direction: column;
    -webkit-app-region: drag;
  }
`
module.exports = function mainWindow(state, prev, send) {
  document.title = 'Text'
  return html`
    <body>
    </body>
  `
}
