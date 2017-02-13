'use strict'

const html = require('yo-yo')
const css = require('sheetify')
const explorer = require('fs-explorer')
const Header = require('./toolbar')

const base = css`
  :host {
    width: 25vw;
    min-width: 214px;
    height: calc(100vh - 2px);
    border-radius: 5px;
    border-right: 1px solid rgba(255, 255, 255, 0.05);
    background-color: #27282B;
    display: flex;
    flex-direction: column;
  }
`

const content = css`
  :host {
    width: 100%;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    background-color: #27282B;
    border-radius: 5px;
  }
`

const header = Header({})

module.exports = (props) => {
  return html`
    <aside class="${base}">
      ${header}
      <nav class="${content}">
      </nav>
    </aside>
  `
}
