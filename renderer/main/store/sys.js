module.exports = store

const { ipcRenderer } = require('electron')
const { join, parse } = require('path')

const Mousetrap = require('mousetrap')

const io = require('../../_utils/io')
const crypto = require('../../_utils/crypto')

const APP_ID = 'Txt'
const KEY_DEFAULT = '.txtkey'

function store (state, emitter) {

  emitter.on('DOMContentLoaded', () => {

    ipcRenderer.send('get:allPref')
    ipcRenderer.once('done:getPref', (event, key, value) => {

      emitter.on('state:init', init)

      emitter.on('state:menu:update', updateMenu)

      emitter.on('state:composer:new', compose)
      emitter.on('state:composer:update', update)
      // emitter.on('state:composer:revert', revert)
      // emitter.on('state:composer:close', close)

      // emitter.on('state:composer:toolbar:report', report)

      // emitter.on('state:library:toggle', toggleLibrary)
      emitter.on('state:library:list', list)
      emitter.on('state:library:select', select)
      emitter.on('state:library:rename:start', startRename)
      emitter.on('state:library:rename:commit', commitRename)
      emitter.on('state:library:trash', trash)
      // emitter.on('state:library:set:active', setActive)
      emitter.on('state:library:open:directory', ls)
      // emitter.on('state:library:open:file', open)
      // emitter.on('state:library:read:file', read)
      emitter.on('state:library:write:file', commit)
      emitter.on('state:library:write:directory', mkdir)
      emitter.on('state:library:context:display', displayContext)
      emitter.on('state:library:reveal', reveal)

      emitter.on('state:key:get', getKey)
      emitter.on('state:key:import', addKey)
      emitter.on('state:error', sendError)

      emitter.emit('state:init', value)
    })
  })

  /**
   * Initialises the system state for the main window. This function gets its
   * arguments via the main process, and doesn't take any local arguments.
   * This will only run when there is no state persistence.
   * */
  function init(value) {
    state.unlocked = true
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
      emitter.emit('state:library:list')
      emitter.emit('state:key:get')
    }
  }

  /**
   * Get the library path and list it.
   * TODO: Compare the old tree to the new tree to prevent re-rendering.
   * */
  function list() {
    state.status.listing = true
    io.ls(state.prefs.app.path, (err, tree) => {
      if (err) emitter.emit('state:error', err)
      else {
        state.lib = tree
        emitter.emit('state:menu:update')
        state.status.listing = false
        emitter.emit(state.events.RENDER)
      }
    })
  }

  /**
   * Add or remove a directory to the collection of open directories.
   * @param d The directory you are interacting with.
   * */
  function ls(d) {
    state.status.listing = true
    io.exists(d.uri, (exists) => {
      if (!exists) {
        state.status.listing = false
        emitter.emit('state:error', err)
      } else {
        emitter.emit('state:library:rename:commit') // Empty commit
        state.status.renaming = false
        var index = state.sidebar.openDirs.indexOf(d.id)
        if (index === -1) state.sidebar.openDirs.push(d.id)
        else state.sidebar.openDirs.splice(index, 1)
        state.status.listing = false
        emitter.emit(state.events.RENDER)
      }
    })
  }

  /**
   * Make a directory, using the sidebar to create the desired uri.
   * */
  function mkdir(base, name, modifier, block) {
    state.status.writing = true
    modifier = typeof modifier !== 'undefined' ? modifier : 0
    console.log('mkdir: ', base, name, modifier, block)

    // Get the uri
    if (!base) var base = state.status.focus.uri ? state.status.focus.uri : state.prefs.app.path

    // Get the desired name
    if (!name) var name = 'New folder'

    // Start building the uri
    var uri = parse(base).ext? parse(base).dir : base
    uri = uri + '/' + name
    if (modifier) uri = uri + ' ' + modifier.toString()

    io.exists(uri, (exists) => {
      if (exists) {
        if (!block) {
          var newMod = modifier + 1
          console.log('mkdir:retry: ', base, name, newMod, block)
          mkdir(base, name, newMod, false)
        } else {
          state.status.writing = false
          emitter.emit('state:error')
        }
      }
      else {
        io.mkdir(uri, (err, status) => {
          state.status.writing = false
          if (err) {
            emitter.emit('state:error')
          }
          else {
            var index = state.sidebar.openDirs.indexOf(state.status.focus.id)
            if (state.status.focus.type === 'directory' && index === -1)  {
              emitter.emit('state:library:open:directory', state.status.focus)
            }

            emitter.emit('state:library:list')
          }
        })
      }
    })
  }

  /**
   * Update the UI with the user-selected cell.
   * @param f The metadata for the new selected item.
   * */
  function select(f) {
    if (state.status.renaming) return
    state.status.focus = f
    state.menu.trash = true
    state.menu.rename = true
    emitter.emit('state:menu:update')
    emitter.emit(state.events.RENDER)
  }

  /**
   * Update the UI with the to-be-renamed cell.
   * */
  function startRename() {
    if (!state.status.focus.id || state.status.renaming) return
    state.status.renaming = true
    emitter.emit(state.events.RENDER)
  }

  /**
   * Prepare the new renamed item.
   * */
  function commitRename(f, commit) {
    if (!commit || !state.status.focus) {
      state.status.renaming = false
      emitter.emit(state.events.RENDER)
      return
    }
    f.newUri = parse(f.uri).dir + '/' + f.newUri
    if (f.uri != f.newUri) {
      io.exists(f.newUri, (exists) => {
        if (!exists) {
          io.mv(f.uri, f.newUri, (err, status) => {
            state.status.renaming = false

            // Capture the snapshot
            var snapshot = state.composer
            snapshot.uri = f.newUri
            emitter.emit('state:composer:update', snapshot)
            emitter.emit('state:library:list')
          })
        } else {
          emitter.emit('state:error', err)
        }
      })
    } else {
      state.status.renaming = false
      emitter.emit(state.events.RENDER)
    }
  }

  /**
   * Prepares to open a file, but checks for unsaved changes first.
   * @param f The target file you wish to open.
   * */
  function open(f) {
    // Prevent opening files repeatedly
    if (state.status.active.id === f.id
      || state.status.writing
      || state.status.renaming) return
    if (state.status.modified) {
      state.status.writing = true
      ipcRenderer.send('dialog:new', {
        type: 'question',
        buttons: ['Save', 'Cancel', 'Discard changes'],
        defaultId: 0,
        cancelId: 1,
        message: state.composer.title + ' has been modified. Save changes?',
        detail: 'Your changes will be lost if you choose to discard them.'
      })
    } else {
      emitter.emit('state:library:read:file', f)
    }
    ipcRenderer.once('dialog:response', (event, res) => {
      switch (res) {
        case 1:
         // cancel
         break
        case 2:
         // Discard changes
         state.status.writing = false
         emitter.emit('state:library:read:file', f)
         break
        default:
         if (!state.status.wrting) {
           var snapshot = state.composer
           snapshot.next = f
           console.log('WRITING, ', snapshot)
           emitter.emit('state:library:write:file', snapshot)
         } else return
         break
       }
    })
  }

  function close() {
    state.menu.close = false
    state.menu.revert = false
    state.menu.export = false
    state.menu.print = false
    state.menu.preview = false
    state.menu.close = false
    emitter.emit('state:menu:update')
  }

  /**
   * Discard unsaved changes, using the editor state to reset everything.
   * */
  function revert() {
    ipcRenderer.send('dialog:new', {
      type: 'question',
      buttons: ['Revert changes', 'Cancel'],
      defaultId: 0,
      cancelId: 1,
      message: 'Revert your changes?',
      detail: 'Changes prior to your last save will be lost. This action cannot be undone.'
    })

    ipcRenderer.once('dialog:response', (event, res) => {
      switch (res) {
        case 1:
         // cancel
         break
        default:
          var contents = state.composer.text
          contents.body = contents.stale
          state.menu.revert = false
          emitter.emit('state:menu:update')
          save(contents)
         break
       }
     })
  }


  /**
   * Create a new resource.
   * */
  function compose() {
    var target = state.status.focus.uri
    if (!target) target = state.prefs.app.path
    else parse(target).ext? target = parse(target).dir.toString() : target = target
    console.log('TARGET IS: ', target)

    // @TODO: Abstract this into an init function
    var snapshot = {
      body: '',
      id: null,
      uri: target + '/Untitled.gpg',
      stale: '',
      title: 'Untitled',
      isNew: true
    }
    emitter.emit('state:library:write:file', snapshot)
  }

  /**
   * Update the editor. This is called both when interacting with the editor,
   * and also loading new files.
   * @param contents An object that contains the current and stale text.
   * */
  function update(contents) {
    console.log('updating with, ', contents)
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

  /**
   * Asynchrounously encrypt and commit the current snapshot to disk,
   * @param snapshot An object that contains the current editor snapshot.
   * */
  function commit(snapshot) {
    if (state.prefs.encryption.useKeychain) {
      crypto.readKeychain(APP_ID, state.prefs.author.name, (err, secret) => {
        if (err) emitter.emit('state:error', err)
        else {
          crypto.encrypt(state.key, secret, {encoding: 'binary', filename: snapshot.title, contents: snapshot.body}, (err, ciphertext) => {
            if (err) emitter.emit('state:error', err)
            else {
              io.write(snapshot.uri, ciphertext, (err, status) => {
                state.status.writing = false
                save(snapshot)

                if (snapshot.isNew) emitter.emit('state:library:list')
                else if (snapshot.next) emitter.emit('state:library:read:file', snapshot.next)
              })
            }
          })
        }
      })
    }
  }


  /**
   * Tell the composer that the save is complete and ensures that the editor
   * returns to a saved and unmodified state.
   * @param contents An object that contains the current and stale text.
   * */
  function save(contents) {
    state.composer.body = contents.body
    state.composer.stale = contents.body
    state.status.modified = false
    state.status.writing = false
    state.menu.save = false
    state.menu.revert = false
    emitter.emit('state:menu:update')
    emitter.emit(state.events.RENDER)
  }

  /**
   * Trash a resource using the sidebar to create the desired uri.
   * */
  function trash() {
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
          io.trash(focus, (err, status) => {
            if (err) emitter.emit('state:error', err)
            else {
              if (state.composer.uri === focus) {
                var snapshot = {
                  id: '',
                  body: '',
                  stale: '',
                  uri: null,
                  title: '',
                }
                state.status.active = { }
                emitter.emit('state:composer:update', snapshot)
              }
              var index = state.sidebar.openDirs.indexOf(state.status.focus.id)
              if (state.status.focus.type === 'directory' && index != -1)  {
                state.sidebar.openDirs.splice(index, 1)
              }
              state.status.focus = { }
              state.menu.trash = false
              state.menu.rename = false
              emitter.emit('state:menu:update')
              emitter.emit('state:library:list')
            }
          })
         break
       }
     })
  }

  function reveal(uri) {
    require('electron').shell.showItemInFolder(uri)
  }

  function addKey() {
    crypto.getKey( (newKeys) => {
      console.log('KEYS ', newKeys)
      state.key = newKeys
      console.log('KEYS IN THE STATE !,' , state.key)
      emitter.emit(state.events.RENDER)
    })
  }
  /**
   * Trash a resource using the sidebar to create the desired uri.
   * */
  function getKey() {
    crypto.testForKey( (result) => {
      if (result) emitter.emit('state:key:import')
      else {
        if (state.lib) importKeyFromDisk()
      }
    })
  }

  function importKeyFromDisk() {
    var keyUri = join(state.lib.uri + '/' + KEY_DEFAULT)
    io.open(keyUri, (err, data) => {
      if (err) emitter.emit('state:error', err)
      else {
        var key = JSON.parse(data.toString('utf8'))
        if (state.prefs.encryption.useKeychain) {
          crypto.readKeychain(APP_ID, state.prefs.author.name, (err, secret) => {
            if (err) emitter.emit('state:error', err)
            else {
              crypto.importKey(key, secret, (result) => {
                if (result === true) {
                  emitter.emit('state:key:import')
                }
                else emitter.emit('state:error', err)
              })
            }
          })
        } else {
          // TODO: Ask for passphrase.
        }
      }
    })
  }


  // Interacting with Main.
  function sendError(error) {
    console.log('ui:error: ', error)
    ipcRenderer.send('dialog:new:error', error)
    ipcRenderer.once('dialog:response', (event, res) => {
      switch (res) {
        case 2:
          require('electron').shell.openExternal('https://txtapp.io/support')
          break
        default:
          break
      }
    })
  }


  // Out
  function displayContext(type) {
    ipcRenderer.send('menu:context:new', type)
  }

  function updateMenu() {
    ipcRenderer.send('menu:new', 'main', state.menu)
  }

  // In
  ipcRenderer.on('menu:file:new:file', (event, response) => {
    emitter.emit('state:composer:new')
  })
  ipcRenderer.on('menu:file:new:dir', (event, response) => {
    emitter.emit('state:library:write:directory')
  })
  ipcRenderer.on('menu:file:save', (event, response) => {
    var snapshot = state.composer
    console.log(snapshot)
    emitter.emit('state:library:write:file', snapshot)
  })
  ipcRenderer.on('menu:file:rename', (event, response) => {
    emitter.emit('state:library:rename:start')
  })

  ipcRenderer.on('menu:file:close', (event, response) => {
    var snapshot = {
      id: '',
      body: '',
      stale: '',
      uri: null,
      title: '',
    }
    emitter.emit('state:composer:update', snapshot)
  })
  ipcRenderer.on('menu:file:revert', (event, response) => {
    var snapshot = state.composer.text
    console.log(snapshot)
    emitter.emit('state:composer:revert')
  })
  ipcRenderer.on('menu:file:trash', (event, response) => {
    emitter.emit('state:library:trash')
  })
  ipcRenderer.on('menu:view:library', (event, response) => {
    emitter.emit('state:library:toggle')
  })
  ipcRenderer.on('menu:help:support', (event, response) => {
    emitter.emit('state:composer:toolbar:report')
  })
  ipcRenderer.on('sys:focus', (event, response) => {
    if (state.prefs.app.path) emitter.emit('state:library:list')
  })
  ipcRenderer.on('menu:context:reveal', (event, response) => {
    emitter.emit('state:library:reveal', state.status.focus.uri)
  })

  ipcRenderer.on('menu:context:reveal:library', (event, response) => {
    emitter.emit('state:library:reveal', state.prefs.lib.uri)
  })
}
