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
    emitter.on('note:close', unload)
    emitter.on('note:update', update)
    emitter.on('note:save', save)
    emitter.on('note:destroy', destroy)
  })

  function initNote() {
    state.note = { }
    state.note.path = null
    state.note.filename = null
    state.note.title = null
    state.note.savedBody = null
    state.note.liveBody = null
    state.note.date = { }
    state.note.date.created = null
    state.note.date.modified = null
    state.note.status = { }
    state.note.status.loading = false
    state.note.status.modified = false
  }

  function create (note) {
    emitter.emit('log:debug', 'Creating note')
  }

  function open (note) {
    emitter.emit('log:debug', 'Opening a note')
    if (note != state.note.path) {
      file.open(note, (n) => {
        var url = note.split('/')

        state.note.path = note
        state.note.filename = url[url.length-1]
        state.note.title = url[url.length-1].replace(/\.[^/.]+$/, "")
        state.note.savedBody = n.data
        state.note.date.created = 'today'
        state.note.date.modified = 'today'
        state.note.status.modified = false
        console.log('📄 👀 ', state.note)

        emitter.emit('render')
      })
    }
  }

  function unload (note) {
    emitter.emit('log:debug', 'Unloading a note')
  }

  function close (note) {
    state.note.status.modified = true
    if (state.note.status.modified === true) {
      console.log('Writing...')
      write(note, (err) => {
        if(!err) {
          console.log('Complete')
          newNote()
        } else {
          throw err
        }
      })
    }
  }

  function save (note) {
    emitter.emit('log:debug', 'Beginning save process')
    if (!note || !note.status.modified) return  // Don't do redundant work
    var date = new Date()
    note.date.modified = date
    file.write(note, (err) => {
      state.note.date.modified = date
      state.note.status.modified = false
    })
  }


  function update (note) {
    if (state.note.liveBody != state.note.savedBody) {
      state.note.status.modified = true
    }
    ipcRenderer.send('menu:note:modified', state.note.status.modified)
    state.note.liveBody = note
  }

  function destroy (note) {
    emitter.emit('log.debug', 'Deleting note')
  }

  // IPC Routes
  ipcRenderer.on('menu:note:save', (event) => {
    emitter.emit('note:save', state.note)
  })

}
