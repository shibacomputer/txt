module.exports = store

const { ipcRenderer } = require('electron')
const { join, parse } = require('path')

const Mousetrap = require('mousetrap')

const io = require('../../_utils/io')
const crypto = require('../../_utils/crypto')


function store (state, emitter) {
  init()

  emitter.on('DOMContentLoaded', () => {

    ipcRenderer.send('pref:get:all')
    ipcRenderer.once('pref:get:done', (event, key, value) => {

      emitter.on('state:init', init)

      emitter.on('state:menu:update', updateApplicationMenu)

      emitter.on('state:library:list', list)
      emitter.on('state:library:select', select)
      // emitter.on('state:composer:new', compose)
      // emitter.on('state:composer:update', update)
      // emitter.on('state:composer:revert', revert)
      // emitter.on('state:composer:close', close)

      // emitter.on('state:composer:toolbar:report', report)

      // emitter.on('state:library:toggle', toggleLibrary)
      
      // emitter.on('state:library:select', select)
      // emitter.on('state:library:rename:start', startRename)
      // emitter.on('state:library:rename:commit', commitRename)
      // emitter.on('state:library:trash', trash)
      // emitter.on('state:library:set:active', setActive)
      // emitter.on('state:library:open:directory', ls)
      // emitter.on('state:library:open:file', open)
      // emitter.on('state:library:read:file', read)
      // emitter.on('state:library:write:file', commit)
      // emitter.on('state:library:write:directory', mkdir)
      // emitter.on('state:library:context:display', displayContext)
      // emitter.on('state:library:reveal', reveal)

      // emitter.on('state:key:get', getKey)
      // emitter.on('state:key:import', addKey)
      // emitter.on('state:error', sendError)

      emitter.emit('state:init', value)
    })
  })

  /**
   * Initialises the system state for the main window. This function gets its
   * arguments via the main process, and doesn't take any local arguments.
   * This will only run when there is no state persistence.
   * */
  function init(value) {
    state.unlocked = false
    state.prefs = value
    state.status = {
      modified: false,
      writing: false,
      listing: false,
      fullscreen: false,
      renaming: false,
      focus: { },
      active: { }
    }
    state.composer = {
      id: '',
      body: '',
      stale: '',
      uri: null,
      title: null
    }
    state.lib = null
    state.sidebar = {
      visible: true,
      openDirs: []
    }
    state.menu = {
      save: false,
      revert: false,
      close: false,
      trash: false,
      export: false,
      print: false,
      preview: false,
      library: true,
      rename: false
    }
    state.key = { }

    if (state.prefs) {
      emitter.emit('state:library:list', state.prefs.app.path, true)
      // emitter.emit('state:key:get')
    }
  }

  async function list(d, base) {
    state.status.listing = true
    let uri = d.uri? d.uri : d
    let tree 
    try { 
      tree = await io.ls(uri)
    } catch (e) {
      ipcRenderer.send('dialog:new:error', e)
    }
    if (base) state.lib = tree
    else {
      var index = state.sidebar.openDirs.indexOf(d.id)
      if (index === -1) state.sidebar.openDirs.push(d.id)
      else state.sidebar.openDirs.splice(index, 1)
    }
    emitter.emit('state:menu:update')
    state.status.listing = false
    emitter.emit(state.events.RENDER) 
  }

  function select(i) {
    if (state.status.renaming) return
    state.status.focus = i
    state.menu.trash = true
    state.menu.rename = true
    emitter.emit('state:menu:update')
    emitter.emit(state.events.RENDER)
  }

  function updateApplicationMenu() {
    ipcRenderer.send('menu:new', 'main', state.menu)
  }
}
