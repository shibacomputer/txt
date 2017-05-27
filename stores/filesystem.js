// @TODO: Better documentation for this file.

const folders = require('../utils/folders')
const path = require('path')

module.exports = filesystemStore

function filesystemStore (state, emitter) {
  var filesystem = []

  emitter.on('DOMContentLoaded', function() {
    emitter.emit('log:debug', 'Loading Filesystem')

    emitter.on('filesystem:init', init)
    emitter.on('filesystem:open', open)
    emitter.on('filesystem:refresh', refresh)
    emitter.emit('filesystem:init', state.global.path)
  })
  // :: init
  // Initialises the filesystem for the first time.
  // @params: target (string):    The path to initalise. Also state.global.path.
  function init(target) {
    folders.init(target, (dirs) => {
      console.log('📂 ', dirs)
      state.filesystem = dirs
      emitter.emit('render')
    })
  }

  // :: open
  // Flags a directory as open or closed. Recursively checks the filesystem object
  // until a match is found.
  // @params: target (string):    The target path relative to Key's global path.
  //          context (object):   A slice of the filesystem object.
  function open(target, context) {
    // Don't ever break. If you don't get a context,
    // we default to root.
    if (!context) context = state.filesystem.children

    // First thing, don't search empty dirs.
    if (context.length > 0) {
      context.filter( (f) => {
        // Account for top level results.
        if (f.path === target) {
          f.open = !f.open
          emitter.emit('render')
          return
        } else { // Recursive sub directories.
          // @TODO: Implement better recursive searching.
          if (f.children && f.children.length > 0) { // Don't search empty dirs.
            open(target, f.children)
          }
        }
      })

      // @TODO: Add better error handling if the dir is missing.
    }
  }

  // :: refresh
  // Refreshes the filesystem. This is called when Keyp adds a note, enters the
  // foreground, or otherwise needs to do a system refresh.
  function refresh() {

  }
}