const remote = window.require('electron').remote
const { dialog, shell } = remote.require('electron')
const { ipcRenderer } = window.require('electron')

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
        center: noteTitle(state.note.title, state.note.path, state.note.status.modified),
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
              dialog.showMessageBox(remote.getCurrentWindow(), {
                type: 'warning',
                buttons: [
                  'Continue',
                  'Cancel'
                ],
                defaultId: 0,
                title: 'Settings in Alpha',
                message: 'Warning',
                detail: 'Changing your passphrase right now will prevent Txt from automatically opening files you\'ve already created. You\'ll still be able to open them with GPG or change your passphrase back. A better approach to this is coming soon.'
              }, (response) => {
                switch (response) {
                  case 0:
                    ipcRenderer.send('window', 'setup')
                    break
                  default:
                    return
                }
              })
            }
         })
       ],
       right: [
         button({
           name: 'report',
           classes: 'c',
           icon: 'issue',
           click: function() {
             dialog.showMessageBox(remote.getCurrentWindow(), {
               type: 'question',
               buttons: [
                 'Send Feedback',
                 'Cancel'
               ],
               defaultId: 0,
               title: 'Send Feedback?',
               message: 'Send Feedback',
               detail: 'Txt is still in early development and your help makes all the difference. Do you want to send feedback?'
             }, (response) => {
               switch (response) {
                 case 0:
                   shell.openExternal('https://github.com/shibacomputer/txt/issues')
                   break
                 default:
                   return
               }
             })
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
