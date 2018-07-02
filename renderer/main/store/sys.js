module.exports = store

const { ipcRenderer } = require('electron')
const { join, parse } = require('path')
const chokidar = require('chokidar')
const _ = require('lodash')

const Mousetrap = require('mousetrap')

const io = require('../../_utils/io')
const pgp = require('../../_utils/crypto')

const polyglot = require('../../_utils/i18n/i18n')
const i18n = polyglot.init(window.navigator.language)

function store (state, emitter) {
  if (!state.lib) {
    state.unlocked = false
    state.prefs = { }
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
      rename: false,
      modalIsOpen: false
    }
    state.key = { }
  }
  emitter.on('DOMContentLoaded', () => {

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
    
    emitter.on('state:composer:update', update)
    emitter.on('state:composer:write', write)
    emitter.on('state:composer:revert', prepareToRevert)
    emitter.on('state:composer:close', prepareToClose)
    
    emitter.on('state:modal:show', showModal)

    ipcRenderer.send('pref:get:all')    
    ipcRenderer.once('pref:get:done', (event, key, value) => {
      state.prefs = value
      emitter.emit('state:init', value)
    })
  })

  /**
   * Initialises the system state for the main window. This function gets its
   * arguments via the main process, and doesn't take any local arguments.
   * This will only run when there is no state persistence.
   * */
  async function init(value) {
    if (state.prefs) {
      emitter.emit('state:key:init')
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
      /* TODO: Make this smarter, because right now it's not smart. */
      emitter.emit('state:library:list', state.prefs.app.path, true)
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
      checkExisting(tree)
    }
    else {
      var index = state.sidebar.openDirs.indexOf(d.id)
      if (index === -1) state.sidebar.openDirs.push(d.id)
      else state.sidebar.openDirs.splice(index, 1)
    }
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

  async function write(type, secret, path) {
    state.writing = true
    
    let ciphertext, uri, filename 
    let c = type === 'new'?  '' : state.composer.body

    if (!path) {
      if (type === 'new') {
        let base
        if (state.status.focus.uri) {
          let index = state.sidebar.openDirs.indexOf(state.status.focus.id)
          base = index === -1 ? parse(state.status.focus.uri).dir : state.status.focus.uri
        } else {
          base = state.prefs.app.path
        }
        filename = 'Untitled.gpg'
        uri = join(base, filename)
        
      } else {
        f = state.status.active
        filename = f.name
        uri = f.uri
      } 
    } else {
      uri = path
      f = state.status.active
      filename = f.name
    }

    try {
      ciphertext = await pgp.encrypt(c, filename, (secret? secret : null))
    } catch(e) {
      console.log(e)
      return
    }
    
    let success
    try {
      success = await io.write(uri, ciphertext) 
    } catch (e) {
      console.log(e)
    }

    if (type !== 'export') state.status.modified = false 

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

      case 'export':
        ipcRenderer.send('notification:new', {
          title: i18n.t('notifications.exportedFile.title', { filename: state.composer.name, type:type }),
          body: i18n.t('notifications.exportedFile.body'),
          silent: true,
          next: { event: 'state:library:reveal', args: uri }
        })        
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
    let f = state.composer
    
    window.setTimeout(() => {
      switch (type) {
        case 'arena':
          // prepareToExportArena(f)
        break
        case 'encrypted':
          prepareToEncryptWithPassword()
        break
        default:
          prepareToExportToDisk(f, null, type)
        break
        
      }
    }, 100)
  }

  function prepareToExportToDisk(f, secret, type) {
    let opts
    switch (type) {
      case 'plaintext':
        opts = {
          name: 'Text',
          ext: ['txt', 'md']
        }
      break

      case 'encrypted':
        opts = {
          name: 'Encrypted Text',
          ext: ['gpg']
        }
      break
    }

    ipcRenderer.send('dialog:new:save', {
      title: i18n.t('dialogs.exportPlainText.title', {name: f.name}),
      buttonLabel: i18n.t('verbs.export'),
      filter: opts,
      filename: f.name + '.' + opts.ext[0]
    })
    ipcRenderer.once('dialog:response', (event, res) => {
      if (!res) return
      exportFile(res, f.body, secret, type)
    })
  }

  async function prepareToEncryptWithPassword() {
    emitter.emit('state:modal:show', {
      name: 'lock',
      width: 640, 
      height: 128,
      opts: {
        type: 'new',
        oncancel: 'state:modal:cancelled',
        oncomplete: 'state:modal:complete'
      }
    })
  }

  async function exportFile(uri, data, secret, type) {
    if (secret) {
      data = await pgp.encrypt(data, secret)
    }
    await io.write(uri, data, secret)
    ipcRenderer.send('notification:new', {
      title: i18n.t('notifications.exportedFile.title', { filename: state.composer.name }),
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

  function checkExisting(tree) {
    console.log({tree})
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

  ipcRenderer.on('modal:message', (event, message) => {
    let f = state.composer
    switch (message.type) {
      case ('new'): 
        if (message.secret.length > 0) {
          ipcRenderer.send('modal:parent:response', { success: true })
          window.setTimeout(() => {
            prepareToExportToDisk(f, message.secret, 'encrypted')
          }, 1000)
        } else {
          ipcRenderer.send('modal:parent:response', { success: false })
        }
      break
      case ('validate'):
        console.log('this is validate')
      break
      case ('prefs'):
        // This is a preferences update
        emitter.emit('state:init')
      break
    }
  })

  ipcRenderer.on('modal:closed', (event, message) => {
    console.log(message)
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
