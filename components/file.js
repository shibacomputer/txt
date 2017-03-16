'use strict'

const html = require('choo/html')
const css = require('yo-css')
const files = require('../utils/files')

module.exports = (props, click) => {

  var active = false

  return html`
    <button onclick=${props.click} name=${props.name}>
      ${props.filename}
    </button>
  `
}
