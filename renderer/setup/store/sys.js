module.exports = store

const fs = require('fs')
const path = require('path')
const { ipcRenderer } = require('electron')

function store (state, emitter) {
  init()

  emitter.on('DOMContentLoaded', function () {

    emitter.on('state:init', init)

    emitter.on('state:uri:set', setUri)

    emitter.on('state:doSetup', validateSetup)
  })

  function init() {
    state.progress = 1
    state.phrase = null
    state.key = { }
    state.ui = {
      valid: false,
      uri: null,
      newKey: true
    }
  }

  function setUri(uri) {
    state.ui.uri = uri.path
    state.progress = 2
    emitter.emit(state.events.RENDER)
  }

  function validatePassphrase() {}


  function validateSetup() {
    // First, check to see if the working path exists.
    if (state.ui.uri) {
      fs.stat(state.ui.uri, (err, stats) => { // Do we exist?
        // We must exist, because we have created a dir when selecting a dir.
        if (err) {
          // Send error message to ipc dialog
          ipcRenderer.send('dialog:new:error')
          return
        } else {
          // Path exists
          // @TODO: Test for writing to path
          ipcRenderer.send('dialog:new', {
            type: 'info',
            buttons: ['Continue', 'Back', 'Get Help' ],
            defaultId: 0,
            cancelId: 1,
            message: 'Please take a moment to save your passphrase somewhere secure',
            detail: 'Txt has no \'forgot passphrase\' functionality and your library will be lost if you forget your it.'
          })
          ipcRenderer.once('dialog:response', (event, res) => {
            switch (res) {
              case 2:
                require('electron').shell.openExternal('https://txtapp.io/support')
              case 1:
                break
              default:
                doSetupTasks()
                break
            }
          })
        }
      })
    }
  }

  function doSetupTasks()
}
