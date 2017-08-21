const html = require('choo/html')
const style = require('./style')
const strings = require('./strings')

const icons = require('../../utils/icons')
const button = require('../../components/button')
const toolbar = require('../../components/toolbar')
const view = require('../../components/view')
const editor = require('../../components/editor')

module.exports = mainWindow

function mainWindow(state, emit) {
  document.title = 'Keyp'

  var editorView = buildEditorView()

  // Set up our components
  return html`
    <body class="b-myc ${style}">
      ${ icons() }
      ${ editorView(state, emit, 'editor', editorView) }
    </body>
  `

  function buildEditorView() {
    var elements = {}

    // Set up our components

    const editor = {
      toolbar: toolbar(),
      footer: toolbar(),
      view: editor()
    }

    return editor
  }
}
