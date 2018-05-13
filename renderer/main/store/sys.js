module.exports = store

const { ipcRenderer } = require('electron')
const { join, parse } = require('path')
const watch = require('node-watch')

const Mousetrap = require('mousetrap')

const io = require('../../_utils/io')
const pgp = require('../../_utils/crypto')


function store (state, emitter) {
  init()

  emitter.on('DOMContentLoaded', () => {

    ipcRenderer.send('pref:get:all')
    ipcRenderer.once('pref:get:done', (event, key, value) => {

      emitter.on('state:init', init)
      emitter.on('state:ui:focus', updateFocus)
      emitter.on('state:menu:update', updateApplicationMenu)

      //emitter.om('state:key:init', initKey)

      emitter.on('state:library:list', list)
      emitter.on('state:library:select', select)
      emitter.on('state:library:toggle', toggleLibrary)
      
      emitter.on('state:item:rename', startRename)
      emitter.on('state:item:commit', commitRename)
      emitter.on('state:item:make', mk)
      emitter.on('state:item:trash', prepareToTrash)
      emitter.on('state:library:context:new', newContextMenu)
      // emitter.on('state:composer:new', compose)
      // emitter.on('state:composer:update', update)
      // emitter.on('state:composer:revert', revert)
      // emitter.on('state:composer:close', close)

      // emitter.on('state:composer:toolbar:report', report)
      
      // emitter.on('state:library:select', select)
      // emitter.on('state:library:rename:start', startRename)
      // emitter.on('state:library:update', commitRename)
      // emitter.on('state:item:trash', trash)
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
    state.uifocus = null
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
      emitter.emit('state:key:init')
      emitter.emit('state:library:list', state.prefs.app.path, true)
    }
  
  }

  /*
  async function initKey() {
    let decrypted
    try {
      pgp.getKey
    } catch
  } */

  function initWatcher(baseUri) {
    let watcher = watch(baseUri, { recursive: true, persistent: true })
    watcher.on('change', (event, name) => {
      // @TODO: Make this more granular
      emitter.emit('state:library:list', state.prefs.app.path, true)
    })
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
    if (base) {
      // @TODO: Diff this.
      state.lib = tree
      initWatcher(state.prefs.app.path)
    }
    else {
      var index = state.sidebar.openDirs.indexOf(d.id)
      if (index === -1) state.sidebar.openDirs.push(d.id)
      else state.sidebar.openDirs.splice(index, 1)
    }
    emitter.emit('state:menu:update')
    state.status.listing = false
    emitter.emit(state.events.RENDER) 
  }

  async function mk(type) {

    let base = state.status.focus.uri? state.status.focus.uri : state.prefs.app.path 
    let uri = join(base, 'Untitled Folder')
    try {
      if (type === 'directory') io.mkdir(uri)
    } catch (e) {
      console.log(e)
    }
  }

  async function write() {
    
  }

  /*
  async function encrypt(f, d) {
    let contents = { }
    try {
      
    }
  } */

  async function select(i, context) {
    let selected = await selectLibraryItem(i)
    if (selected) {
      emitter.emit(state.events.RENDER)
      if (context) window.setTimeout(() => {
        emitter.emit('state:library:context:new', i.type)
      }, 50) 
    }
  }

  async function commitRename(f) {
    let oldUri = state.status.focus.uri
    let newUri = parse(f.uri).dir + '/' + f.newUri

    if (oldUri === newUri) {
      state.status.renaming = false
      emitter.emit(state.events.RENDER)
      return
    }

    try {
      await io.mv({ old: oldUri, new: newUri })
    } catch (e) {
      console.log(e)
    }
    state.status.renaming = false
  }

  async function trash(f) {
    try {
      await io.trash(f.uri)
    } catch (e) {
      console.log(e)
    }
  }

  function prepareToTrash() {
    var focus = state.status.focus.uri
    if (focus) ipcRenderer.send('dialog:new', {
      type: 'question',
      buttons: ['Move to Trash', 'Cancel'],
      defaultId: 0,
      cancelId: 1,
      message: 'Trash ' + parse(focus).name + '?',
      detail: 'The item will be moved to your computer\'s trash.'
    })
    ipcRenderer.once('dialog:response', (event, res) => {
      switch (res) {
        case 1:
         // cancel
         break
        default:
          trash(state.status.focus)
      }
    }) 
  }

  function startRename() {
    if (!state.status.focus.id || state.status.renaming) return
    state.status.renaming = true
    emitter.emit(state.events.RENDER)
  }

  function toggleLibrary() {
    state.data.ui.sidebar.visible = !state.data.ui.sidebar.visible
    state.data.ui.menu.library = !state.data.ui.menu.library
    // Change trash focus to the current item
    // Remove renaming
    emitter.emit('state:menu:update')
    emitter.emit(state.events.RENDER)
  }

  // Utils
  function selectLibraryItem(i) {
    return new Promise(resolve => {
      if (state.status.renaming) resolve(false)
      state.status.focus = i
      state.menu.trash = true
      state.menu.rename = true
      emitter.emit('state:menu:update')
      resolve(true)
    })
  }

  function updateFocus(newFocus) {
    if (state.uifocus === newFocus) return
    else state.uifocus = newFocus
  }

  // Out
  function newContextMenu(type) {
    ipcRenderer.send('menu:context:new', type)
  }

  function updateApplicationMenu() {
    ipcRenderer.send('menu:new', 'main', state.menu)
  }

  // Responses to the menu system
  ipcRenderer.on('menu:file:new:dir', (event, response) => {
    emitter.emit('state:item:make', 'directory')
  })  
  ipcRenderer.on('menu:file:new:window', (event, response) => {
    ipcRenderer.send('window:open', 'main')
  })
  ipcRenderer.on('menu:file:rename', (event, response) => {
    emitter.emit('state:item:rename')
  })
  ipcRenderer.on('menu:file:trash', (event, response) => {
    emitter.emit('state:item:trash')
  })  
  ipcRenderer.on('menu:view:library', (event, response) => {
    emitter.emit('state:library:toggle')
  })

  ipcRenderer.on('menu:context:reveal', (event, response) => {
    emitter.emit('state:contextmenu:reveal', state.status.focus.uri)
  })

  // Keyboard navigation
}
