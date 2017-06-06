// @TODO: Better documentation for this file.
const remote = window.require('electron').remote
const { app, Menu } = remote.require('electron')

module.exports = systemStore

function systemStore (state, emitter) {
  var ui = {
    menu: {
      selectActive: false
    }
  }
  emitter.on('DOMContentLoaded', function() {
    emitter.emit('log:debug', 'Setting up UI State')

    emitter.on('ui:menu:selectActive', selectActive)
  })

  function selectActive(bool) {
    console.log('ui menu select ', bool)
    ui.menu.selectActive = bool
  }
}
