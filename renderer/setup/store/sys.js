module.exports = store

const fs = require('fs')
const path = require('path')
const { ipcRenderer } = require('electron')

const crypto = require('../../_utils/crypto')
const io = require('../../_utils/io')

const KEY_DEFAULT = '.txtkey'
const APP_ID = 'Txt'

function store (state, emitter) {
  init()

  emitter.on('DOMContentLoaded', function () {

    emitter.on('state:init', init)

    emitter.on('state:uri:update', updateUri)
    emitter.on('state:passphrase:update', updatePhrase)
    emitter.on('state:key:update', updateKey)

    emitter.on('state:ui:block', blockUi)
    emitter.on('state:setup:validate', validateSetup)
    emitter.on('state:setup:do', doSetup)
  })

  function init() {
    state.progress = 1
    state.phrase = ''
    state.uri = null
    state.key = { }
    state.ui = {
      valid: false,
      newKey: true,
      block: false
    }
    state.prefs = { }
    ipcRenderer.send('get:allPref')
    ipcRenderer.once('done:getPref', (event, key, value) => {
      state.prefs = value
      console.log(state.prefs)
    })
  }

  function updateUri(uri) {
    state.uri = uri.path
    var keyPath = path.join(state.uri + '/' + KEY_DEFAULT)
    if (state.uri) {
      state.progress = 2
      fs.stat(keyPath, (err, stats) => {
        err ? emitter.emit('state:key:update', true) : emitter.emit('state:key:update', false)
        emitter.emit(state.events.RENDER)
      })
    } else {
      state.progress = 1
      emitter.emit(state.events.RENDER)
    }
  }

  function updatePhrase(phrase) {
    state.phrase = phrase.toString()
  }

  function updateKey(isNewKey) {
    state.ui.newKey = isNewKey
  }

  function blockUi(block) {
    state.ui.block = block
    emitter.emit(state.events.RENDER)
  }

  function validateSetup() {
    // First, check to see if the working path exists.
    if (state.uri) {
      fs.stat(state.uri, (err, stats) => { // Do we exist?

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
    emitter.emit('state:ui:block', true)

    var opts = {
      name: state.prefs.author.name,
      email: state.prefs.author.email
    }
    crypto.createKey(opts, state.phrase, (err, key) => {
      if (err) {
        ipcRenderer.send('dialog:new:error')
        emitter.emit('state:ui:block', false)
      } else {
        var keyPath = path.join(state.uri + '/' + KEY_DEFAULT)
        var keyContents = JSON.stringify(key)
        console.log(keyContents)
        state.key = key
        io.write(keyPath, keyContents, (err, success) => {
          if (err) {
            ipcRenderer.send('dialog:new:error')
            emitter.emit('state:ui:block', false)
          } else {
            crypto.writeKeychain(APPID, state.prefs.author.name, state.phrase, (err, success) => {
              if (err) {
                ipcRenderer.send('dialog:new:error')
                emitter.emit('state:ui:block', false)
              } else {
                ipcRenderer.send('do:firstSetup', state)
              }
            })
          }
        })
      }
    })
  }
}
