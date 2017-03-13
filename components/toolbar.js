'use strict'

const html = require('yo-yo')
const css = require('sheetify')
const button = require('./button')

const base = css`
  :host {
    flex: 0 2.5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background-color: rgba(0,0,0,0.1);
    padding: 0 0.5rem;
    font-size: 12px;
  }
`

module.exports = (props) => {
  return html`
    <header class="${base}">
      <nav class="left">
        ${props.left}
      </nav>

      <nav class="mid">
        ${props.mid}
      </nav>

      <nav class="right">
        ${props.right}
      </nav>
    </header>
  `
}
