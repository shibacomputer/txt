const utils = require('../utils/utils')

module.exports = globalStore

function globalStore(state, emitter) {
  if (!state.global) {
    state.global = {}
    state.global.path = ''
    state.global.authenticated = false
    state.global.theme = 'dark'
  }

  emitter.on('DOMContentLoaded', function() {
    emitter.emit('log:debug', 'Loading Global Store')

    // Path
    emitter.emit('global:updatePath', updatePath)

    // Authentication
    emitter.emit('global:auth', auth)
    emitter.emit('global:deAuth', deAuth)

    // Preferences
    emitter.emit('global:setTheme', setTheme)
  })

  function updatePath (newPath) {
    emitter.emit('log:debug', 'Setting a new path: ', newPath)

  }

  function auth() {
    emitter.emit('log:debug', 'Attempting Authentication')
  }
}
