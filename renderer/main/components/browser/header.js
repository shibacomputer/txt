const html = require('choo/html')
const style = require('./style')

const toolbar = require('../../../_components/toolbar')
const button = require('../../../_components/button')

module.exports = editorHeader

function editorHeader(state, emit) {
  return html`
    <header class=${ style.header }>
      ${ toolbar({ right: 'Library' }) }
    </header>
  `
}
