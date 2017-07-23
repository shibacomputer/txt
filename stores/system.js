// @TODO: Better documentation for this file.
const remote = window.require('electron').remote
const { app, Menu } = remote.require('electron')
const utils = require('../utils/utils')

module.exports = systemStore

function systemStore (state, emitter) {
  if (!state.sys) {
    state.sys = {}
    state.sys.activePath = null
    state.sys.selectedPath = null
  }
  emitter.on('DOMContentLoaded', function() {
    emitter.emit('log:debug', 'Setting up UI State')

    emitter.on('sys:setActivePath', setActivePath)
    emitter.on('sys:setSelectedPath', setSelectedPath)
  })

  function setActivePath(target) {
    utils.getPath(target, (path) => {
      state.sys.activePath = path
    })
  }

  function setSelectedPath(target) {
    utils.getPath(target, (path) => {
      state.sys.selectedPath = path
    })
  }
}
