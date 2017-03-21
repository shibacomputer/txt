const utils = require('../utils/utils')

module.exports = createModel

function createModel() {
  return {
    namespace: 'global',
    state: {
      authenticated: true,
      path: null,
      theme: 'light'
    },
    reducers: {
      setDb: setDb
    },
    effects: {
      readDbPath: readDbPath,
      writeDbPath: writeDbPath
    },
    subscriptions: {
      'on-load': function(send, done) {
        send('global:readDbPath', done)
      }
    }
  }
}

function readDbPath (state, data, send, done) {
  utils.getSetting('hasDbLocationOf', (data) => {
    send('global:setDb', data, (err, value) => {
      if (err) return done(err)
      done(null, value)
    })
  })
}

function setDb (state, data) {
  return { path: data }
}

function writeDbPath (state, data, send, done) {
  utils.setSetting('hasDbLocationOf', data, () => {
    send('global:setDb', data, (err, value) => {
      if (err) return done(err)
      done(null, value)
    })
  })
}
