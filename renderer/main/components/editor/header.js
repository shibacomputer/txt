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
        left: [
          button({
            name:'ShowLibrary',
            classes: 'c',
            icon: 'library',
            click: function() {
              emit('state:library:toggle')
            }
          })
        ],
        center: `${state.composer.name? state.composer.name : ``}${state.status.modified? `*`:``}`,
        right: [
          button({
            name: 'history',
            classes: 'c',
            icon: 'history',
            click: function() {
            }
          })
        ]
      })
    }
    </header>
  `
}
