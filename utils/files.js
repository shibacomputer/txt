'use strict'

const path = require('path')
const fs = require('fs')

const remote = window.require('electron').remote
const settings = remote.require('electron-settings')

module.exports = {
  readFile: function(file) {
    getPath(file, (target) => {
      fs.readFile(target, (err, data) => {

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
