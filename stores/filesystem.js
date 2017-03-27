const utils = require('../utils/utils')
const folders = require('../utils/folders')

module.exports = filesystemStore

function filesystemStore (state, emit) {
  if (!state.filesystem) {
    state.filesystem = {}
    state.fileystem.dirs = {}
  }

  emitter.on('DOMContentLoaded', function() {
    emitter.emit('log:debug', 'Loading Filesystem')

    emitter.on('filesystem:add', add)
    emitter.on('filesystem:refresh', refresh)
    emitter.on('filesystem:destroy', destroy)
  })
}
