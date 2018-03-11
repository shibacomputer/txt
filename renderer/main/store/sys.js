module.exports = store

const { ipcRenderer } = require('electron')
const io = require('../../_utils/io')
const crypto = require('../../_utils/crypto')

const appId = 'Txt'

function store (state, emitter) {
  init()

  /**
   * Initialises the system state for the main window. This function gets its
   * arguments via the main process, and doesn't take any local arguments.
   * This will only run when there is no state persistence.
   * */
  function init() {
    emitter.on('DOMContentLoaded', function () {
      emitter.on('state:init', init)
      emitter.on('state:composer:update', update)
      emitter.on('state:library:list', list)
      emitter.on('state:library:select', select)
      emitter.on('state:library:set:active', setActive)
      emitter.on('state:library:open:directory', ls)
      emitter.on('state:library:open:file', open)
      emitter.on('state:library:read:file', read)
      emitter.on('state:library:write:file', commit)
    })

    ipcRenderer.send('get:allPref')
    ipcRenderer.once('done:getPref', (event, key, value) => {
      state.data = {
        modified: false,
        writing: false,
        fullscreen: false,
        prefs: value,
        text: {
          id: '',
          body: '',
          stale: '',
          path: null,
          title: 'Untitled',
        },
        lib: { },
        ui: {
          sidebar: {
            editingId: '',
            renamingId: '',
            activeId: '',
            focusId: '',
            focusUri: '',
            openDirs: []
          }
        }
      }
      list()
    })
  }

  /**
   * Get the library path and list it.
   * */
  function list() {
    io.ls(state.data.prefs.app.path, (err, tree) => {
      if (err) ipcRenderer.send('dialog:new:error')
      else state.data.lib = tree
      emitter.emit(state.events.RENDER)
    })
  }

  /**
   * Update the UI with the user-selected cell.
   * @param cell The cell metadata for the new selected item.
   * */
  function select(cell) {
    state.data.ui.sidebar.focusId = cell.id
    state.data.ui.sidebar.focusUri = cell.uri
    emitter.emit(state.events.RENDER)
  }

  /**
   * Add or remove a directory to the collection of open directories.
   * @param d The directory you are interacting with.
   * */
  function ls(d) {
    io.exists(d.uri, (exists) => {
      if (exists) {
        var exists = state.data.ui.sidebar.openDirs.indexOf(d.id)
        if (exists === -1) state.data.ui.sidebar.openDirs.push(d.id)
        else state.data.ui.sidebar.openDirs.splice(exists, 1)
        emitter.emit(state.events.RENDER)
      }
    })
  }

  /**
   * Prepares to open a file, but checks for unsaved changes first.
   * @param f The target file you wish to open.
   * */
  function open(f) {
    // Prevent opening files repeatedly
    if (state.data.ui.sidebar.activeId === f.id || state.data.writing) return
    if (state.data.modified) {
      state.data.writing = true
      ipcRenderer.send('dialog:new', {
        type: 'question',
        buttons: ['Save', 'Cancel', 'Discard changes'],
        defaultId: 0,
        cancelId: 1,
        message: state.data.text.title + ' has been modified. Save changes?',
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
         state.data.writing = false
         emitter.emit('state:library:read:file', f)
         break
        default:
         if (!state.data.wrting) {
           var snapshot = state.data.text
           snapshot.next = f
           console.log('WRITING, ', snapshot)
           emitter.emit('state:library:write:file', snapshot)
         } else return
         break
       }
    })
  }

  /**
   * Reads a file.
   * @param f The target file object you wish to open.
   * */
  function read(f) {
    console.log('Reading, ', f)
    io.exists(f.uri, (exists) => {
      if (exists) {
        io.open(f.uri, (err, data) => {
          if (err) ipcRenderer.send('dialog:new:error')
          else {
            if (state.data.prefs.encryption.useKeychain) {
              crypto.readKeychain(appId, 'user', (err, secret) => {
                crypto.decrypt({phrase: secret}, {contents: data, encoding: 'utf8'}, (err, plaintext) => {
                  if (err) ipcRenderer.send('dialog:new:error')
                  else {
                    console.log('decrypted, ', plaintext)
                    var contents = {
                      id: state.data.ui.sidebar.focusId,
                      body: plaintext.data,
                      stale: plaintext.data,
                      title: f.name.replace('.gpg', ''),
                      path: f.uri
                    }
                    emitter.emit('state:composer:update', contents)
                    emitter.emit('state:library:set:active', contents.id)
                  }
                })
              })
            }
          }
        })
      }
    })
  }

  /**
   * Asynchrounously encrypt and commit the current snapshot to disk,
   * @param snapshot An object that contains the current editor snapshot.
   * */
  function commit(snapshot) {
    if (!snapshot.body) return
    if (state.data.prefs.encryption.useKeychain) {
      crypto.readKeychain(appId, 'user', (err, secret) => {
        console.log('About to encrypt: ', snapshot)
        if (err) ipcRenderer.send('dialog:new:error')
        else {
          crypto.encrypt({phrase: secret}, {encoding: 'binary', filename: snapshot.title, contents: snapshot.body}, (err, ciphertext) => {
            if (err) ipcRenderer.send('dialog:new:error')
            else {
              io.write(snapshot.path, ciphertext, (err, status) => {
                state.data.writing = false
                if (err) ipcRenderer.send('dialog:new:error')
                else {
                  save(snapshot)
                  if (snapshot.next) emitter.emit('state:library:read:file', snapshot.next)
                }
              })
            }
          })
        }
      })
    }
  }

  /**
   * Update the editor. This is called both when interacting with the editor,
   * and also loading new files.
   * @param contents An object that contains the current and stale text.
   * */
  function update(contents) {
    console.log('updating with, ', contents)
    state.data.text = contents
    if (state.data.text.body !== state.data.text.stale) {
      state.data.modified = true
      ipcRenderer.send('menu:enable:save', true)
    }
    else {
      state.data.modified = false
      ipcRenderer.send('menu:enable:save', false)
      emitter.emit(state.events.RENDER)
    }
  }

  function save(contents) {
    state.data.text.stale = contents.stale
    state.data.modified = false
    state.data.writing = false
    ipcRenderer.send('menu:enable:save', false)
    emitter.emit(state.events.RENDER)
  }

  /**
   * Sets the active resource, based on a unique identifier.
   * @param id A unique identifier generated via the filesystem.
   * */
  function setActive(id) {
    state.data.ui.sidebar.activeId = id
  }

  // Main Events
  ipcRenderer.on('menu:file:save', (event, response) => {
  })

  ipcRenderer.on('menu:file:new:file', (event, response) => {
    io('file', null)
  })

  ipcRenderer.on('menu:file:new:dir', (event, response) => {
    io('dir', null)
  })
}
