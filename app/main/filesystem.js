const fs = require('fs-extra')
const path = require('path')
const { ipcMain } = require('electron')

const pgp = require('./pgp')

export function init() {
  ipcMain.on('fs:read', (e, payload) => {
    read(payload).then((file) => {
      e.sender.send('fs:read', file)
    }).catch( (e) => {
      throw e
    })
  })
  ipcMain.on('fs:write', (e, obj) => {
    write(obj).then((notify) => {
      e.sender.send('fs:write', notify)
    }).catch( (err) => {
      throw e
    })
  })
}

/*  Read - takes a configuration payload and read a file with optional crypto
    obj
      author:   Author name (to pull from keychain)
      key:      PGP key for encrypting a file (optional)
      phrase:   A passphrase that can open the file (this is overridden
                if the key exists)
      opts
        uri:    Usually from a document or from an open window
        enc:    Encoding format (will almost always be utf8 for now)
    returns a file */
async function read(obj) {
  let uri = path.normalize(obj.opts.uri)
  let stat, data

  try {
    stat = await fs.stat(uri)
  } catch (e) {
    throw e
  }
  let file = {
    birthTime: stat.birthtime,
    mTime: stat.mtime,
    uri: uri,
    uriParsed: path.parse(uri),
    filename: path.basename(uri, path.extname(uri)),
    title: path.parse(uri).name
  }

  try {
    data = await fs.readFile(uri, obj.opts.enc)
  } catch (e) {
    throw e
  }

  if (path.parse(uri).ext === '.gpg') {
    let plaintext

    try {
      plaintext = await pgp.decrypt({
        data:       data,
        user:       obj.author,
        key:        obj.key ? obj.key : null,
        phrase:     obj.phrase? obj.phrase : null
      })
    } catch (e) {
      throw e
      throw e
    }
    file.data = plaintext
  } else {
    file.data = data
  }
  return file
}

/*  Write - takes a configuration payload and write a file with optional crypto
    obj
      author:   Author name (to pull from keychain)
      key:      PGP key for encrypting a file (optional)
      ring:     Pubkey array for people who have access to the file (optional)
      phrase:   A passphrase that can open the file (this is overridden
                if the key exists)
      data:     The data to be written
      opts
        uri:    Selected path from a save dialog window or existing path
        ext:    Extension: 'pdf', 'gpg', 'txtkey', 'txt'
        enc:    Encoding format (will almost always be utf8 for now)

    returns true / false for notifications. */
async function write(obj) {

  let data
  let uri = path.normalize(obj.opts.uri)

  if (!obj.opts.ext) obj.opts.ext = path.extname(uri)
  if (obj.opts.ext === '.gpg' ) {
    try {
      data = await pgp.encrypt({
        data:       obj.data,
        user:       obj.author,
        key:        obj.key ? obj.key : null,
        ring:       obj.ring ? obj.ring : null,
        phrase:     obj.phrase? obj.phrase : null,
        usePhrase:  obj.phrase && !obj.key ? true : false
      })
    } catch(e) {
      throw e
    }
  }
  try {
    await fs.writeFile(uri, data? data : obj.data, { encoding: obj.opts.enc })
  } catch (e) {
    throw e
  }
  return obj.opts.notify ? {
    notify: obj.opts.notify,
    fn: obj.opts.fn + '' + obj.opts.ext,
    uri: obj.opts.uri
  } : false
}
