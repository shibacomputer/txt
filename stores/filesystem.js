const folders = require('../utils/folders')

module.exports = filesystemStore

function filesystemStore (state, emitter) {
  var filesystem = []

  if (!state.filesystem) {
    state.filesystem
  }

  emitter.on('DOMContentLoaded', function() {
    emitter.emit('log:debug', 'Loading Filesystem')

    emitter.on('filesystem:init', init)
    state.filesystem.dirs = filesystem

    emitter.emit('filesystem:init', state.global.path)
  })

  function init(target) {
    var filesystem = []

    folders.init(target, (dirs) => {
      console.log('📂 ', dirs)
      state.filesystem = dirs
      emitter.emit('render')
    })
  }
}
