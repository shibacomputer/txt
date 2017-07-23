// @TODO: Better documentation for this file.
const remote = window.require('electron').remote
const { app, Menu } = remote.require('electron')
const utils = require('../utils/utils')

module.exports = sysState

function sysState (state, emitter) {
  if (!state.sys) {
    state.sys = {}
    state.sys.path = {}
    state.sys.path.active = null
    state.sys.path.selected = null

    utils.getSetting('workingPath', (data) => {
      state.sys.path.working = data || null
      emitter.emit('render')
    })

    state.sys.auth = false
    state.sys.ui = {}
    state.sys.ui.theme = 'dark'
  }

  emitter.on('DOMContentLoaded', function() {
    emitter.emit('log:debug', 'Setting up UI State')

    // Handling paths
    emitter.on('sys:path:active:update', setActivePath)
    emitter.on('sys:path:selected:update', setSelectedPath)
    emitter.on('sys:path:working:update', setWorkingPath)

    // Handling appearance
    emitter.on('sys:ui:theme:update', setTheme)

    // Handling auth
    emitter.on('sys:auth:update', toggleAuth)
  })

  // :: setActivePath
  // Update the active path, specifically for working with notes.
  // @params: newPath (string):   A new relative path.
  function setActivePath(newPath) {
    utils.getPath(target, (validPath, err) => {
      if (!err) {
        emitter.emit('log:debug', 'setActivePath: ', validPath)
        state.sys.activePath = validPath
      }
    })
  }

  // :: setSelectedPath
  // The current selected directory or note. Use this when you want to
  // work with commands that require a specific directory (new item, delete, etc)
  // @params: newPath (string):   A new relative path.
  function setSelectedPath(newPath) {
    utils.getPath(newPath, (validPath, err) => {
      if (!err) {
        emitter.emit('log:debug', 'setSelectedPath: ', validPath)
        state.sys.selectedPath = validPath
      }
    })
  }

  // :: setWorkingPath
  // Set a new full disk path for a notebook and tell the settings db about it.
  // @params: newPath (string):   A new absolute path.
  function setWorkingPath(newPath) {
    emitter.emit('log:debug', 'setWorkingPath ', newPath)
    // Update app settings
    utils.setSetting('workingPath', newPath, (err) => {
      // Set the path.
      if (!err) {
        state.sys.working = newPath
        emitter.emit('render')
      }
    })
  }

  // :: setTheme
  // Set a new theme and tell the settings db about it.
  // @params: newTheme (string):    A new theme.
  function setTheme(newTheme) {
    // @TODO: Validate a theme.
    emitter.emit('log:debug', 'setTheme: ', newPath)
    utils.setSetting('theme', newTheme, (err) => {
      if (!err) {
        state.sys.ui.theme = newTheme
      }
    })
  }

  // :: toggleAuth
  // Simple on/off auth toggle. Called by state/key.js.
  function toggleAuth() {
    emitter.emit('log:debug', 'toggleAuth: ', !state.sys.auth)
    state.sys.auth = !state.sys.auth
  }

  //
  // IPC ROUTES
  //
}
