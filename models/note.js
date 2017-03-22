const files = require('../utils/files')

module.exports = createModel

function createModel() {
  return {
    namespace: 'note',
    state: {
      path: null,
      filename: null,
      title: null,
      body: null,
      created: null,
      modified: null,
      isEditing: false,
      hasNote: false,
      gettingNote: false,
      hasChanges: false
    },
    reducers: {
      createNote: function (state, data) {
        return {
          path: data.path,
          filename: data.filename,
          title: data.title,
          body: data.body,
          created: data.created,
          modified: data.modified,
          isEditing: true,
          hasNote: true
        }
      },
      gettingNote: function (state, data) {
        return { gettingNote: data }
      },
      hasNote: function (state, data) {
        return { hasNote: data }
      },
      clearNote: function (state, data) {
        return {
          path: null,
          filename: null,
          title: null,
          body: null,
          created: null,
          modified: null,
          hasNote: false
        }
      }
    },
    effects: {
      readNote: readNote
    }
  }
}

function readNote (state, data, send, done) {
  getNote(state, data, send, done)
}

function getNote(state, data, send, done) {
  send('note:gettingNote', true, () => {
    send('note:hasNote', false, () => {
      send('note:clearNote', (err, value) => {
        files.open(data, (f) => {
          var noteData = {
            path: data,
            filename: data,
            title: data,
            body: f.data,
            created: 'today',
            modified: 'today'
          }
          send('note:createNote', noteData, (err, value) => {
            send('note:gettingNote', false, () => {
              send('note:hasNote', true, done)
            })
          })
        })
      })
    })
  })
}
