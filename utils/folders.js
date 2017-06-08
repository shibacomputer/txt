const fs = require('fs')
const mime = require('mime')
const trash = require('trash')
const dirToJson = require('dir-to-json')

const utils = require('./utils')

mime.define({ 'text/gpg': ['gpg'] })

module.exports = {
  init: function(dir, cb) {
    dirToJson(dir, function(err, dirs) {
      if (err) {
        throw err
      } else {
        cb(dirs)
      }
    })
  },
  mk: function(name, cb) {
    utils.getPath(name, (target) => {
      fs.stat(target, (err, stats) => {
        if (stats) {
          console.log('📂 ‼️ Dir at path ', target, ' exists')
        } else {
          fs.mkdir(target, (err) => {
            if (err) {
              throw err
            } else {
              cb(name)
            }
          })
        }
      })
    })
  },
  rm: function(name, cb) {
    utils.getPath(name, (target) => {
      trash(target).then(() => {
        cb(name)
      })
    })
  }
}
