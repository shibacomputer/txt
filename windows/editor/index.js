const html = require('choo/html')
const style = require('./style')
const strings = require('./strings')

const icons = require('../../utils/icons')
const button = require('../../components/button')
const toolbar = require('../../components/toolbar')
const view = require('../../components/view')

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
    const browserToolbar = toolbar( null,
      [
        button({
          name: 'new',
          classes: 'c',
          icon: 'new',
          click: function() {
            console.log(state.sys.path.selected)
            emit('fs:make', state.sys.path.selected)
          }
        })
      ],
      strings.en.title,
      emit )
    const browserFooter = toolbar ()
    const sidebar = {
      toolbar: browserToolbar,
      footer: browserFooter,
      view: editor(state, emit)
    }

    const editorToolbar = toolbar( null, null, null, emit)


    const editor = {
      toolbar: editorToolbar,
      footer: toolbar ()
    }

    return elements
  }
}
