const folders = require('../utils/folders')

module.exports = filesystemStore

function filesystemStore (state, emitter) {
  var filesystem = []

  if (!state.filesystem) {
    state.filesystem = {}
    state.filesystem.dirs = filesystem
  }

  emitter.on('DOMContentLoaded', function() {
    emitter.emit('log:debug', 'Loading Filesystem')

    emitter.on('filesystem:addDir', addDir)
    state.filesystem.dirs = filesystem
    // emitter.on('filesystem:refresh', refresh)
    // emitter.on('filesystem:destroy', destroy)

    if (state.filesystem.dirs.length === 0 ) {
      emitter.emit('filesystem:addDir', '/')
    }
  })

  function addDir(target) {
    var filesystem = []

    folders.ls(target, (dir, done) => {
      console.log('📂 ', target, '   📂 ', dir.subdirs, ' | 📄 ', dir.files)
      filesystem.push(dir)
      state.filesystem.dirs = filesystem
      emitter.emit('render')
    })
  }
  
  function removeDir(target) {
    var filesystem = []
    emitter.emit('log:debug', 'Removing dir')
    emitter.emit('render')
  }
}
