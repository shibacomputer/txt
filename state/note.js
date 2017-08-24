const utils = require('../utils/utils')
const file = require('../utils/files')
const { ipcRenderer } = window.require('electron')

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
    state.note = { }
    state.note.path = null
    state.note.title = null
    state.note.staleBody = null
    state.note.body = null
    state.note.status = { }
    state.note.status.loading = false
    state.note.status.modified = false
    ipcRenderer.send('menu:note:modified', state.note.status.modified)
  }

  function create (note) {
    emitter.emit('log:debug', 'Creating note')
    ipcRenderer.send('menu:note:isNew', true)
  }

  function open (note) {
    emitter.emit('log:debug', 'Opening a note')
    if (note != state.note.path) {
      file.open(note, (n, err) => {
        var url = note.split('/')

        state.note.path = note
        state.note.title = url[url.length-1].replace(/\.[^/.]+$/, "")
        state.note.staleBody = n.data
        state.note.body = state.note.staleBody
        console.log('📄 👀 ', state.note)
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

  function update (note) {
    if (state.note.staleBody != state.note.body) {
      state.note.status.modified = true
      ipcRenderer.send('menu:note:modified', state.note.status.modified)
    }

    state.note.body = note
  }

  function save (note) {
    emitter.emit('log:debug', 'Beginning save process')
    console.log(typeof note != 'object')
    if (!note.status.modified) return  // Don't do redundant work
    file.write(note, (err) => {
      state.note.status.modified = false
      ipcRenderer.send('menu:note:modified', state.note.status.modified)
    })
  }


  // IPC Routes
  ipcRenderer.on('menu:note:save', (event) => {
    emitter.emit('note:save', state.note)
  })

  ipcRenderer.on('menu:note:open', (event, notePath) => {
    emitter.emit('note:open', notePath)
  })

}
