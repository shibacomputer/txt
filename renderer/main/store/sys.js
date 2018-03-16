module.exports = store

const { ipcRenderer } = require('electron')
const io = require('../../_utils/io')
const crypto = require('../../_utils/crypto')
const { parse } = require('path')

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
      emitter.on('state:composer:revert', revert)
      emitter.on('state:library:list', list)
      emitter.on('state:library:select', select)
      emitter.on('state:library:rename:start', rename)
      emitter.on('state:library:rename:end', finishRename)
      emitter.on('state:library:trash', trash)
      emitter.on('state:library:set:active', setActive)
      emitter.on('state:library:set:rename', setRename)
      emitter.on('state:library:open:directory', ls)
      emitter.on('state:library:open:file', open)
      emitter.on('state:library:read:file', read)
      emitter.on('state:library:write:file', commit)
      emitter.on('state:library:write:directory', mkdir)
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
    state.data.ui.sidebar.renamingId = ''
    emitter.emit(state.events.RENDER)
  }

  /**
   * Update the UI with the to-be-renamed cell.
   * @param cell The cell metadata for the cell you want to rename.
   * */
  function rename(cell) {
    if (!state.data.ui.sidebar.renamingId) {
      state.data.ui.sidebar.renamingId = cell.id
      emitter.emit(state.events.RENDER)
    }
  }

  /**
   * Write the new name to disk.
   * @param uri The target resource.
   * @param targetUri The new name, supplied by the UI.
   * */
  function finishRename(f) {
    var newUri = parse(f.uri).dir + '/' + f.newUri
    if (f.uri != newUri) {
      console.log('Checking existing resource...')
      io.exists(f.uri, (err, status) => {
        console.log('starting move')
        io.mv(f.uri, newUri, (err, status) => {
          state.data.ui.sidebar.renamingId = ''
          emitter.emit('state:library:list')
        })
      })
    }
    state.data.ui.sidebar.renamingId = ''
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
        state.data.ui.sidebar.renamingId = ''
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
    state.data.ui.sidebar.renamingId = ''
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

  /**
   * Tell the composer that the save is complete and ensures that the editor
   * returns to a saved and unmodified state.
   * @param contents An object that contains the current and stale text.
   * */
  function save(contents) {
    state.data.text.body = contents.body
    state.data.text.stale = contents.body
    state.data.modified = false
    state.data.writing = false
    ipcRenderer.send('menu:enable:save', false)
    emitter.emit(state.events.RENDER)
  }

  /**
   * Make a directory, using the sidebar to create the desired uri.
   * */
  function mkdir() {
    console.log('Attempting to make ', uri)
    var focus = state.data.ui.sidebar.focusUri
    var uri = focus? focus + '/New folder' : state.data.prefs.app.path + '/New folder'
    io.exists(uri, (exists) => {
      // @TODO: Make sure this doesn't return true when there are
      // permission issues.
      if (exists) ipcRenderer.send('dialog:new:error')
      else {
        io.mkdir(uri, (err, status) => {
          if (err) ipcRenderer.send('dialog:new:error')
          else {
            emitter.emit('state:library:list')
          }
        })
      }
    })
  }

  /**
   * Trash a resource using the sidebar to create the desired uri.
   * */
  function trash() {
    var focus = state.data.ui.sidebar.focusUri
    if (focus) ipcRenderer.send('dialog:new', {
      type: 'question',
      buttons: ['Trash', 'Cancel'],
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
            if (err) ipcRenderer.send('dialog:new:error')
            else {
              state.data.ui.sidebar.focusId = ''
              state.data.ui.sidebar.focusUri = ''
              emitter.emit('state:library:list')
            }
          })
         break
       }
     })
  }

  /**
   * Discard unsaved changes, using the editor state to
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
          var contents = state.data.text
          contents.body = contents.stale
          save(contents)
         break
       }
     })
  }

  /**
   * Sets the active resource, based on a unique identifier.
   * @param id A unique identifier generated via the filesystem.
   * */
  function setActive(id) {
    state.data.ui.sidebar.activeId = id
  }

  /**
   * Sets the renaming resource, based on a unique identifier.
   * @param id A unique identifier generated via the filesystem.
   * */
  function setRename(id) {
    state.data.ui.sidebar.renamingId = id
  }

  // Main Events
  ipcRenderer.on('menu:file:new:file', (event, response) => {
    var focus = state.data.ui.sidebar.focusUri
    // @TODO: Abstract this into an init function
    var snapshot = {
      body: '',
      id: null,
      path: focus? focus + '/Untitled.gpg' : state.data.prefs.app.path + '/Untitled.gpg',
      stale: '',
      title: 'Untitled',
      isNew: true
    }
    emitter.emit('state:library:write:file', snapshot)
  })

  ipcRenderer.on('menu:file:new:dir', (event, response) => {
    emitter.emit('state:library:write:directory')
  })

  ipcRenderer.on('menu:file:save', (event, response) => {
    var snapshot = state.data.text
    console.log(snapshot)
    emitter.emit('state:library:write:file', snapshot)
  })
  ipcRenderer.on('menu:file:revert', (event, response) => {
    var snapshot = state.data.text
    console.log(snapshot)
    emitter.emit('state:composer:revert')
  })
  ipcRenderer.on('menu:file:trash', (event, response) => {
    emitter.emit('state:library:trash')
  })
}
