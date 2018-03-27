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
           button({
             name: 'report',
             classes: 'c',
             icon: 'issue',
             click: function() {
              emit('state:composer:toolbar:report')
             }
           })
         ]
        })
      }
    </footer>
  `
}
