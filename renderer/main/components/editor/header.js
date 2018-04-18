const html = require('choo/html')
const style = require('./style')

const toolbar = require('../../../_components/toolbar')
const button = require('../../../_components/button')

module.exports = editorHeader

function editorHeader(state, emit) {
  return html`
    <header class=${ style.header }>
      ${
        toolbar({
        center: state.composer.title,
        right: [
          button({
            name: 'new',
            classes: 'c',
            icon: 'new',
            click: function() {
              emit('state:composer:new')
            }
          })
        ]
      })
    }
    </header>
  `
}
