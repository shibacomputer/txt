const utils = require('../utils/utils')
const folders = require('../utils/folders')

module.exports = createModel

function createModel() {
  return {
    namespace: 'filesystem',
    state: {
      dirs: []
    },
    reducers: {
      list: list
    },
    effects: {
      readDir: readDir
    },
    subscriptions: {
      'on-load': function(send, done) {
        send('filesystem:readDir', '/', done)
      }
      //@TODO: add disk polling
    }
  }
}

function list (state, data) {
  return { folders: state.dirs.push(data)}
}

function readDir (state, data, send, done) {

  folders.ls(data, (data) => {
    send('filesystem:list', data, (err, value) => {
      if (err) return done(err)
      done(null, value)
    })
  })
}
