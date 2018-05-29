const html = require('choo/html')
const style = require('./style')

const toolbar = require('../../../_components/toolbar')
const button = require('../../../_components/button')

module.exports = editorFooter

function editorFooter(state, emit) {
  return html`
    <footer class=${ style.footer }>
      ${
        toolbar({
          left: [
            !state.sidebar.visible? button({
              name: 'lock',
              classes: 'c',
              icon: 'power',
              click: function() { 
                emit('state:lock')
              }
            })  : null
          ],
          right: [
           button({
             name: 'preview',
             classes: 'c',
             icon: 'preview',
             click: function() {
              emit('state:modal:show', 'preview')
             }
           }),
           button({
             name: 'share',
             classes: 'c',
             icon: 'share',
             click: function() {
              emit('state:library:context:new', 'share')
             }
           })
         ]
        })
      }
    </footer>
  `
}
