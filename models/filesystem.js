const utils = require('../utils/utils')
const folders = require('../utils/folders')

module.exports = createModel

function createModel() {
  return {
    namespace: 'filesystem',
    state: {
      dirs: [],
      listingDirs: false,
      listedDirs: false
    },
    reducers: {
      list: list,
      listingFs: function (state, data) {
        return { listingDirs: data }
      },
      listedFs: function (state, data) {
        return { listedDirs: data }
      }

    },
    effects: {
      read: read,
      refresh: refresh
    },
    subscriptions: {
      'on-load': function(send, done) {
        send('filesystem:read', '/', done)
      }
      //@TODO: add disk polling
    }
  }
}

function list (state, data) {
  return { dirs: state.dirs.push(data) }
}

function read (state, data, send, done) {
  send('filesystem:listingFs', true, () => {
    folders.ls(data, (f) => {
      send('filesystem:list', f, (err, value) => {
        send('filesystem:listingFs', false, done)
      })
    })
  })
}

function refresh (state, data, send, done) {

}
