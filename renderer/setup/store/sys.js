module.exports = store

const fs = require('fs')
const path = require('path')
const { ipcRenderer } = require('electron')

const io = require('../../_utils/io')
const pgp = require('../../_utils/crypto')

const KEY_DEFAULT = '.txtkey'
const APP_ID = 'Txt'

function store (state, emitter) {
  init()

  emitter.on('DOMContentLoaded', () => {

    emitter.on('state:init', init)

    emitter.on('state:uri:update', updateUri)
    emitter.on('state:passphrase:update', updatePhrase)
    emitter.on('state:key:update', updateKey)

    emitter.on('state:ui:block', blockUi)
    emitter.on('state:setup:validate', validateSetup)
    emitter.on('state:setup:init', initSetup)
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
    ipcRenderer.send('pref:get:all')
    ipcRenderer.once('pref:get:done', (event, key, value) => {
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
          ipcRenderer.send('dialog:new:error', err)
          return
        } else {
          // Path exists
          var opts = {
            author: {
              name: state.prefs.author.name,
              email: state.prefs.author.email
            },
            uri: state.uri
          }

          //ipcRenderer.send('app:setup:init', opts) // Write prefs
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
                break
              case 1:
                break
              default:
                emitter.emit('state:setup:init')
                break
            }
          })
        }
      })
    }
  }

  async function initSetup() {
    emitter.emit('state:ui:block', true)
    console.log('hello')
    if (state.ui.newKey) {
      try {
        await pgp.generateKey(state.uri, state.prefs.author, state.phrase)
      } catch (e) {
        console.log(e)
        ipcRenderer.send('dialog:new:error', e)
      }
      emitter.emit('state:ui:block', false)
    } else {
      try {
        let result = await pgp.getKey(state.uri, state.prefs.author, state.phrase)
        console.log('A result: ', result)
      } catch (e) {
        console.log(e)
        // Wrong passphrase
        ipcRenderer.send('dialog:new', {
          type: 'error',
          buttons: ['Try again', 'Get Help' ],
          defaultId: 0,
          cancelId: 1,
          message: 'Wrong passphrase',
          detail: 'That passphrase didn\'t work – please try again.'
        })
        ipcRenderer.once('dialog:response', (event, res) => {
          switch (res) {
            case 2:
              require('electron').shell.openExternal('https://txtapp.io/support')
              break
            case 1:
              break
            default:
              state.phrase = ''
              emitter.emit(state.events.RENDER)
              break
          }
        })
      }
    }
  }
}
