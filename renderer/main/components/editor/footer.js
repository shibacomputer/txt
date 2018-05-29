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
          right: [
           button({
             name: 'preview',
             classes: 'c',
             icon: 'preview',
             click: function() {
              emit('state:composer:export')
             }
           }),
           button({
             name: 'share',
             classes: 'c',
             icon: 'share',
             click: function() {
              emit('state:composer:export')
             }
           })
         ]
        })
      }
    </footer>
  `
}
