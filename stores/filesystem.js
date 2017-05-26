const folders = require('../utils/folders')
const path = require('path')

module.exports = filesystemStore

function filesystemStore (state, emitter) {
  var filesystem = []

  emitter.on('DOMContentLoaded', function() {
    emitter.emit('log:debug', 'Loading Filesystem')

    emitter.on('filesystem:init', init)
    emitter.on('filesystem:open', open)
    emitter.on('filesystem:close', close)

    emitter.emit('filesystem:init', state.global.path)
  })

  function init(target) {
    folders.init(target, (dirs) => {
      console.log('📂 ', dirs)
      state.filesystem = dirs
      emitter.emit('render')
    })
  }

  function open(target, context) {
    // Don't ever break. If you don't get a context,
    // we default to root
    if (!context) context = state.filesystem.children

    // First thing, don't search empty dirs.
    if (context.length > 0) {
      context.filter( (f) => {
        // Account for top level results
        if (f.path === target) {
          f.open = !f.open
          emitter.emit('render')
          return
        } else { // Recursive sub directories
          if (f.children && f.children.length > 0) { // Don't search empty dirs
            open(target, f.children)
          }
        }
      })
    }
  }
}
