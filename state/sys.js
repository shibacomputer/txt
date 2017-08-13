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
    state.sys.status.open = []
    state.sys.status.rename = null
    state.sys.path = {}
    state.sys.path.active = null
    state.sys.path.selected = null
    state.sys.path.working = null
    state.sys.auth = false
    state.sys.appearance = {}
    state.sys.appearance.theme = 'dark'
    state.sys.actions = {}
    state.sys.actions.showNewSidebarOptions = false
  }

  emitter.on('DOMContentLoaded', function() {
    emitter.emit('log:debug', 'Sys State')

    // Handling working state
    emitter.on('sys:status:focus:update', setFocus)
    emitter.on('sys:status:active:update', setActive)
    emitter.on('sys:status:open:update', setOpen)
    emitter.on('sys:status:rename:update', setRename)

    // Handling paths
    emitter.on('sys:path:working:update', setWorkingPath)

    // Handling appearance
    emitter.on('sys:appearance:theme:update', setTheme)

    // actions
    emitter.on('sys:actions:sidebar:newOptions', setShowNewOptions)

    // Handling auth
    emitter.on('sys:auth:update', toggleAuth)

    // Initialise
    utils.getSetting('workingPath', (data, err) => {
      emitter.emit('sys:path:working:update', data)
    })

  })

  // :: setFocus
  // Store the focused item
  function setFocus(id) {
    id = typeof id != 'number' ? Number(id) : id
    if (state.sys.status.focus != id) {
      state.sys.status.focus = id
      emitter.emit('render')
    } else {
      return
    }
  }

  // :: setActive
  // Store the active item
  function setActive(id) {
    id = typeof id != 'number' ? Number(id) : id
    if (state.sys.status.active != id) {
      state.sys.status.active = id
      emitter.emit('render')
    } else {
      return
    }
  }

  // :: setDetail
  // Store the open items
  function setOpen(id) {
    id = typeof id != 'number' ? Number(id) : id
    var index = state.sys.status.open.indexOf(id)
    if (index > -1) state.sys.status.open.splice(index, 1)
    else state.sys.status.open.push(id)
    console.log(state.sys.status.open)
    emitter.emit('render')
  }

  // :: setRename
  // Store the active item
  function setRename(id) {
    id = typeof id != 'number' ? Number(id) : id
    if (state.sys.status.rename != id) {
      state.sys.status.rename = id
      emitter.emit('render')
    } else {
      return
    }
  }

  // :: setWorkingPath
  // Set a new full disk path for a notebook and tell the settings db about it.
  // @params: newPath (string):   A new absolute path.
  function setWorkingPath(newPath) {
    state.sys.path.working = newPath
  }

  // :: setTheme
  // Set a new theme and tell the settings db about it.
  // @params: newTheme (string):    A new theme.
  function setTheme(newTheme) {
    // @TODO: Validate a theme.
    emitter.emit('log:debug', 'setTheme: ', newTheme)
    utils.setSetting('theme', newTheme, (err) => {
      if (!err) {
        state.sys.appearance.theme = newTheme
      }
    })
  }

  // :: toggleAuth
  // Simple on/off auth toggle. Called by state/key.js.
  function toggleAuth() {
    emitter.emit('log:debug', 'toggleAuth: ', !state.sys.auth)
    state.sys.auth = !state.sys.auth
  }

  // :: setShowNewOptions
  function setShowNewOptions () {
    emitter.emit('log:debug', 'setShowNewOptions: ', !state.sys.actions.showNewSidebarOptions)
    state.sys.actions.showNewSidebarOptions = !state.sys.actions.showNewSidebarOptions
  }
  //
  // IPC ROUTES
  //
}
