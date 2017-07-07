// @TODO: Better documentation for this file.

const folders = require('../utils/folders')
const path = require('path')

module.exports = filesystemStore

function filesystemStore (state, emitter) {
  emitter.on('DOMContentLoaded', function() {
    emitter.emit('log:debug', 'Loading Filesystem')

    emitter.on('filesystem:init', init)
    emitter.on('filesystem:open', open)
    emitter.on('filesystem:destroy', destroy)
    emitter.on('filesystem:make', make)
    emitter.on('filesystem:edit', edit)
    emitter.on('filesystem:rename', rename)
    if (!state.filesystem) {
      emitter.emit('filesystem:init', state.global.path)
    }
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

  // :: get
  //
  function get(target, context, opts, cb) {
    if (!context) context = state.filesystem.children
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
          // state.system.select = true
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

  // :: destroy
  // Deletes the selected file from the filesystem.
  // @params: context (string):      The path to the delete target.
  function destroy(context) {
    if (!context) context = state.filesystem.children

    console.log('Finding item to delete 🗑')
    context.filter( (f) => {
      if (f.selected) {
        folders.rm(f.path, (target) => {
          // state.system.select = false
          emitter.emit('ui:menu:selectActive', false)
          emitter.emit('filesystem:init', state.global.path)
          return
        })
      } else {
        if (f.children && f.children.length > 0) {
          destroy(f.children)
        }
      }
    })
  }

  // :: edit
  // Tell the file browser you want to rename something
  // @params: target (string):     The path for your flag

  function edit(target, context) {
    if (!context) context = state.filesystem.children

    context.filter( (f) => {
      // Account for top level results.
      if (f.path === target) {
        f.rename = !f.rename
        // state.system.select = true
        emitter.emit('render')
        return
      } else { // Recursive sub directories.
        // @TODO: Implement better recursive searching.
        if (f.children && f.children.length > 0) { // Don't search empty dirs.
          edit(target, f.children)
        }
      }
    })
  }
  // :: rename
  // Rename a folder from old name -> new name.
  // @params: target (object):     The data for your old/new path
  function rename(target) {
    folders.rn(target.oldName, target.newName, (err) => {
      if (err) console.log(err)
      else {
        rename(target)
        emitter.emit('filesystem:init', state.global.path)
      }
    })
  }

  // :: make
  // Create a new folder in the filesystem.
  // @params: context (string):    The parent of the new directory.
  function make(context) {
    if (!context) context = ''
    var target = context + '/Untitled'
    console.log('New directory at: ', target)

    folders.mk(target, (err) => {
      // if (err) {
        // var retryPath = context +
      // }
      emitter.emit('filesystem:init', state.global.path)
    })
  }
}
