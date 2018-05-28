const fs = require('fs')
const path = require('path')
const util = require('util')
const dirToJson = require('dir-to-json')
const mime = require('mime')
const trash = require('trash')

mime.define({ 'text/gpg': ['gpg'] })

const APP_NAME = process.env.npm_package_name
const APP_VERSION = process.env.npm_package_version
const KEY_FILENAME = '.txtkey'

const read = util.promisify(fs.readFile)
const write = util.promisify(fs.writeFile)
const mkdir = util.promisify(fs.mkdir)
const mv = util.promisify(fs.rename)

module.exports = {
  ls: async function(uri) {
    let dir
    try {
      dir = await dirToJson(uri)
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
    console.log(uri, data)
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
  }
}
