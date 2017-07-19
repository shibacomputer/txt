const html = require('choo/html')
const style = require('./style')
const strings = require('./strings')

const icons = require('../../utils/icons')
const button = require('../../components/button')
const toolbar = require('../../components/toolbar')
const tree = require('../../components/tree')
const sidebarView = require('../../components/sidebar-view')
const editorView = require('../../components/editor-view')

module.exports = mainWindow

function mainWindow(state, emit) {
  document.title = 'Keyp'

  // Set up our components
  const browserToolbar = toolbar( null,
    [
      button({
        name: 'new',
        classes: 'c',
        icon: 'new',
        click: function() {
          console.log('hello')
        }
      })
    ],
    strings.en.title,
    emit )
  const browserFooter = toolbar ()
  const sidebar = {
    toolbar: browserToolbar,
    footer: browserFooter,
    view: tree(state, emit)
  }

  const editorToolbar = toolbar( null, null, null, emit)


  const editor = {
    toolbar: editorToolbar,
    footer: toolbar ()
  }


  return html`
    <body class="b-myc ${style}">
      ${ icons() }
      ${ sidebarView(state, emit, 'sidebar', sidebar) }
      ${ editorView(state, emit, 'editor', editor) }
    </body>
  `
}
