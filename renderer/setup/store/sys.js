module.exports = store

const fs = require('fs')
const path = require('path')
const { ipcRenderer } = require('electron')

const crypto = require('../../_utils/crypto')

const KEY_DEFAULT = '.txt.asc'

function store (state, emitter) {
  init()

  emitter.on('DOMContentLoaded', function () {

    emitter.on('state:init', init)

    emitter.on('state:uri:update', updateUri)
    emitter.on('state:passphrase:update', updatePhrase)

    emitter.on('state:setup:validate', validateSetup)
    emitter.on('state:setup:do', doSetup)
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

  function updateUri(uri) {
    state.ui.uri = uri.path
    var keyPath = path.join(state.ui.uri + '/' + KEY_DEFAULT)
    state.progress = 2
    emitter.emit(state.events.RENDER)
  }

  function updatePhrase(phrase) {
    state.phrase = phrase
  }


  function validateSetup() {
    // First, check to see if the working path exists.
    if (state.ui.uri) {
      fs.stat(state.ui.uri, (err, stats) => { // Do we exist?

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
            detail: 'Txt has no \'forgot passphrase\' functionality and your library will be lost if you forget it!'
          })
          ipcRenderer.once('dialog:response', (event, res) => {
            switch (res) {
              case 2:
                require('electron').shell.openExternal('https://txtapp.io/support')
              case 1:
                break
              default:
                emitter.emit('state:setup:do')
                break
            }
          })
        }
      })
    }
  }

  function doSetup() {

  }
}
