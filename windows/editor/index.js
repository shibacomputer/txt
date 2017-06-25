const html = require('choo/html'),
      style = require('./style'),
      strings = require('./strings'),

      icons = require('../../utils/icons'),
      button = require('../../components/button'),
      toolbar = require('../../components/toolbar'),
      tree = require('../../components/tree')
      sidebarView = require('../../components/sidebar-view/')

module.exports = mainWindow

function mainWindow(state, emit) {
  document.title = 'Keyp'
  var browserToolbar = toolbar( null,
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
  const fileTree = tree(state, emit)
  const elements = {
    toolbar: browserToolbar,
    footer: browserFooter,
    view: fileTree
  }

  return html`
    <body class="b-myc ${style}">
      ${ icons() }
      ${ sidebarView(state, emit, 'fileSidebar', elements) }
    </body>
  `
}
