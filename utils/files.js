'use strict'

const path = require('path')
const fs = require('fs')

const remote = window.require('electron').remote
const settings = remote.require('electron-settings')

module.exports = {
  readFile: function(file) {
    getPath(file, (target) => {
      fs.readFile(target, (err, data) => {
        if (err) {
          throw err
        } else  {
          console.log(data)
        }
      })
    })
  },

  writeFile: function(data, location) {
    getPath(location, (target) => {
      fs.writeFile(target, data, (err) => {
        if (err) {
          console.log(err)
          throw err
        } else {
          console.log(data)
          console.log('SAVED')
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
