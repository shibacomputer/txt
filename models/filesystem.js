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
      addDir: function (state, data) {
        return { dirs: state.dirs.concat(data) }
      },
      clearDirs: function (state, data) {
        return { dirs: [] }
      },
      listingDirs: function (state, data) {
        return { listingDirs: data }
      },
      listedDirs: function (state, data) {
        return { listedDirs: data }
      }
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

function readDir (state, data, send, done) {
  if (state.dirs.length) {
    console.log('hello')
    state.dirs.filter( (fsCheck) => {
      var matchPath = (fsCheck.name === data.name)
      console.log(matchPath)
      if (fsCheck.name === data.name) {
        done()
      } else {
        createDirListing(state, data, send, done)
      }
    })
  } else {
    createDirListing(state, data, send, done)
  }
}

function createDirListing(state, data, send, done) {
  send('filesystem:listingDirs', true, () => {
    send('filesystem:listedDirs', false, () => {
      folders.ls(data, (f) => {
        send('filesystem:addDir', f, (err, value) => {
          send('filesystem:listingDirs', false, () => {
            send('filesystem:listedDirs', true, done)
          })
        })
      })
    })
  })
}
