module.exports = state
const { ipcRenderer } = require('electron')
const pgp = require('../_utils/crypto')

function state (state, emitter) {

  emitter.on('DOMContentLoaded', () => {

    emitter.on('state:init', init)
    emitter.on('state:passphrase:send', sendToParent)
    emitter.on('state:passphrase:return', receiveFromParent)
    emitter.on('state:passphrase:toggle', togglePhrase)

  })

  function init (opts) {
    state.opts = opts
    state.phrase = null
    state.valid = false
    state.error = false
    state.next = ''
    state.show = false
  }

  function update() {

  }

  function sendToParent() {
    state.error = true
    state.valid = false
    emitter.emit(state.events.RENDER)

  }

  function receiveFromParent(message) {

  }

  function togglePhrase() {
    state.show = !state.show
    emitter.emit(state.events.RENDER)
  }
}
