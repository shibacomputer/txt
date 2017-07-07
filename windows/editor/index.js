const html = require('choo/html'),
      style = require('./style'),
      strings = require('./strings'),

      icons = require('../../utils/icons'),
      button = require('../../components/button'),
      toolbar = require('../../components/toolbar'),
      tree = require('../../components/tree'),
      sidebarView = require('../../components/sidebar-view'),
      editorView = require('../../components/editor-view'),
      textEditor = require('../../components/editor')

module.exports = mainWindow

function mainWindow(state, emit) {
  document.title = 'Keyp'

  // Set up our components
  const browserToolbar = toolbar( null,
    [
      button({
        name: 'new',
        classes: 'c',
        icon: 'new-folder',
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

  const editorToolbar = toolbar( null,
    [
      button({
        name: 'share',
        classes: 'c',
        icon: 'new',
        click: function() {
          console.log('Click')
        }
     })
   ], null, emit)


  const editor = {
    toolbar: editorToolbar,
    footer: toolbar (),
    view: textEditor(state, emit)
  }


  return html`
    <body class="b-myc ${style}">
      ${ icons() }
      ${ sidebarView(state, emit, 'sidebar', sidebar) }
      ${ editorView(state, emit, 'editor', editor)}
    </body>
  `
}
