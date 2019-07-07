const ipcRenderer = window.require('electron').ipcRenderer

export default function prefs (state, emitter) {

  //TODO less repetition
  state.prefs = {
    workingDirectory: null,
    userHomeDirectory: null,
    hasTheme: 'dark',
    hasBorder: false,
    usesKeychain: true,
    isFirstLaunch: true,
    locale: null,
    hasFrame: false,
    allowUpdates: true,
    authorIsDiscoverable: false,
    canUnlock: false,
    lastDirectory: null,
  }

  emitter.on('DOMContentLoaded', () => {

    emitter.on('prefs:init', initialisePreferences)
    emitter.on('prefs:read', readPreferences)
    emitter.on('prefs:load', loadPreferences)
    emitter.on('prefs:update', updatePreferences)
    emitter.on('prefs:write', writePreferences)

    ipcRenderer.on('prefs:show', (e) => {
      ipcRenderer.send('modal:show', 'prefs', {
        payload: {
          resource: 'prefs'
        }
      })
    })

    emitter.emit('prefs:read')
  })

  function initialisePreferences(preferences = {}) {
    state.prefs = preferences
    state.proposedPrefs = state.prefs
    emitter.emit('context:update', { preferencesHaveChanges: false })
  }

  function readPreferences() {
    ipcRenderer.send('prefs:read') // Get the preferences on load
    ipcRenderer.once('prefs:read', (e, prefs) => {
      emitter.emit('prefs:load', prefs)
    })
  }

  function writePreferences() {
    ipcRenderer.send('prefs:write', state.proposedPrefs)
    ipcRenderer.once('prefs:write', (e) => {
      emitter.emit('context:update', { preferencesHaveChanges: false })
    })
  }

  function loadPreferences(newPreferences) {
    state.prefs = newPreferences
    state.proposedPrefs = state.prefs // You want to compare these two
    emitter.emit('context:update', { preferencesHaveChanges: false })
  }

  function updatePreferences(obj) {
    let hasChanges = false
    for (const key of Object.keys(obj)) {
      state.proposedPrefs[key] = obj[key]
      if (state.prefs[key].value != obj[key].value) {
        hasChanges = true
      }
    }
    emitter.emit('context:update', { preferencesHaveChanges: hasChanges })
  }
}
