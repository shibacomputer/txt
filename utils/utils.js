'use strict'

const path = require('path')
const remote = window.require('electron').remote
const settings = remote.require('electron-settings')
const openpgp = require('openpgp')

// Utility functions

module.exports = {
  getPath: function(filename, cb) {
    settings.get('hasDbLocationOf').then((value) => {
      cb(path.join(value, filename))
    })
  },

  getSetting: function(key, cb) {
    settings.get(key).then((value) => {
      console.log('GET SETTING: ' + key + ' VALUE: ' + value)
      cb(value)
    })
  },

  setSetting: function(key, value, cb) {
    settings.set(key, value).then( () => {
      if (key === 'hasDbLocationOf') {
        settings.set('isActiveInstall', true).then( () => {
          console.log('SET SETTING: ' + key + ' VALUE: ' + value)
        })
      }
    })
  },

  decrypt: function(data, cb) {
    openpgp.config.aead_protect = true
    var options, result
    options = {
        message: openpgp.message.read(data),
        password: 'test',
        format: 'utf8'
    };
    openpgp.decrypt(options).then((plaintext) => {
      cb(plaintext)
    });

  },

  encrypt: function(plaintext, cb) {
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
  }
}
