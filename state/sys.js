// @TODO: Better documentation for this file.
const remote = window.require('electron').remote
const { app, Menu } = remote.require('electron')
const utils = require('../utils/utils')

module.exports = sysState

function sysState (state, emitter) {
  if (!state.sys) {
    state.sys = {}
    state.sys.status = {}
    state.sys.status.focus = null
    state.sys.status.active = null
    state.sys.path = {}
    state.sys.auth = false
  }

  emitter.on('DOMContentLoaded', function() {
    emitter.emit('log:debug', 'Sys State')

    // Handling auth
    emitter.on('sys:auth:update', toggleAuth)
  })

  // :: toggleAuth
  // Simple on/off auth toggle. Called by state/key.js.
  function toggleAuth() {
    emitter.emit('log:debug', 'toggleAuth: ', !state.sys.auth)
    state.sys.auth = !state.sys.auth
  }

  // IPC
}
