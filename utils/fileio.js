'use strict'

const path = require('path')
const fs = require('fs')

const remote = window.require('electron').remote
const settings = remote.require('electron-settings')
const openpgp = require('openpgp')
const openPgpWorker = require('openpgp.worker')

module.exports = {
  readFile: function(file) {
    getPath(file, (target) => {
      fs.readFile(target, (err, data) => {
        decrypt(data)
      })
    })
  }
}

function decrypt(data) {
  openpgp.initWorker(openPgpWorker)
  openpgp.config.aead_protect = true

  var opts = {
    data: data,
    password: 'test'
  }

  openpgp.decrypt(opts).then( (plaintext) => {
    console.log(plaintext)
  })
}


function getPath(filename, cb) {
  settings.get('hasDbLocationOf').then((value) => {
    cb(path.join(value, filename, '.gpg'))
  })
}
