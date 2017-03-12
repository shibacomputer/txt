'use strict'

const path = require('path')
const fs = require('fs')


const remote = window.require('electron').remote
const settings = remote.require('electron-settings')

module.exports = {
  open: function(file) {
    getPath(file, (target) => {
      fs.stat(target, (err, stats) => {
        if (err) {
          throw err
        } else {
            fs.readFile(target, (err, data) => {
            if (err) {
              throw err
            } else  {
              decrypt(data, (plaintext) => {
                console.log(plaintext)
              })
            }
          })
        }
      })
    })
  },
  write: function(data, location) {
    getPath(location, (target) => {
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

// Utility functions
function getPath(filename, cb) {
  settings.get('hasDbLocationOf').then((value) => {
    cb(path.join(value, filename))
  })
}

function decrypt(data, cb) {
  /*var options, result
  openpgp.initWorker({ path: 'openpgp.worker.min.js' })
  openpgp.config.aead_protect = true

  options = {
      message: openpgp.message.read(data),
      password: 'test',
      format: 'binary'
  };
  openpgp.decrypt(options).then((plaintext) => {
    cb(plaintext)
  });
  */
  cb(data)
}
