const remote = window.require('electron').remote
const { dialog } = remote.require('electron')
const { ipcRenderer } = window.require('electron')

const path = require('path')
const utils = require('../utils/utils')
const file = require('../utils/files')

module.exports = noteState

function noteState (state, emitter) {
  initNote()

  emitter.on('DOMContentLoaded', function () {
    emitter.emit('log:debug', 'Loading Note Store')

    emitter.on('note:create', create)
    emitter.on('note:open', open)
    emitter.on('note:unload', unload)
    emitter.on('note:update', update)
    emitter.on('note:save', save)
  })

  function initNote() {
    state.note = {
      path: null,
      title: 'Untitled',
      staleBody: '',
      body: '',
      status: {
        loading: false,
        modified: false
      }
    }
    ipcRenderer.send('menu:note:modified', state.note.status.modified)
  }

  function create (note) {
    emitter.emit('log:debug', 'Creating note')
    ipcRenderer.send('menu:note:isNew', true)
  }

  function open (target) {
    emitter.emit('log:debug', 'Opening a note')
    if (target != state.note.path) {
      file.open(target, {
        type: state.key.type
      }, (n, err) => {
        var url = target.split('/')
        var note = {
          path: target,
          title: url[url.length-1].replace(/\.[^/.]+$/, ""), // @TODO: Replace this with better handling
          staleBody: n.data,
          body: n.data,
          status: {
            modified: false,
            loading: false
          }
        }
        state.note = note
        ipcRenderer.send('menu:note:isNew', false)
        emitter.emit('render')
      })
    }
  }

  function unload (note) {
    emitter.emit('log:debug', 'Unloading a note')
    initNote()
    emitter.emit('render')
  }

  function update (body) {
    state.note.body = body
    console.log(state.note.staleBody != state.note.body)
    if (state.note.staleBody != state.note.body) {
      state.note.status.modified = true
      ipcRenderer.send('menu:note:modified', state.note.status.modified)
    }
  }

  function save (note) {
    emitter.emit('log:debug', 'Beginning save process')
    file.write(note, {
      type: state.key.type
    }, (err) => {
      state.note.status.modified = false
      state.note.staleBody = state.note.body
      ipcRenderer.send('menu:note:modified', state.note.status.modified)
    })
  }

  // Helpers
  function getNote() {
    var err = null

    dialog.showOpenDialog({
      title: 'Open File',
      buttonLabel: 'Open',
      properties: ['openFile'],
      filters: [
        { name: 'Encrypted Text', extensions: ['gpg'] }
      ]
    }, (filePath) => {
      if (filePath) {
        // @TODO: Move decryption out of the renderer.
        emitter.emit('note:open', path.normalize(filePath[0]))
      }
    })
  }

  function getNewPath() {
    dialog.showSaveDialog({
      title: 'Save File',
      buttonLabel: 'Save',
      nameFieldLabel: state.note.title,
      filters: [
        { name: 'Encrypted Text', extensions: ['gpg'] }
      ]
    }, (savePath) => {
      if (savePath) {
        // @TODO: Move decryption out of the renderer.
        state.note.path = path.normalize(savePath)
        var title = state.note.path.split('/')
        title = title[title.length-1].replace(/\.[^/.]+$/, "") // @TODO: Replace this with better handling
        state.note.title = title
        emitter.emit('note:save', state.note)
      }
    })

  }

  // IPC Routes
  ipcRenderer.on('menu:note:open', (event) => {
    getNote()
  })

  ipcRenderer.on('menu:note:duplicate', (event) => {
    getNewPath()
  })

  // IPC Routes
  ipcRenderer.on('menu:note:save', (event) => {
    typeof state.note.path === 'string' ? emitter.emit('note:save', state.note) : getNewPath()
  })
}
