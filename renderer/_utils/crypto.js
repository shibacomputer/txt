const remote = window.require('electron').remote
const openpgp = require('openpgp')
const keytar = remote.require('keytar')

openpgp.initWorker({ path: '../../node_modules/openpgp/dist/openpgp.worker.min.js' })
openpgp.config.aead_protect = true
openpgp.config.use_native = true
openpgp.config.compression = openpgp.enums.compression.bzip2

module.exports = {

  /**
   * Encrypt data.
   * @param key The key or passphrase for authentication.
   * @param data The data to encrypt.
   * @param callback Returns errors or an encrypted blob.
   * */
  encrypt: function(key, data, callback) {
    var opts = {
      data: data.contents,
      format: data.encoding,
      password: key.phrase? key.phrase : null,
      filename: data.filename,
      armor: true
    }
    console.log('crypto:encrypt: opts: ', opts, ' key: ', key)
    openpgp.encrypt(opts).then((result) => {
      opts = null
      console.log('crypto:encrypt: done. result: ', result)
      callback(null, result)
    }).catch( (err) => {
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
      password: key.phrase? key.phrase : null
    }
    console.log('crypto:decrypt: opts: ', opts, 'key: ', key)
    openpgp.decrypt(opts).then((result) => {
      console.log('crypto:decryupt: result: ', result)
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
   * Reads a secret from the keychain.
   * @param service The app id as stored in the keychain.
   * @param account The account username.
   * @param callback Returns an error and the secret.
   * */
  readKeychain: function(service, account, callback) {
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
