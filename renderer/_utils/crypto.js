const openpgp = require('openpgp')
const fs = require('fs')
const path = require('path')
const util = require('util')
const keytar = require('keytar')

const APP_NAME = process.env.npm_package_name
const APP_VERSION = process.env.npm_package_version
const PGP_COMPRESSION = openpgp.enums.compression.zip
const PGP_BITS = 4096
const KEY_FILENAME = '.txtkey'

openpgp.initWorker({ path: '../../node_modules/openpgp/dist/openpgp.worker.min.js' })
openpgp.config.aead_protect = true
openpgp.config.use_native = true
openpgp.config.zero_copy = true
openpgp.config.versionstring = APP_NAME + '.app v' + APP_VERSION
openpgp.config.commentstring = 'https://txt.app'

let key, privkey, pubkey, pubKeyObj, privKeyObj, name, email

module.exports = {
  
  getKey: async function(uri, user, secret) {
    const readF = util.promisify(fs.readFile)
    let data
    try {
      data = await readF(path.join(uri, KEY_FILENAME))
    } catch (e) {
      throw new Error(e)
    }
    
    key = JSON.parse(data.toString('utf8'))
    try {
      keytar.setPassword(APP_NAME, user.name, secret)
    } catch(e) {
      throw new Error(e)
    }

    let success = await setupKeysForUse(key, secret)
    return success
  },

  generateKey: async function (uri, user, secret) {
    const writeUri = path.join(uri + '/' + KEY_FILENAME)

    try {
      keytar.setPassword(APP_NAME, user.name, secret)
    } catch(e) {
      throw new Error(e)
    }

    name = user.name
    email = user.email

    const options = {
      userIds: [{ name:name, email:email }],
      numBits: PGP_BITS,
      passphrase: secret
    }
    
    try {
      key = await openpgp.generateKey(options)
    } catch (e) {
      throw new Error(e)
    }

    writeKeyToDisk(writeUri, key)
    return key
  },

  encrypt: async function(contents) {
    if (!pubKeyObj.primaryKey.decrypted) await decryptKey()

    const options = {
      data: contents,
      publicKeys: pubKeyObj.keys,
      privateKeys: [privKeyObj],
      compression: PGP_COMPRESSION
    }
    let ciphertext
    try {
      ciphertext = await openpgp.encrypt(options)
    } catch (e) {
      throw new Error(e)
    }
    return ciphertext.data
  },

  decrypt: async function(contents) {
    if (!pubKeyObj.primaryKey.decrypted) await decryptKey()

    const options = {
      message: new Uint8Array([contents]),
      privateKeys: [privKeyObj]
    }

    const decrypted = await openpgp.decrypt(options)
    return decrypted.data
  },

  deleteKeychainItem: async function() {
    try {
      keytar.deletePassword(APP_NAME, name)
    } catch (e) {
      throw new Error(e)
    }
  }
}

async function setupKeysForUse (unprocessedKey, phrase) {
  privkey = unprocessedKey.privateKeyArmored
  pubkey = unprocessedKey.publicKeyArmored

  privKeyObj = openpgp.key.readArmored(privkey).keys[0]
  pubKeyObj = openpgp.key.readArmored(pubkey).keys

  let userId = privKeyObj.users[0].userId.userid
  email = userId.substring(userId.lastIndexOf('<') + 1, userId.lastIndexOf('>'))
  name = userId.substring(0, userId.lastIndexOf(' '))
  
  let isDecrypted
  
  try { 
    isDecrypted = await decryptKey(phrase? phrase : null)
  } catch (e) {
    throw new Error(e)
  }
  return isDecrypted
}

async function writeKeyToDisk(uri, key) {
  let exportedKey = JSON.stringify(key)
  fs.writeFile(uri, exportedKey, (err) => {
    if (err) console.log(err)
  })
}

async function getSecret() {
  const secret = await keytar.getPassword(APP_NAME, name)
  return secret
}

async function decryptKey(phrase) {
  let passphrase = phrase? phrase : await getSecret()
  let decryptedKey
  try {
    decryptedKey = await privKeyObj.decrypt(passphrase)
  } catch (e) {
    throw new Error(e)
  }
  return decryptedKey
}


