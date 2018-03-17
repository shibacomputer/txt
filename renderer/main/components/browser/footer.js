const html = require('choo/html')
const style = require('./style')

const toolbar = require('../../../_components/toolbar')
const button = require('../../../_components/button')

module.exports = editorFooter

function editorFooter(state, emit) {
  const libPath = state.data.prefs? state.data.prefs.app.path : ''
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
          libPath
         ],
         left: [
           button({
            name: 'lock',
            classes: 'c',
            icon: 'lock',
            click: function() { console.log('lock') }
           })
        ]
     })
    }
    </footer>
  `
}
