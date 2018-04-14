const remote = window.require('electron').remote
const openpgp = require('openpgp')
const keytar = remote.require('keytar')

openpgp.initWorker({ path: '../../node_modules/openpgp/dist/openpgp.worker.min.js' })
openpgp.config.aead_protect = true

module.exports = {

  /**
   * Encrypt data.
   * @param key The key or passphrase for authentication.
   * @param data The data to encrypt.
   * @param callback Returns errors or an encrypted blob.
   * */
   // @TODO: Passphrase secret gpg key.
  encrypt: function(key, data, callback) {
    var contents = new TextEncoder("utf-8").encode(data.contents)
    var opts = {
      data: new Uint8Array(contents),
      passwords: [ key.phrase? key.phrase : null ],
      compression: openpgp.enums.compression.zip,
      armor: false
    }
    console.log('crypto:encrypt: opts: ', opts, ' key: ', key)
    openpgp.encrypt(opts).then((result) => {
      opts = null
      console.log('crypto:encrypt: done. result: ', result)
      callback(null, result.message.packets.write())
    }).catch( (err) => {
      opts = null
      console.log('crypto:encrypt: err:', err)
      callback(err, null)
    })
  },

  /**
   * Decrypt data.
   * @param key The key or passphrase for authentication.
   * @param data The data to encrypt.
   * @param callback Returns errors or an encrypted blob.
   * */
  decrypt: function(key, data, callback) {
    var opts = {
      message: openpgp.message.read(data.contents),
      format: data.encoding,
      passwords: [ key.phrase? key.phrase : null ]
    }
    console.log('crypto:decrypt: opts: ', opts, 'key: ', key)
    openpgp.decrypt(opts).then((result) => {
      console.log('crypto:decrypt: result: ', result)
      opts = null
      callback(null, result)
    }).catch( (err) => {
      console.log('crypto:decrypt: err:' + err)
      opts = null
      callback(err, null)
    })
  },

  /**
   * Rekeys an item with new keys or passphrases.
   * @param opts The current options.
   * @param updates Your new options.
   * @param callback Returns errors and a success boolean.
   * */
  rekey: function(opts, updates, callback) {

  },

  /**
   * Reads a private key and readies it for use.
   * @param opts The current options.
   * @param updates Your new options.
   * @param callback Returns errors and a success boolean.
   * */
  ingestKey: function(callback) {

  },

  /**
   * Creates and returns a new private key.
   * @param opts Private key options object. This will set up your key's preferences.
   * @param secret Passphrase for securing the private key.
   * @param callback Returns a key and an error object
   * */
  createKey: function(opts, secret, callback) {
    console.log('crypto:create: opts: ', opts, ' secret: ', secret)

    var options = {
      userIds: [ opts ],
      numBits: 4096,
      passphrase: secret
    }

    openpgp.generateKey(options).then( (key) => {

      console.log('crypto:key: done: ', key)
      callback(null, key)
    }).catch( (err) => {
      console.log('crypto:key: err: ', err)
      callback(err, null)
    })
  },
  /**
   * Reads a secret from the keychain.
   * @param service The app id as stored in the keychain.
   * @param account The account username.
   * @param callback Returns an error and the secret.
   * */
  readKeychain: function(service, account, callback) {
    console.log('crypto:')
    keytar.getPassword(service, account).then( (secret) => {
      callback(null, secret)
    }).catch( (err) => {
      callback(err, null)
    })
  },

  /**
   * Check to see if the keychain even exists, and also whether the item is
   * stored in the keychain.
   * @param service The app id as stored in the keychain.
   * @param callback Returns an error and true/false.
   * */
  existsKeychain: function(service, callback) {
    keytar.findPassword(service).then( (result) => {
      callback(null, result)
    }).catch( (err) => {
      callback(err, false)
    })
  },

  /**
   * Deletes a secret from the keychain.
   * @param service The app id as stored in the keychain.
   * @param account The account username.
   * @param callback Returns an error and true/false.
   * */
  rmKeychain: function(service, account, callback) {
    keytar.deletePassword(service, account).then( () => {
      callback(null, true)
    }).catch( (err) => {
      callback(err, false)
    })
  },

  /**
   * Write a passphrase to the keychain. Will overwrite.
   * @param service The app id as stored in the keychain.
   * @param account The account username.
   * @param secret [optional] The secret you wish to write.
   * @param callback Returns an error and true/false.
   * */
  writeKeychain: function(service, account, secret, callback) {
    keytar.setPassword(service, account, secret).then( () => {
      callback(null, true)
    }).catch( (err) => {
      callback(err, false)
    })
  }
}
