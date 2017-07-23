// @TODO: Better documentation for this file.
const remote = window.require('electron').remote
const { app, Menu } = remote.require('electron')
const folders = require('../utils/folders')
const path = require('path')

module.exports = fsState

function fsState (state, emitter) {
  emitter.on('DOMContentLoaded', function() {
    emitter.emit('log:debug', 'Loading Filesystem')

    emitter.on('fs:init', init)
    emitter.on('fs:open', open)
    emitter.on('fs:destroy', destroy)
    emitter.on('fs:make', make)
    emitter.on('fs:edit', edit)
    emitter.on('fs:select', select)
    emitter.on('fs:rename', rename)
    
    if (!state.fs || !state.fs.childen) {
      emitter.emit('fs:init', state.sys.path.working)
    }
  })

  // :: init
  // Initialises the filesystem for the first time.
  // @params: target (string):    The path to initalise. Also state.sys.path.working.
  function init(target) {
    folders.init(target, (dirs) => {
      console.log('📂 ', dirs)
      state.fs = dirs
      emitter.emit('render')
    })
  }

  // :: get
  //
  function get(target, context, opts, cb) {
    if (!context) context = state.fs.children
  }

  // :: open
  // Flags a directory as open or closed. Recursively checks the filesystem object
  // until a match is found.
  // @params: target (string):    The target path relative to Key's global path.
  //          context (object):   A slice of the filesystem object.
  function open(target, context) {
    // Don't ever break. If you don't get a context,
    // we default to root.
    if (!context) context = state.fs.children

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
    if (!context) context = state.fs.children

    console.log('Finding item to delete 🗑')
    context.filter( (f) => {
      if (f.selected) {
        folders.rm(f.path, (target) => {
          // state.system.select = false
          emitter.emit('ui:menu:selectActive', false)
          emitter.emit('fs:init', state.sys.path.working)
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
    if (!context) context = state.fs.children

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

  // :: select
  function select(target, context) {
    if (!context) context = state.fs.children
    context.filter( (f) => {
      // Account for top level results.
      if (f.path === target) {
        f.selected = !f.selected
        // state.system.select = true
        emitter.emit('sys:setSelectedPath', f.path)
        emitter.emit('render')
        return
      } else { // Recursive sub directories.
        // @TODO: Implement better recursive searching.
        f.selected = false
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
        emitter.emit('fs:init', state.sys.path.working)
      }
    })
  }

  // :: make
  // Create a new folder in the filesystem.
  // @params: context (string):    The parent of the new directory.
  function make(context) {
    var target = context + '/Untitled'
    console.log('New directory at: ', target)

    folders.mk(target, (err) => {
      // if (err) {
        // var retryPath = context +
      // }
      emitter.emit('fs:init', state.sys.path.working)
    })
  }
}
