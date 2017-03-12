'use strict'

const path = require('path')
const fs = require('fs')

const remote = window.require('electron').remote
const settings = remote.require('electron-settings')

module.exports = {
  readDir: function(file) {
    getPath(file, (target) => {
      fs.readdir(target, (err, data) => {
        if (err) {
          throw err
        } else {
          console.log(data)
        }
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
