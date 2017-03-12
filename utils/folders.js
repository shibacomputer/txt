'use strict'

const path = require('path')
const fs = require('fs')
const rimraf = require('rimraf')

const remote = window.require('electron').remote
const settings = remote.require('electron-settings')

module.exports = {
  ls: function(dir) {
    getPath(dir, (target) => {
      fs.readdir(target, (err, data) => {
        if (err) {
          throw err
        } else {
          console.log(data)
        }
      })
    })
  },
  mk: function(name) {
    getPath(name, (target) => {
      fs.stat(target, (err, stats) => {
        if (err || stats) {
          console.log('Cant make this')
        } else {
          fs.mkdir(target, (err) => {
            if (err) {
              throw err
            } else {
              console.log('ok')
            }
          })
        }
      })
    })
  },
  rm: function(name) {
    getPath(name, (target) => {
      rimraf(target, () => {
        console.log('deleted')
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
