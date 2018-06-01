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
            classes: `${ !state.sidebar.visible && !state.status.fullscreen? style.darwinMargin : '' }`,
            icon: 'library',
            click: function() {
              emit('state:library:toggle')
            }
          })
        ],
        center: `${state.composer.name? state.composer.name : ``}${state.status.modified? `*`:``}`,
        right: state.composer.uri? [
          button({
            name: 'history',
            classes: 'c',
            icon: 'history',
            click: function() {
            }
          })
        ] : ''
      })
    }
    </header>
  `
}
