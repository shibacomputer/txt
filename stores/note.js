const utils = require('../utils/utils')
const file = require('../utils/files')

module.exports = noteStore

function noteStore (state, emitter) {
  if (!state.note) {
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

  emitter.on('DOMContentLoaded', function () {
    emitter.emit('log:debug', 'Loading Note Store')

    emitter.on('note:create', create)
    emitter.on('note:load', load)
    emitter.on('note:unload', unload)
    emitter.on('note:write', write)
    emitter.on('note:update', update)
    emitter.on('note:destroy', destroy)

  })

  function create (note) {
    emitter.emit('log:debug', 'Creating note')

    spin()

    new Date()

  }

  function load (note) {
    emitter.emit('log:debug', 'Loading a note')

    spin(true)

    file.open(note, (n) => {
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

  function write (note) {
    emitter.emit('log:debug', 'Writing note to disk')
    // state.note.date.modified = today's date
    var date = new Date()
    state.note.date.modofied = date
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
