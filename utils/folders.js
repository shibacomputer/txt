'use strict'

const path = require('path')
const fs = require('fs')

const remote = window.require('electron').remote
const settings = remote.require('electron-settings')

module.exports = {
  readDirectory: function(target) {
    if (!target) {
      target = getDefault
    }
  }

  makeDirectory: function(name, location) {

  }

  deleteDirectory: function(target) {

  }
}

function getDefaultPath(filename, cb) {
  settings.get('hasDbLocationOf').then((value) => {
    cb(value)
  })
}
