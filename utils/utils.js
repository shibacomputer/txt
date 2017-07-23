'use strict'

const path = require('path')
const remote = window.require('electron').remote
const settings = remote.require('electron-settings')
const openpgp = require('openpgp')

// Utility functions

module.exports = {

  // :: getPath
  // Prepends the user-set path, validate, then return a valid path.
  // Used to kickoff filesystem read/write functions.
  getPath: function(filename, cb) {
    var newPath
    var err
    if (settings.has('workingPath')) {
      newPath = path.join(settings.get('workingPath'), filename)
    } else {
      err = {
        title: 'No Notebook',
        body: 'You need to reset your notebook',
        route: 'reboot'
      }
    }
    cb(newPath, err)
  },

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
    };
    openpgp.decrypt(options).then((plaintext) => {
      cb(plaintext)
    });

  },

  // :: encrypt
  // Encrypts data. Returns a binary blob.
  // @params: data (binary):    Packaged data from the UI,
  //          secret (string):  User sercret from entry or keychain.
  encrypt: function(data, cb) {

    var options, encrypted
    options = {
        data: data,
        passwords: ['Test'],
        armor: false
    };
    openpgp.encrypt(options).then((ciphertext) => {
      cb(ciphertext)
    });
  },

  // :: pack
  // Receives data from the UI, and creates an archive format if there are
  // assets other than text that require bundling. Returns a zip.
  // @params: data (object):   The desired object to pack.
  //          options (array): Options for packing.
  pack: function(data, options, cb) {
    cb()
  }
}
