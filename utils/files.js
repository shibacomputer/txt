'use strict'

const utils = require('./utils')

const path = require('path')
const assert = require('assert')

const fs = require('fs')

module.exports = {

  open: function(file) {
    var newFile = { }
    fs.stat(file, (err, stats) => {
      if (err) {
        throw err
      } else {
          fs.readFile(file, (err, data) => {
          if (err) {
            throw err
          } else  {
            utils.decrypt(data, (plaintext) => {
              console.log(plaintext)
            })
          }
        })
      }
    })
  },
  write: function(data, location) {
    utils.getPath(location, (target) => {
      fs.stat(target, (err, stats) => {
        if (err) {
          throw err
        } else {
          fs.writeFile(target, data, (err) => {
            if (err) {
              throw err
            } else {
              console.log(data)
              console.log('SAVED')
            }
          })
        }
      })
    })
  }
}

function mapFile (target, data, newFile, cb) {
  //@TODO: Make file unit tests

}
