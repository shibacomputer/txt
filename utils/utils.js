'use strict'

const path = require('path')
const remote = window.require('electron').remote
const settings = remote.require('electron-settings')
const openpgp = require('openpgp')

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
    cb(err)
  },

  // :: decrypt
  // Takes a PGP encrypted blob and returns it ready for insertion into the UI.
  // @params: data (binary):    The encrypted data from disk,
  //          secret (string):  User sercret from entry or keychain.
  decrypt: function(data, cb) {
    openpgp.config.aead_protect = true
    var options, result
    options = {
        message: openpgp.message.read(data),
        password: 'Test',
        format: 'utf8'
    }
    openpgp.decrypt(options).then((plaintext) => {
      cb(plaintext)
    });

  },

  // :: encrypt
  // Encrypts data. Returns a binary blob.
  // @params: data (binary):    Packaged data from the UI,
  //          secret (string):  User sercret from entry or keychain.
  encrypt: function(data, filename, cb) {
    var options, encrypted
    options = {
        data: data,
        passwords: ['Test'],
        armor: false,
        filename: filename
    };
    openpgp.encrypt(options).then((ciphertext) => {
      cb(ciphertext)
    });
  }
}
