const utils = require('./utils')
const mime = require('mime')

const path = require('path')

const fs = require('fs')
const rimraf = require('rimraf')

mime.define({ 'text/gpg': ['gpg'] })

module.exports = {

  ls: function (dir, cb) {
    var newDir = {
      'files': [],
      'subdirs': []
    }
    utils.getPath (dir, (target) => {
      newDir.name = dir
      newDir.collapsed = true

      fs.readdir(target, (err, data) => {
        if (err) {
          throw err
        } else {
          mapDir(target, data, newDir, (result, done) => {
            if (done) { cb(result) }
          })
        }
      })
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
      rimraf(target, () => {
        cb(name)
      })
    })
  }
}

function mapDir (target, data, newDir, cb) {
  //@TODO: Implement filesystem unit tests.

  var counter = 0,
      max = data.length,
      done = false

  data.map((item) => {

    // Define the properties we care about
    var name, uri, type
    name = item
    uri = path.join(target, name)

    // Determine type
    fs.stat(uri, (err, stats) => {
      counter ++
      var diskItem = { }
      if (stats.isFile()) {
        type = mime.lookup(uri)
        if (type === 'text/gpg') {
          diskItem = {
            'name': name,
            'uri': uri,
            'type': type
          }
          newDir.files.push(diskItem)
          if (counter === max) {
            done = true
            cb(newDir)
          }
        }
      }
      if (stats.isDirectory()) {
        diskItem = {
          'name': name,
          'uri': uri,
          'type': 'directory'
        }
        newDir.subdirs.push(diskItem)
        if (counter === max) {
          done = true
          cb(newDir, done)
        }
      }

    })

  })
}
