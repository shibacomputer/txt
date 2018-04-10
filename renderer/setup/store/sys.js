module.exports = store

const fs = require('fs')
const { ipcRenderer } = require('electron')
const { join } = require('path')

const openpgp = require('openpgp')

openpgp.initWorker({ path: '../../node_modules/openpgp/dist/openpgp.worker.min.js' })
openpgp.config.aead_protect = true
openpgp.config.use_native = true

function store (state, emitter) {
  state.progress = 1
  state.author = {
    name: '',
    email: '',
    phrase: null
  }
  state.key = { }
  state.ui = {
    valid: false,
    availableKeys: [ ],
    selectedKey: { },
    uri: null,
    newKey: true
  }

  emitter.on('DOMContentLoaded', function () {
    if (!state.path) ipcRenderer.send('get:pref', 'author')

    ipcRenderer.once('done:getPref', (event, key, value) => {
      state.path = join(value.homedir, '.gnupg', 'secring.gpg')
      emitter.emit(state.events.RENDER)
    })

    emitter.on('state:validatePassphrase', function (count) {
      state.validPassphrase = true
      emitter.emit(state.events.RENDER)
    })

    emitter.on('state:switchType', function (target) {
      if (target === 'key' && !state.ui.newKey) {
        state.ui.newKey = true
        emitter.emit(state.events.RENDER)
      } else if (target === 'string' && state.ui.newKey) {
        state.ui.newKey = false
        emitter.emit(state.events.RENDER)
      }
    })

    emitter.on('state:updatePassphrase', function (value) {
      state.string = value
      if (state.workingPath && (state.selectedKey || state.string)) state.valid = true
      else state.valid = false
    })

    emitter.on('state:writeKeyPath', function(target) {
      state.path = target
    })

    emitter.on('state:loadKey', function(uri) {

      fs.stat(uri, (err, stats) => { // Do we exist?
        if (err) {
          // Send error message to ipc dialog
          ipcRenderer.send('alert:err', err)
          return
        } else {
         fs.readFile(uri, (err, data) => {
          if (err) {
            ipcRenderer.send('alert:err', err)
            return
          } else {
            emitter.emit('state:injestKey', data)
          }
         })
        }
      })
    })

    emitter.on('state:injestKey', function(data) {
      const key = openpgp.key.readArmored(data.toString())

      var newKey = {
        name: key.keys[0].users[0].userId.userid,
        id: key.keys[0].primaryKey.fingerprint.substr(key.keys[0].primaryKey.fingerprint.length - 6),
        key: key.keys[0]
      }

      state.availableKeys.push(newKey)
      state.selectedKey = newKey
      if (state.workingPath && (state.selectedKey || state.string)) state.valid = true
      else state.valid = false
      emitter.emit(state.events.RENDER)
    })
    // @TODO: Make this work properly
    emitter.on('state:selectKey', function(key) {
      state.selectedKey = key
      emitter.emit(state.events.RENDER)
    })

    emitter.on('state:doSetup', function() {

      // First, check to see if the working path exists.
      console.log(state.workingPath, state.selectedKey, state.string)
      if (state.workingPath && (state.selectedKey || state.string)) {
        fs.stat(state.workingPath, (err, stats) => { // Do we exist?
          // We must exist, because we have created a dir when selecting a dir.
          if (err) {
            // Send error message to ipc dialog
            ipcRenderer.send('alert:err', err)
            return
          } else {
            // Path exists
            // @TODO: Test for writing to path
            ipcRenderer.send('do:firstSetup', state)
          }
        })
      }

      ipcRenderer.once('done:setup', (event, err) => {
        if (err) {
          console.log(err)
          // Goto error msg
        } else {
          ipcRenderer.once('done:openWindow', (event, nextEvent, win) => {
            if (nextEvent) ipcRenderer.send(nextEvent, win)
          })
          ipcRenderer.send('do:openWindow', 'main', 'do:closeWin')
        }
      })
    })
  })
}
