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
            cb(err)
          })
        }
      })
    })
  },
  rn: function(oldPath, newPath, cb) { // Remember the paths are relative.
    utils.getPath(oldPath, (oldTarget) => {
      fs.stat(oldTarget, (err, stats) => {
        if (stats) {
          utils.getPath(newPath, (newTarget) => {
            console.log('new path: ', newTarget)
            fs.stat(newTarget, (err, stats) => {
              if (stats) {
                cb('File already exists') // @TODO: Do better work with errors
              } else {
                fs.rename(oldTarget, newTarget, (err) => {
                  cb(err)
                })
              }
            })
          })
        } else {
          cb('Can\'t find target') // @TODO: Do better work with errors
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
