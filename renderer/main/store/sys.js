module.exports = store

const { ipcRenderer } = require('electron')
const { join, parse } = require('path')
const chokidar = require('chokidar')

const Mousetrap = require('mousetrap')

const io = require('../../_utils/io')
const pgp = require('../../_utils/crypto')

const polyglot = require('../../_utils/i18n/i18n')
const i18n = polyglot.init(window.navigator.language)

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
      emitter.on('state:library:reveal', revealInBrowser)

      emitter.on('state:item:rename', startRename)
      emitter.on('state:item:commit', commitRename)
      emitter.on('state:item:make', prepareToMake)
      emitter.on('state:item:trash', prepareToTrash)
      emitter.on('state:item:read', prepareToRead)
      emitter.on('state:item:export', prepareToExport)
      
      // emitter.on('state:composer:new', compose)
      emitter.on('state:composer:update', update)
      emitter.on('state:composer:write', write)
      emitter.on('state:composer:revert', prepareToRevert)
      emitter.on('state:composer:close', prepareToClose)

      // emitter.on('state:composer:toolbar:report', report)
      
      emitter.on('state:modal:show', showModal)
      emitter.emit('state:init', value)
    })
  })

  /**
   * Initialises the system state for the main window. This function gets its
   * arguments via the main process, and doesn't take any local arguments.
   * This will only run when there is no state persistence.
   * */
  async function init(value) {
    if (!state.lib) {
      state.unlocked = false
      state.prefs = value
      state.uifocus = null
      state.status = {
        modified: false,
        writing: false,
        reading: false,
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
    }
    if (state.prefs) {
      emitter.emit('state:key:init')

      try {
        await list(state.prefs.app.path, true)
      } catch (e) {
        console.log(e)
      }
      initWatcher(state.prefs.app.path)
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

    var watcher = chokidar.watch(join(state.prefs.app.path, '/**/*'), {
      ignored: /(^|[\/\\])\../,
      persistent: true
    });

    watcher.on('ready', function () {
      // do stuff
    })

    watcher.on('change', function () {
      emitter.emit('state:library:list', state.prefs.app.path, true)
    })

    watcher.on('add', function () {
      emitter.emit('state:library:list', state.prefs.app.path, true)
    })

    watcher.on('addDir', function () {
      emitter.emit('state:library:list', state.prefs.app.path, true)
    })

    watcher.on('unlinkDir', function () {
      emitter.emit('state:library:list', state.prefs.app.path, true)
    })

    watcher.on('unlink', function () {
      emitter.emit('state:library:list', state.prefs.app.path, true)
    })
    /*
    let watcher = watch(uri, { recursive: true, persistent: true })
    watcher.on('change', (event, name) => {
      // @TODO: Make this more granular
      emitter.emit('state:library:list', state.prefs.app.path, true)
    })
    */
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
    let base

    if (d.uri) {
      let index = state.sidebar.openDirs.indexOf(d.id)
      base = index === -1? parse(d.uri).dir : d.uri
    } else base = state.prefs.app.path
    
    let uri = join(base, 'New Folder')
    try {
      io.mkdir(uri)
    } catch (e) {
      console.log(e)
    }
  }

  async function write(type) {
    state.writing = true
    let ciphertext
    let c = type === 'new'?  '' : state.composer.body
    
    try {
      ciphertext = await pgp.encrypt(c)
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
    state.status.modified = false 
    console.log(state.composer)
    state.writing = false
    
    switch (type) {
      case 'new':
        let d = { uri: uri }
        if (!state.status.active) emitter.emit('state:item:read', d)
      break

      case 'next':
        if (state.status.active) await close()
        emitter.emit('state:item:read', state.status.focus)
      break

      case 'close':
        await close()
      break

      default:
        state.composer.stale = state.composer.body
      break
    }
  }

  async function read(f) {
    state.status.reading = true
    emitter.emit(state.events.RENDER)
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
    state.status.reading = false
    state.menu.close = true
    state.menu.print = true
    state.menu.export = true
    emitter.emit('state:menu:update')
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
    }
    else {
      state.status.modified = false
      state.menu.save = false
      state.menu.revert = false
    }
    emitter.emit('state:menu:update')
    emitter.emit(state.events.RENDER)
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
      state.composer.uri = newUri
      state.composer.name = parse(state.composer.uri).name
      state.status.active.uri = state.composer.uri
      emitter.emit(state.events.RENDER)
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
    if (f.id === state.status.active.id) close()
    let index = state.sidebar.openDirs.indexOf(f.id)
    if (index === -1) state.sidebar.openDirs.splice(index, 1)
  }

  async function close() {
    let contents = {
      id: '',
      body: '',
      stale: '',
      uri: null,
      name: null
    }
    emitter.emit('state:composer:update', contents)
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
      buttons: [ i18n.t('verbs.revert'), i18n.t('verbs.cancel') ],
      defaultId: 0,
      cancelId: 1,
      message: i18n.t('dialogs.revertFile.title', {name: state.composer.name}),
      detail: i18n.t('dialogs.revertFile.detail')
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
        buttons: [ i18n.t('verbs.save'), i18n.t('verbs.cancel'), i18n.t('verbs.discard') ],
        defaultId: 0,
        cancelId: 1,
        message: i18n.t('dialogs.modifiedFile.title', {name: state.composer.name}),
        detail: i18n.t('dialogs.modifiedFile.detail')
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
        buttons: [ i18n.t('verbs.save'), i18n.t('verbs.cancel'), i18n.t('verbs.discard') ],
        defaultId: 0,
        cancelId: 1,
        message: i18n.t('dialogs.modifiedFile.title', {name: state.composer.name}),
        detail: i18n.t('dialogs.modifiedFile.detail')
      })
      ipcRenderer.once('dialog:response', (event, res) => {
        switch (res) {
          case 1:
            // cancel
          break
          case 2:
            // Discard changes
            close()
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
      buttons: [ i18n.t('verbs.trash'), i18n.t('verbs.cancel')],
      defaultId: 0,
      cancelId: 1,
      message: i18n.t('dialogs.trashItem.title', { name: parse(focus).name} ),
      detail: i18n.t('dialogs.trashItem.detail')
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

  function prepareToExport(type) {
    emitter.emit('state:ui:focus', 'blur', true)
    f = state.composer
    
    window.setTimeout(() => {
      switch (type) {
        case 'plaintext':
          prepareToExportToDisk(f, state.composer.stale)
        break
        case 'encrypted':
          prepareToEncryptWithPassword(f)
        break
        case 'pdf':
          prepareToExportPDF(f)
        break
        case 'arena':
          prepareToExportArena(f)
        break
      }
    }, 100)
  }



  async function prepareToEncryptWithPassword(f) {
    
  }

  function prepareToExportToDisk(f, data) {
    ipcRenderer.send('dialog:new:save', {
      title: i18n.t('dialogs.exportPlainText.title', {name: f.name}),
      buttonLabel: i18n.t('verbs.export'),
      filter: { name: 'Text', extensions: ['txt', 'md'] },
      filename: f.name + '.txt'
    })
    ipcRenderer.once('dialog:response', (event, res) => {
      if (!res) return
      exportFile(res, data, 'plaintext')
    })
  }

  async function exportFile(uri, data, type) {
    await io.write(uri, data)
    ipcRenderer.send('notification:new', {
      title: i18n.t('notifications.exportedFile.title', { filename: state.composer.name, type:type }),
      body: i18n.t('notifications.exportedFile.body'),
      silent: true,
      next: { event: 'state:library:reveal', args: uri }
    })
    emitter.emit('state:ui:focus', 'focus', true)
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

  function updateFocus(newFocus, reload) {
    if (state.uifocus === newFocus) return
    else {
      state.uifocus = newFocus
      if (reload) {
        emitter.emit(state.events.RENDER)
      }
    }
  }

  function showModal(type) {
    emitter.emit('state:ui:focus', 'modal', true)
    window.setTimeout(() => {
      ipcRenderer.send('modal:new', type)
    }, 100) 
  }

  function revealInBrowser(uri) {
    require('electron').shell.showItemInFolder(uri)
  }

  // Out
  function newContextMenu(type) {
    ipcRenderer.send('menu:context:new', type)
  }

  function updateApplicationMenu() {
    ipcRenderer.send('menu:new', 'main', state.menu)
  }

  ipcRenderer.on("window:event:blur", (event) => {
    emitter.emit('state:ui:focus', 'blur', true)
  })

  ipcRenderer.on("window:event:focus", (event) => {
    if (state.uifocus !== 'modal') emitter.emit('state:ui:focus', 'general', true)
  })

  ipcRenderer.on("window:event:fullscreen", (event, arg) => {
    state.status.fullscreen = arg
    emitter.emit(state.events.RENDER)
  })

  ipcRenderer.on('window:event:quit', (event) => {
    // Close logic here
  })

  ipcRenderer.on('app:event:quit', (event) => {
    // App close logic
  })

  // Responses to the menu system
  ipcRenderer.on('menu:about:prefs', (event) => {
    emitter.emit('state:modal:show', 'prefs')
  })

  ipcRenderer.on('menu:file:new:file', (event) => {
    emitter.emit('state:item:make', 'file')
  })

  ipcRenderer.on('menu:file:new:dir', (event) => {
    emitter.emit('state:item:make', 'directory')
  })  

  ipcRenderer.on('menu:file:new:window', (event) => {
    ipcRenderer.send('window:open', 'main')
  })

  ipcRenderer.on('menu:file:save', (event) => {
    emitter.emit('state:composer:write')
  })

  ipcRenderer.on('menu:file:close', (event) => {
    emitter.emit('state:composer:close')
  })

  ipcRenderer.on('menu:file:revert', (event) => {
    emitter.emit('state:composer:revert')
  })

  ipcRenderer.on('menu:file:rename', (event) => {
    emitter.emit('state:item:rename')
  })

  ipcRenderer.on('menu:file:export', (event, arg) => {
    emitter.emit('state:item:export', arg)
  })

  ipcRenderer.on('menu:file:trash', (event) => {
    emitter.emit('state:item:trash')
  })  

  ipcRenderer.on('menu:view:library', (event) => {
    emitter.emit('state:library:toggle')
  })

  ipcRenderer.on('menu:help:support', (event) => {
    emitter.emit('state:toolbar:report')
  })

  ipcRenderer.on('menu:context:reveal', (event) => {
    emitter.emit('state:library:reveal', state.status.focus.uri)
  })

  ipcRenderer.on('notification:clicked', (event, next) => {
    emitter.emit(next.event, next.args)
  })

  // Keyboard navigation
}
