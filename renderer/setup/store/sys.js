module.exports = store

const fs = require('fs')
const path = require('path')
const { ipcRenderer } = require('electron')

const io = require('../../_utils/io')
const pgp = require('../../_utils/crypto')

const polyglot = require('../../_utils/i18n/i18n')
const i18n = polyglot.init(window.navigator.language)

const KEY_DEFAULT = '.txtkey'
const APP_ID = 'Txt'

function store (state, emitter) {
  init()

  emitter.on('DOMContentLoaded', () => {

    emitter.on('state:init', init)

    emitter.on('state:uri:update', updateUri)
    emitter.on('state:passphrase:update', updatePhrase)
    emitter.on('state:key:update', updateKey)
    emitter.on('state:ui:update', updateInterface)
    emitter.on('state:user:update', updateUser)
    emitter.on('state:email:update', updateEmail)

    emitter.on('state:ui:block', blockUi)
    emitter.on('state:ui:focus', updateFocus)
    emitter.on('state:setup:validate', validateSetup)
    emitter.on('state:setup:init', initSetup)
  })

  function init() {
    state.progress = 1
    state.phrase = ''
    state.uri = null
    state.uifocus = null
    state.key = { }
    state.ui = {
      valid: false,
      newKey: true,
      block: false
    }
    state.user = {
      name: 'Txt User',
      email: 'anonymous@txtapp.io'
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

  function updateUser(user) {
    user.length > 0 ? state.user.name = user.toString() : i18n.t('setup.ui.nameInput.placeholder')
  }

  function updateEmail(email) {
    email.length > 0 ? state.user.email = email.toString() : i18n.t('setup.ui.emailInput.placeholder')
  }

  function updateInterface(i) {
    state.progress = state.progress + i
    emitter.emit(state.events.RENDER)

  }
  function blockUi(block) {
    state.ui.block = block
    emitter.emit(state.events.RENDER)
  }

  function updateFocus(newFocus, reload) {
    if (state.uifocus === newFocus) return
    else {
      state.uifocus = newFocus
      if (reload) {
        emitter.emit(state.events.RENDER)
      }
    }
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
          ipcRenderer.send('dialog:new', {
            type: 'info',
            buttons: [ i18n.t('verbs.continue'), i18n.t('verbs.back'), i18n.t('verbs.help') ],
            defaultId: 0,
            cancelId: 1,
            message: i18n.t('dialogs.securePassphrase.title'),
            detail: i18n.t('dialogs.securePassphrase.detail', { app_name: 'Txt'} )
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
    var opts = {
      author: {
        name: state.user.name,
        email: state.user.email
      },
      uri: state.uri
    }

    let result
    emitter.emit('state:ui:block', true)
    if (state.ui.newKey) {
      try {
        result = await pgp.generateKey(state.uri, opts.author, state.phrase)
      } catch (e) {
        console.log(e)
        ipcRenderer.send('dialog:new:error', e)
      }
      if (result) ipcRenderer.send('app:setup:init', opts)
      emitter.emit('state:ui:block', false)
    } else {
      try {
        result = await pgp.getKey(state.uri, opts.author, state.phrase)
      } catch (e) {
        displayErrorBox()
      }
      console.log(result)
      if (result) ipcRenderer.send('app:setup:init', opts)
      else displayErrorBox()
    }

    ipcRenderer.send('pref:set', opts.author)

    ipcRenderer.once('app:setup:done', (event, res) => {
      ipcRenderer.send('window:open', 'main', 'window:close')
    })

    ipcRenderer.once('window:open:done', (event, nextEvent, win) => {
      if (nextEvent) ipcRenderer.send(nextEvent, win)
    })
  }

  function displayErrorBox(error) {
    emitter.emit('state:ui:block', false)
    ipcRenderer.send('dialog:new', {
      type: 'error',
      buttons: [ i18n.t('verbs.retry'), i18n.t('verbs.help') ],
      defaultId: 0,
      cancelId: 1,
      message: i18n.t('errors.keyWrongPassphrase.title'),
      detail: i18n.t('errors.keyWrongPassphrase.detail')
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
  ipcRenderer.on("window:event:blur", (event, response) => {
    emitter.emit('state:ui:focus', 'blur', true)
  })

  ipcRenderer.on("window:event:focus", (event, response) => {
    if (state.uifocus !== 'modal') emitter.emit('state:ui:focus', 'general', true)
  })
}
