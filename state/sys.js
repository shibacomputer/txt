// @TODO: Better documentation for this file.
const remote = window.require('electron').remote
const { app, Menu } = remote.require('electron')
const utils = require('../utils/utils')

module.exports = sysState

function sysState (state, emitter) {
  if (!state.sys) {
    state.sys = {
      ui: {
        setup: {
          validPassphrase: false
        }
      },
      status: {
        active: false
      }
    }
  }

  emitter.on('DOMContentLoaded', function() {
    emitter.emit('log:debug', 'Sys State')

    // UI
    emitter.on('sys:ui:setup:validPassphrase', validatePassphrase)
  })

  function validatePassphrase(e) {
    emitter.emit('log:debug', 'validatePassphrase: ', e)
    state.sys.ui.setup.validPassphrase = e
  }

  // IPC
}
