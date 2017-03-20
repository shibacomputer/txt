'use strict'

const utils = require('./utils')
const mime = require('mime')

const path = require('path')
const assert = require('assert')

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
          mapDir(target, data, newDir, (result) => {
            cb(result)
          })
        }
      })
    })
  },
  mk: function(name) {
    utils.getPath(name, (target) => {
      fs.stat(target, (err, stats) => {
        if (stats) {
          console.log('Dir exists.')
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
  console.log('Mapping new Dir.')

  data.map((item) => {

    // Define the properties we care about
    var name, uri, type
    name = item
    uri = path.join(target, name)

    // Determine type
    fs.stat(uri, (err, stats) => {

      if (stats.isFile()) {
        type = mime.lookup(uri)
        if (type === 'text/gpg') {
          var diskItem = {
            'name': name,
            'uri': uri,
            'type': type
          }
          console.log('Pushing file: ', diskItem)
          newDir.files.push(diskItem)
        }
      }
      if (stats.isDirectory()) {
        var diskItem = {
          'name': name,
          'uri': uri,
          'type': 'directory'
        }
        console.log('Pushing dir: ', diskItem)
        newDir.subdirs.push(diskItem)
      }
    })
  })
  cb(newDir)
}
