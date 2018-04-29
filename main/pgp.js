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
const KEY_FILENAME = '.txtkey'

var key, privkey, pubkey, pubKeyObj, privKeyObj, name, email

module.exports = {
  getKey: function(uri) {
    fs.readFile(path.join(uri + '/' + KEY_FILENAME), (err, data) => {
      key = JSON.parse(data.toString('utf8'))
      setupKeysForUse(key)
      /*
      console.log(key)
      var userStr = key.users[0].userId.userid
      console.log(key.users[0].userId.userid)
      email = userStr.substring(userStr.lastIndexOf('<') + 1, userStr.lastIndexOf('>'))
      name = userStr.substring(0, userStr.lastIndexOf(' '))
      console.log(email, name)
      */
    })
  },

  generateKey: function ( ) {

  },

  encrypt: function(contents) {

  },

  decrypt: function(encrypted) {

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

async function getSecret() {
  keytar.getPassword(APP_NAME, name).then( (secret) => {
    console.log(secret)
    return secret
  })

}

function decryptKey () {
  privKeyObj.decrypt(getSecret()).then ( (result) => {
    console.log(result)
  }).catch( (err) => {
    console.log(err)
  })

}
