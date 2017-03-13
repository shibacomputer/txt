'use strict'

const utils = require('./utils')

const path = require('path')
const assert = require('assert')

const fs = require('fs')

module.exports = {

  open: function(file) {
    utils.getPath(file, (target) => {
      fs.stat(target, (err, stats) => {
        if (err) {
          throw err
        } else {
            fs.readFile(target, (err, data) => {
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
