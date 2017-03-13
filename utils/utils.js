'use strict'

const path = require('path')
const remote = window.require('electron').remote
const settings = remote.require('electron-settings')
// const openpgp = require('openpgp')

// Utility functions

module.exports = {
  getPath: function(filename, cb) {
    settings.get('hasDbLocationOf').then((value) => {
      cb(path.join(value, filename))
    })
  },

  decrypt: function(data, cb) {
    /*
    openpgp.initWorker({ path: 'openpgp.worker.min.js' })
    openpgp.config.aead_protect = true

    var options, result
    options = {
        message: openpgp.message.read(data),
        password: 'test',
        format: 'binary'
    };
    openpgp.decrypt(options).then((plaintext) => {
      cb(plaintext)
    });
    */
    cb(data)
  },

  encrypt: function(plaintext, cb) {
    /*
    openpgp.initWorker({ path: 'openpgp.worker.min.js' })
    openpgp.config.aead_protect = true

    var options, encrypted
    options = {
        data: plaintext,
        password: 'test',
        armor: false
    };
    openpgp.encrypt(options).then((plaintext) => {
      cb(plaintext)
    });
    */
    cb(data)
  }
}
