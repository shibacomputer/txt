'use strict'

const html = require('yo-yo')
const css = require('sheetify')

const header = css`
  :host {
    flex: 0 2.5rem;
    width: 100%;
    background-color: rgba(0,0,0,0.1);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    color: var(--c);
    padding: 0 1rem;
  }
`

module.exports = (props) => {
  return html`
    <header class="${header}">
     I am a header
    </header>
  `
}
