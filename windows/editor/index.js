const html = require('choo/html')
const style = require('./style')
const strings = require('./strings')

const icons = require('../../utils/icons')
const button = require('../../components/button')
const toolbar = require('../../components/toolbar')
const view = require('../../components/view')
const Editor = require('../../components/editor')
const noteTitle = require('../../components/note-title')

module.exports = mainWindow

function mainWindow(state, emit) {
  var editor = Editor()

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
        center: noteTitle(state.note.title),
        right: [
          button({
            name: 'new',
            classes: 'c',
            icon: 'new',
            click: function() {
              emit('note:new')
            }
          })
        ]
      }),
      footer: toolbar({
        left: [
          button({
            name: 'settings',
            classes: 'c',
            icon: 'settings',
            click: function() {
              console.log('settings')
            }
         })
       ],
       right: [
         button({
           name: 'report',
           classes: 'c',
           icon: 'issue',
           click: function() {
             console.log('report issue')
           }
         })
       ]
      }),
      view: editor.render({
        body: state.note.body,
        staleBody: state.note.staleBody,
        modified: state.note.status.modified
      }, emit)
    }

    return elements
  }
}
