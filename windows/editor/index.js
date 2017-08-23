const html = require('choo/html')
const style = require('./style')
const strings = require('./strings')

const icons = require('../../utils/icons')
const button = require('../../components/button')
const toolbar = require('../../components/toolbar')
const view = require('../../components/view')
const editor = require('../../components/editor')
const noteTitle = require('../../components/note-title')

module.exports = mainWindow

function mainWindow(state, emit) {
  document.title = 'Keyp'

  // Set up our components
  return html`
    <body class="b-myc ${style}">
      ${ icons() }
      ${ view(state, emit, 'editor', buildEditorView()) }
    </body>
  `

  function buildEditorView() {
    // Set up our components
    const elements = {
      toolbar: toolbar({
        center: noteTitle(state.note.title)
      }),
      footer: toolbar(),
      view: editor(state, emit)
    }

    return elements
  }
}
