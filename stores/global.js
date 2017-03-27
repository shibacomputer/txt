const utils = require('../utils/utils')

module.exports = globalStore

function globalStore (state, emitter) {
  if (!state.global) {
    state.global = {}
    utils.getSetting('hasDbLocationOf', (data) => {
      state.global.path = data
      emitter.emit('render')
    })

    state.global.authenticated = false
    state.global.theme = 'dark'
  }

  emitter.on('DOMContentLoaded', function () {
    emitter.emit('log:debug', 'Loading Global Store')

    // Path
    emitter.on('global:updatePath', updatePath)

    // Authentication
    emitter.on('global:auth', auth)
    emitter.on('global:deauth', deAuth)

    // Preferences
    emitter.on('global:setTheme', setTheme)
  })

  function updatePath (newPath) {
    emitter.emit('log:debug', 'Setting a new path: ', newPath)
    utils.setSetting('hasDbLocationOf', newPath, () => {
      state.global.path = newPath
      emitter.emit('render')
    })
  }

  function auth () {
    emitter.emit('log:debug', 'Attempting Authentication')
  }

  function deAuth () {
    emitter.emit('log:debug', 'Attempting Deauthentication')
  }

  function setTheme () {
    emitter.emit('log:debug', 'Changing theme')
    utils.setSetting('hasTheme', 'light', () => {
      state.global.theme = 'light';
      emitter.emit('render')
    })
  }
}
