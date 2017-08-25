const utils = require('./utils')

const path = require('path')
const assert = require('assert')

const fs = require('fs')

module.exports = {

  // :: open
  // Asynchronously opens a file. Assumes a valid path, but still checks for
  // the file's existence.
  open: function(uri, cb) {
    var err = null
    var plaintext = null
    fs.stat(uri, (err, stats) => {
      if (err) {
        cb(plaintext, err)
      } else {
          fs.readFile(uri, (err, data) => {
          if (err) {
            cb(plaintext, err)
          } else {
            utils.decrypt(data, (plaintext) => {
              cb(plaintext, err)
            })
          }
        })
      }
    })
  },

  // :: write
  // Write to disk. We assume a valid path but we still check to ensure we
  // have permission to write.
  write: function(data, cb) {
    fs.stat(data.path, (err, stats) => {
      utils.encrypt(data.body, data.title, (ciphertext) => {
        encrypted = ciphertext.message.packets.write()
        fs.writeFile(data.path, encrypted, (err) => {
          if (err) {
            cb(err)
          } else {
            cb()
          }
        })
      })
    })
  }
}
