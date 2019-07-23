const openpgp = require('openpgp')
const keychain = require('./keychain')

openpgp.initWorker({ path:'./utils/openpgp.worker.min.js' })
openpgp.config.use_native = true

export async function encrypt(payload) {
  let secret = await keychain.get(payload.user)
  let config = {
    message: openpgp.message.fromText(payload.data),
    type: 'utf8'
  }
  // if (usePhrase) {
  //   console.log('what am i doing here')
  //   config.passwords = [ payload.phrase ]
  // }
  //
  // else {
  const privkey = payload.key

  const privKeyObj = (await openpgp.key.readArmored(privkey)).keys[0]

  // Test and throw error before we get too far
  try {
    await privKeyObj.decrypt(secret)
  } catch (e) {
    throw e
  }

  let pubkeys = [ ]
  for (var i=0; i < payload.ring.length; i++) {
    try { // I can't believe I have to do it this way.
      let newKey = (await openpgp.key.readArmored(payload.ring[i])).keys[0]
      pubkeys.push(newKey)
    } catch (e) {
      throw e
    }
  }

  config.publicKeys = pubkeys
  config.privateKeys = [privKeyObj]

  let encrypted

  try {
    encrypted = await openpgp.encrypt(config)
  } catch(e) {
    throw e
  }

  return encrypted.data
}

export async function decrypt(payload) {
  let secret = payload.phrase? payload.phrase : await keychain.get(payload.user)

  let config = {
    message: await openpgp.message.readArmored(payload.data),
    type: 'utf8'
  }

  const privkey = payload.key
  const privKeyObj = (await openpgp.key.readArmored(privkey)).keys[0]

  try {
    await privKeyObj.decrypt(secret)
  } catch (e) {
    throw e
  }

  config.privateKeys = [privKeyObj]

  let plaintext

  try {
    plaintext = await openpgp.decrypt(config)
  } catch (e) {
    throw e
  }

  return plaintext.data
}

export async function make(user, secret) {
  const opts = {
    userIds: [{ name: user }],
    curve: 'brainpoolP512r1',
    passphrase: secret
  }

  let key

  try {
    key = await openpgp.generateKey(opts)
  } catch (e) {
    throw e
  }
  return key
}

export async function identify(key) {
  let identifiedKey = (await openpgp.key.readArmored(key)).keys[0]
  return identifiedKey.users[0]
}

export async function parse(key) {
  let parsedKey = {
    privkey: (await openpgp.key.readArmored(key.privkey)).keys[0],
    pubkey: (await openpgp.key.readArmored(key.pubkey)).keys[0]
  }
  return parsedKey
}

export async function unlock(privateKey, secret) {
  let unlockedKey = (await openpgp.key.readArmored(privateKey)).keys[0]
  try {
    unlockedKey.decrypt(secret)
    .then(() => {
      return unlockedKey
    })
    .catch((e) => {
      throw e
    })
  } catch(e) {
    throw e
  }
  
}
