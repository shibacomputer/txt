'use strict'

const html = require('yo-yo')
const css = require('sheetify')

const base = css`
  width: 1rem;
  height: 1rem;
  display: inline-block;
`

module.exports = (props, click) => {
  if (typeof click === 'function') props.click = click

  return html`
  <button onclick=${props.click} class="${base} pointer">
    
  </button>
`

}
