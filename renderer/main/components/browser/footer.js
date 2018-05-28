const html = require('choo/html')
const style = require('./style')

const toolbar = require('../../../_components/toolbar')
const button = require('../../../_components/button')

module.exports = editorFooter

function editorFooter(state, emit) {
  const libPath = state.prefs? state.prefs.app.path : ''
  return html`
    <footer class=${ style.footer }>
      ${
        toolbar({
          right: [
            button({
              name: 'settings',
              classes: 'c',
              icon: 'settings',
              click: function() { console.log('setting' )}
           })
         ],
         center: [
          html `
            <span class="w" oncontextmenu=${ showContextMenu }}>
              ${ libPath }
            </span>`
         ],
         left: [
           button({
            name: 'power ',
            classes: 'c',
            icon: 'power',
            click: function() { console.log('lock') }
           })
        ]
     })
    }
    </footer>
  `
  function showContextMenu(e) {
    console.log('hello')
    emit('state:library:context:new', 'footer')
  }
}
