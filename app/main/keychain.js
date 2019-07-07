const { app } = require('electron')
const keytar = require('keytar')

const APP_NAME = app.getName()

export async function get(account) {
  let secret
  try {
    secret = await keytar.getPassword(APP_NAME, account)
  } catch(e) {
    throw new Error(e)
  }
  return secret
}

export async function set(account, secret) {
  try {
    await keytar.setPassword(APP_NAME, account, secret)
  } catch(e) {
    throw new Error(e)
  }
  return true
}

export async function del(account) {
  try {
    keytar.deletePassword(APP_NAME, account)
  } catch(e) {
    throw new Error(e)
  }
  return true
}

export async function load() {
  let services = []
  try {
    services = await keytar.findCredentials(APP_NAME)
  } catch(e) {
    throw new Error(e)
  }
  return services
}
