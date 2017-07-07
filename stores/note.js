const utils = require('../utils/utils')
const file = require('../utils/files')

module.exports = noteStore

function noteStore (state, emitter) {
  if (!state.note) {
    initNote()
  }

  emitter.on('DOMContentLoaded', function () {
    emitter.emit('log:debug', 'Loading Note Store')

    emitter.on('note:create', create)
    emitter.on('note:open', open)
    emitter.on('note:close', unload)
    emitter.on('note:update', update)
    emitter.on('note:destroy', destroy)

  })

  function initNote() {
    state.note = { }
    state.note.path = null
    state.note.filename = null
    state.note.title = null
    state.note.body = null
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

    file.open(note, (n) => {
      console.log(n)
      var url = note.split('/')

      state.note.path = note
      state.note.filename = url[url.length-1]
      state.note.title = url[url.length-1].replace(/\.[^/.]+$/, "")
      state.note.body = n.data
      state.note.date.created = 'today'
      state.note.date.modified = 'today'
      state.note.status.modified = false
      console.log('📄 👀 ', state.note)

      spin(false)
      emitter.emit('render')
    })
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

  function write (note, cb) {
    emitter.emit('log:debug', 'Writing note to disk')
    var date = new Date()

    state.note.date.modified = date
    state.note.status.modified = false
  }

  function update (note) {
    emitter.emit('log:debug', 'Detecting changes to note')
    state.note.status.modified = true
  }

  function destroy (note) {
    emitter.emit('log.debug', 'Deleting note')
  }

  function spin (b) {
    state.note.status.loading = b
    emitter.emit('render')
  }
}
