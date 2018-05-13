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

module.exports = {
  ls: async function(uri) {
    let dir
    try {
      dir = await dirToJson(uri)
    } catch (e) {
      throw new Error(e)
    }
    return dir
  }
}
