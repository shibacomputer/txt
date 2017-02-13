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
    background-color: rgba(0,0,0,0.1);
    padding: 0 1rem;
  }
`

module.exports = (props) => {
  return html`
    <header class="${base}">
      <nav>
        ${button({
          icon: 'new'
        })}

      </nav>
    </header>
  `
}
