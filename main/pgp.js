const openpgp = require('openpgp')
const keytar = require('keytar')
const fs = require('fs')
const path = require('path')
const { app } = require('electron')

openpgp.initWorker({ path: '../../node_modules/openpgp/dist/openpgp.worker.min.js' })
openpgp.config.aead_protect = true
openpgp.config.use_native = true

const APP_NAME = process.env.npm_package_name
const APP_VERSION = process.env.npm_package_version
const PGP_COMPRESSION = openpgp.enums.compression.zip
const PGP_BITS = 4096
const KEY_FILENAME = '.txtkey'


var key, privkey, pubkey, pubKeyObj, privKeyObj, name, email

module.exports = {
  getKey: async function(uri) {
    fs.readFile(path.join(uri + '/' + KEY_FILENAME), (err, data) => {
      key = JSON.parse(data.toString('utf8'))
      setupKeysForUse(key)
    })
  },

  generateKey: async function (uri, user) {
    const writeUri = path.join(uri + '/' + KEY_FILENAME)
    const passphrase = await getSecret()

    name = user.name
    email = user.email

    const options = {
      userIds: [{ name:name, email:email }],
      numBits: PGP_BITS,
      passphrase: passphrase
    }

    key = await openpgp.generateKey(options)
    writeKeytoDisk(key, writeUri)

  },

  encrypt: async function(contents) {
    if (!pubKeyObj.primaryKey.decrypted) await decryptKey()

    const options = {
      data: contents,
      publicKeys: pubKeyObj.keys,
      privateKeys: [privKeyObj],
      compression: PGP_COMPRESSION
    }

    const ciphertext = await openpgp.encrypt(options)
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

  updateKeychain: async function(secret) {
    const result = keytar.setPassword(APP_NAME, name, secret)
    return result
  }
}

function setupKeysForUse (unprocessedKey) {
  privkey = unprocessedKey.privateKeyArmored
  pubkey = unprocessedKey.publicKeyArmored

  privKeyObj = openpgp.key.readArmored(privkey).keys[0]
  pubKeyObj = openpgp.key.readArmored(pubkey).keys

  var userId = privKeyObj.users[0].userId.userid
  email = userId.substring(userId.lastIndexOf('<') + 1, userId.lastIndexOf('>'))
  name = userId.substring(0, userId.lastIndexOf(' '))

  decryptKey()
}

async function writeKeyToDisk(key, uri) {
  fs.writeFile(uri, key, (err) => {
    if (err) console.log(err)
    else setupKeysForUse(key)
  })
}

async function getSecret() {
  const secret = keytar.getPassword(APP_NAME, name)
  return secret
}

async function decryptKey() {
  const passphrase = await getSecret()
  const decryptedKey = await privKeyObj.decrypt(passphrase)

  return decryptedKey
}
