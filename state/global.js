const utils = require('../utils/utils')

module.exports = globalStore

function globalStore (state, emitter) {
  if (!state.global) {
    state.global = {}
    utils.getSetting('hasDbLocationOf', (data) => {
      state.sys.path.working = data || null
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

  // :: updatePath
  // Sets the working directory for Kepy. Does this by updating a Preferences
  // file in the user's application settings.
  // @params: newPath (string): The new desired path.
  function updatePath (newPath) {
    emitter.emit('log:debug', 'Setting a new path: ', newPath)
    // @TODO: Do a secondary check here for path validity.
    utils.setSetting('hasDbLocationOf', newPath, () => {
      state.sys.path.working = newPath
      emitter.emit('render')
    })
  }

  // :: auth
  // Sets the global authentication state. This will trigger locking or unlocking
  // the app interface. Do not confuse this with functions in stores/keychain.js
  function auth () {
    emitter.emit('log:debug', 'Attempting Authentication')
    // @TODO: Create authentication
  }

  // :: deAuth
  // Destroys authentication
  function deAuth () {
    emitter.emit('log:debug', 'Attempting Deauthentication')
    // @TODO: Destroy authentication
  }

  // :: setTheme
  // Toggles the dark/light theme. This will be extended in future for more
  // skins. No params for now.
  function setTheme () {
    emitter.emit('log:debug', 'Changing theme')
    utils.setSetting('hasTheme', 'light', () => {
      state.global.theme = 'light';
      emitter.emit('render')
    })
  }
}
