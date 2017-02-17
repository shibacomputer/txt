'use strict'

const choo = require('choo')
const html = require('yo-yo')
const css = require('sheetify')

const base = css`
  :host {
    width: 100vh;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
  }
`

return html`
  <div class={$base}>
    Hello
  </div>
`
