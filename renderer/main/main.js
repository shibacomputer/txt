const html = require('choo/html')
const style = require('./style')

const browser = require('./components/browser')
const editor = require('./components/editor')

const icons = require('../_components/icons')
module.exports = editorApplication

/**
 * The editor is the app's main interaction point, a combination
 * sidebar, text editor and file manipulator.
 */

function editorApplication(state, emit) {
  document.title = 'Txt'

  return html`
    <body class="b-myc ${style.app}">
      ${ browser(state, emit) }
      ${ editor(state, emit) }
      ${ icons() }
    </body>
  `
}
