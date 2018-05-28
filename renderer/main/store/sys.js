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

      emitter.on('state:key:init', initKey)

      emitter.on('state:library:list', list)
      emitter.on('state:library:select', select)
      emitter.on('state:library:toggle', toggleLibrary)
      emitter.on('state:library:context:new', newContextMenu)

      emitter.on('state:item:rename', startRename)
      emitter.on('state:item:commit', commitRename)
      emitter.on('state:item:make', prepareToMake)
      emitter.on('state:item:trash', prepareToTrash)
      emitter.on('state:item:read', prepareToRead)
      
      // emitter.on('state:composer:new', compose)
      emitter.on('state:composer:update', update)
      emitter.on('state:composer:write', write)
      emitter.on('state:composer:revert', prepareToRevert)
      emitter.on('state:composer:close', prepareToClose)

      // emitter.on('state:composer:toolbar:report', report)
      
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
      name: null
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
      trashCurrent: false,
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

  
  async function initKey() {
    let decrypted
    try {
      decrypted = await pgp.getKey(state.prefs.app.path)
    } catch (e) {
      console.log(e)
    }
    state.unlocked = decrypted
  }

  function initWatcher(uri) {
    let watcher = watch(uri, { recursive: true, persistent: true })
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

  async function mk() {
    let d = state.status.focus
    let base = d.uri? d.uri : state.prefs.app.path
    let index = state.sidebar.openDirs.indexOf(d.id)
    let uri = join(index === -1? parse(base).dir : base, 'Untitled Folder')
    try {
      io.mkdir(uri)
    } catch (e) {
      console.log(e)
    }
  }

  async function write(type) {
    state.writing = true
    let c = state.composer
    let ciphertext
    try {
      ciphertext = await pgp.encrypt(c.body)
    } catch(e) {
      console.log(e)
      return
    }
    
    let success, uri
    
    if (type === 'new') {
      let base
      if (state.status.focus.uri) {
        let index = state.sidebar.openDirs.indexOf(state.status.focus.id)
        base = index === -1 ? parse(state.status.focus.uri).dir : state.status.focus.uri
      } else {
        base = state.prefs.app.path
      }
      let filename = 'Untitled.gpg'
      uri = join(base, filename)
      
    } else {
      f = state.status.active
      uri = f.uri
    } 
    try {
      success = await io.write(uri, ciphertext) 
    } catch (e) {
      console.log(e)
    }
    state.writing = false
    state.status.modified = false
    
    switch (type) {
      case 'new':
        let d = { uri: uri }
        emitter.emit('state:item:read', d)
      break

      case 'next':
        emitter.emit('state:item:read', state.status.focus)
      break

      case 'close':
        close()
    }
  }

  async function read(f) {
    let ciphertext
    let contents = {
      id: '',
      body: '',
      stale: '',
      uri: null,
      name: null
    }
    emitter.emit('state:composer:update', contents)
    
    try {
      ciphertext = await io.read(f.uri)
    } catch (e) {
      console.log(e)
    }
    
    let body
    try {
      body = await pgp.decrypt(ciphertext)
    } catch (e) {
      console.log(e)
    }

    contents = {
      id: f.id,
      body: body,
      stale: body,
      uri: f.uri,
      name: parse(f.uri).name
    }

    state.status.active = f
    emitter.emit('state:composer:update', contents)
  }

  async function select(i, context) {
    let selected = await selectLibraryItem(i)
    if (selected) {
      emitter.emit(state.events.RENDER)
      if (context) window.setTimeout(() => {
        emitter.emit('state:library:context:new', i.type)
      }, 50) 
    }
  }

  function update(contents) {
    state.composer = contents

    if (state.composer.body !== state.composer.stale) {
      state.status.modified = true
      state.menu.save = true
      state.menu.revert = true
      emitter.emit('state:menu:update')
    }
    else {
      state.status.modified = false
      state.menu.save = false
      state.menu.revert = false
      emitter.emit('state:menu:update')
      emitter.emit(state.events.RENDER)
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
    
    if (state.status.active === f) {
      let contents = {
        id: state.composer.id,
        body: state.composer.body,
        stale: state.composer.stale,
        uri: newUri,
        name: parse(f.newUri).name
      }

      emitter.emit('state:composer:update', contents)
    }
    
    
    state.status.renaming = false
  }

  async function trash(f) {
    try {
      await io.trash(f.uri)
    } catch (e) {
      console.log(e)
    }
    if (f.id === state.status.focus.id ) state.status.focus = { }
    if (f.id === state.status.active.id) {
      let contents = {
        id: '',
        body: '',
        stale: '',
        uri: null,
        name: null
      }
      console.log(f.id, state.status.active.id)
      emitter.emit('state:composer:update', contents)
    }
  }

  function close() {
    let contents = {
      id: '',
      body: '',
      stale: '',
      uri: null,
      name: null
    }

    state.status.modified = false
    state.status.active = { }
    state.menu.save = false
    state.menu.revert = false
    state.menu.close = false
    state.menu.export = false
    state.menu.print = false 
    state.menu.preview = false
    state.menu.trashCurrent = false
    emitter.emit('state:menu:update')
    emitter.emit('state:composer:update', contents)
  }

  function revert() {
    let contents = {
      id: state.composer.id,
      body: state.composer.stale,
      stale: state.composer.stale,
      uri: state.composer.uri,
      name: state.composer.name
    }
    emitter.emit('state:menu:update')
    emitter.emit('state:composer:update', contents)
  }

  function prepareToRevert() {
    ipcRenderer.send('dialog:new', {
      type: 'question',
      buttons: ['Revert', 'Cancel'],
      defaultId: 0,
      cancelId: 1,
      message: 'Are you sure you want to revert ' + state.composer.name + '?',
      detail: 'Your changes will be permanently lost if you choose to revert them.'
    })
    ipcRenderer.once('dialog:response', (event, res) => {
      switch (res) {
        case 1:
          // cancel
        break
        default:
          revert()
        break
      }
    })
  }

  function prepareToClose() {
    if (state.status.modified) {
      ipcRenderer.send('dialog:new', {
        type: 'question',
        buttons: ['Save', 'Cancel', 'Discard changes'],
        defaultId: 0,
        cancelId: 1,
        message: state.composer.title + ' has been modified. Save changes?',
        detail: 'Your changes will be lost if you choose to discard them.'
      })
      ipcRenderer.once('dialog:response', (event, res) => {
        switch (res) {
          case 1:
            // cancel
          break
          case 2:
            // Discard changes
            close()
          break
          default:
            if (!state.status.wrting) {
              emitter.emit('state:composer:write', 'close')
            } else return
          break
        }
      })
    } else {
      close()
    }
  }

  function prepareToMake(type) {
    if (type === 'file') write('new')
    else mk()
  }
 
  function prepareToRead(f) {
    if (state.status.modified) {
      ipcRenderer.send('dialog:new', {
        type: 'question',
        buttons: ['Save', 'Cancel', 'Discard changes'],
        defaultId: 0,
        cancelId: 1,
        message: state.composer.title + ' has been modified. Save changes?',
        detail: 'Your changes will be lost if you choose to discard them.'
      })
      ipcRenderer.once('dialog:response', (event, res) => {
        switch (res) {
          case 1:
            // cancel
          break
          case 2:
            // Discard changes
            read(f)
          break
          default:
            if (!state.status.wrting) {
              emitter.emit('state:composer:write', 'next')
            } else return
          break
        }
      })
    } else read(f)
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
    state.sidebar.visible = !state.sidebar.visible
    state.menu.library = !state.menu.library
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
  ipcRenderer.on('menu:file:new:file', (event, response) => {
    emitter.emit('state:item:make', 'file')
  })  

  ipcRenderer.on('menu:file:new:dir', (event, response) => {
    emitter.emit('state:item:make', 'directory')
  })  
  ipcRenderer.on('menu:file:new:window', (event, response) => {
    ipcRenderer.send('window:open', 'main')
  })

  ipcRenderer.on('menu:file:save', (event, response) => {
    emitter.emit('state:composer:write')
  })
  ipcRenderer.on('menu:file:close', (event, response) => {
    emitter.emit('state:composer:close')
  })
  ipcRenderer.on('menu:file:revert', (event, response) => {
    emitter.emit('state:composer:revert')
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
  ipcRenderer.on('menu:help:support', (event, response) => {
    emitter.emit('state:toolbar:report')
  })
  ipcRenderer.on('menu:context:reveal', (event, response) => {
    emitter.emit('state:contextmenu:reveal', state.status.focus.uri)
  })

  // Keyboard navigation
}
