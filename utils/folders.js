'use strict'

const utils = require('./utils')

const path = require('path')
const assert = require('assert')

const fs = require('fs')
const rimraf = require('rimraf')


module.exports = {
  ls: function(dir) {
    utils.getPath(dir, (target) => {
      fs.readdir(target, (err, data) => {
        if (err) {
          throw err
        } else {
          // @TODO: DO SOMETHING HERE
        }
      })
    })
  },
  mk: function(name) {
    utils.getPath(name, (target) => {
      fs.stat(target, (err, stats) => {
        if (stats) {
          console.log('Dir exists.')
        } else {
          fs.mkdir(target, (err) => {
            if (err) {
              throw err
            } else {
              // @TODO: DO SOMETHING HERE
            }
          })
        }
      })
    })
  },
  rm: function(name) {
    utils.getPath(name, (target) => {
      rimraf(target, () => {
        // @TODO: DO SOMETHING HERE
      })
    })
  }
}

// Utility functions
function getPath(filename, cb) {
  settings.get('hasDbLocationOf').then((value) => {
    cb(path.join(value, filename))
  })
}
