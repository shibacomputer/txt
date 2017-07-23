const html = require('choo/html')
const css = require('sheetify')

const icons = require('../utils/icons')
const sidebarView = require('../components/sidebar-view/')
const button = require('../components/button')
const toolbar = require('../components/toolbar/')

module.exports = mainWindow

function mainWindow(state, emit) {

  emit('log:debug', 'Rendering main view')

  document.title = 'Txt'

  const base = css`
    :host {
      display: flex;
      flex-direction: row;
    }
  `
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
    'Keyp',
    emit )

  var browserFooter = toolbar ()

  var elements = {
    toolbar: browserToolbar,
    footer: browserFooter
  }
  return html`
    <body class="b-myc ${base}">
      ${ icons() }
      ${ sidebarView(state, emit, 'fileSidebar', elements) }
    </body>
  `
}
