'use strict'

const path = require('path')
const remote = window.require('electron').remote
const keytar = remote.require('keytar')
const { app } = remote.require('electron')
const settings = remote.require('electron-settings')
const openpgp = require('openpgp')

const accountname = app.getPath('home').split('/').slice(-1)[0]
const appId = 'Txt'

// Utility functions
module.exports = {

  // :: getSetting
  // Gets a setting for a key using electron-settings.
  // Pass a default value here if you want to prevent an error.
  // Callback returns the key and status.
  getSetting: function(key, cb) {
    var value
    var err
    if (settings.has(key)) {
      value = settings.get(key)
      console.log('⚙️ ' + key + ': ' + value)
    }
    else {
      err = {
        title: 'No setting',
        body: 'No setting',
        route: 'reset'
      }
    }
    cb(value, err)
  },

  // :: setSetting
  // Takes a setting key value pair and writes it to disk using
  // electron-settings.
  // Callback returns the key and a status (if there was one).
  setSetting: function(key, value, cb) {
    var err
    console.log('⚙️ → ' + key + ': ' + value)
    settings.set(key, value)
  },

  // :: decrypt
  // Takes a PGP encrypted blob and returns it ready for insertion into the UI.
  // @params: data (binary):    The encrypted data from disk,
  //          secret (string):  User sercret from entry or keychain.
  decrypt: function(data, key, cb) {
    openpgp.config.aead_protect = true
    var opts = {
      message: openpgp.message.read(data),
      format: 'utf8'
    }
    if (key.type === 'keychain') {
      keytar.getPassword(appId, accountname).then( (passphrase) => {
        opts.password = passphrase
        openpgp.decrypt(opts).then((plaintext) => {
          cb(plaintext)
        })
      })
    } else {
      //@TODO: Make this work with a key
    }

  },

  // :: encrypt
  // Encrypts data. Returns a binary blob.
  // @params: data (binary):    Packaged data from the UI,
  //          secret (string):  User sercret from entry or keychain.
  encrypt: function(data, filename, key, cb) {
    var opts = {
      data: data,
      armor: false,
      filename: filename
    }
    if (key.type === 'keychain') {
      keytar.getPassword(appId, accountname).then( (passphrase) => {
        console.log(passphrase)
        opts.passwords = [ passphrase ]
        openpgp.encrypt(opts).then((ciphertext) => {
          cb(ciphertext)
        })
      })

    } else {
      //@TODO: make this work with a private key.
    }
  }
}
