const utils = require('./utils')

const path = require('path')
const assert = require('assert')

const fs = require('fs')

module.exports = {

  // :: open
  // Asynchronously opens a file. Assumes a valid path, but still checks for
  // the file's existence.
  open: function(file, cb) {
    fs.stat(file, (err, stats) => {
      if (err) {
        cb(err)
      } else {
          fs.readFile(file, (err, data) => {
          if (err) {
            cb(err)
          } else  {
            utils.decrypt(data, (plaintext) => {
              cb(plaintext)
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
    utils.getPath(data.path, (target) => {
      fs.stat(target, (err, stats) => {
        if (err) {
          cb(err)
        } else {
          fs.writeFile(target, data, (err) => {
            if (err) {
              cb(err)
            } else {
              cb()
            }
          })
        }
      })
    })
  },

  // :: delete
  del: function(file, cb) {
    var status = false
    utils.getPath(file, (target) => {
      fs.dele
    })
  }
}
