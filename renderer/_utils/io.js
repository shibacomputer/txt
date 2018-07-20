const fs = require('fs')
const path = require('path')
const util = require('util')
const dirTree = require('directory-tree')
const trash = require('trash')

const APP_NAME = require('electron').remote.app.getName()
const APP_VERSION = require('electron').remote.app.getVersion()
const KEY_FILENAME = '.txtkey'

const read = util.promisify(fs.readFile)
const write = util.promisify(fs.writeFile)
const mkdir = util.promisify(fs.mkdir)
const mv = util.promisify(fs.rename)
const exists = util.promisify(fs.access)

module.exports = {
  ls: async function(uri) {
    let dir
    try {
      dir = await dirTree(uri, { normalizePath:true } )
    } catch (e) {
      throw new Error(e)
    }
    return dir
  },

  mv: async function(uri) {
    try {
      await mv(uri.old, uri.new)
    } catch (e) {
      throw new Error(e)
    }
    return
  },

  mkdir: async function(uri) {
    try {
      await mkdir(uri)
    } catch (e) {
      throw new Error(e)
    }
    return
  },

  write: async function(uri, data) {
    try {
      await write(uri, data)
    } catch (e) {
      throw new Error(e)
    }
    return
  },

  read: async function(uri) {
    let data
    try {
      data = await read(uri, 'utf8')
    } catch (e) {
      throw new Error(e)
    }
    return data
  },

  trash: async function(uri) {
    try {
      trash(uri)
    } catch (e) {
      throw new Error(e)
    }
    return
  },

  exists: async function(uri) {
    try {
      status = await exists(uri, fs.constants.W_OK)
    } catch (e) {
      return e
    }
    return true
  }
}
