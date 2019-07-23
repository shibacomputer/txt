const { ipcMain } = require('electron')
const keychain = require('./keychain')
const pgp = require('./pgp')

export function init() {
  ipcMain.on('author:create', (e, author) => {
    pgp.make(author.name, author.secret).then((key) => {
      e.sender.send('author:create', key)
    }).catch((e) => {
      throw(e)
    })
  })

  ipcMain.on('author:save', (e, account, secret) => {
    keychain.set(account, secret).then((response) => {
      if(response) e.sender.send('author:save', response)
    }).catch((e) => {
      console.log(e)
      throw(e)
    })
  })

  ipcMain.on('author:load', (e) => {
    keychain.get().then((response) => {
      if(response) e.sender.send('event:author:load', response)
    }).catch((e) => {
      console.log(e)
      throw(e)
    })
  })

  ipcMain.on('author:fetch', (e) => {
    keychain.load().then((response) => {
      if (response) {
        e.sender.send('author:fetch', response)
      }
      else e.sender.send('event:noauthor')
    }).catch((e) => {
      console.log(e)
      throw(e)
    })
  })

  ipcMain.on('author:delete', (e) => {
    keychain.load().then((accounts) => {
      for (var i=0; i < accounts.length; i++){
        keychain.del(accounts[i].account)
      }
      e.sender.send('author:delete')
    }).catch((e) => {
      throw(e)
    })
  })

  ipcMain.on('author:identify', (e, key) => {
    pgp.identify(key).then((identity) => {
      e.sender.send('author:identify', identity)
    }).catch((e) => {
      throw (e)
    })
  })

  ipcMain.on('author:parse', (e, key) => {
    pgp.parse(key).then((parsedKey) => {
      e.sender.send('author:parse', parsedKey)
    }).catch((e) => {
      throw (e)
    })
  })

  ipcMain.on('author:unlock', (e, key, secret) => {
    pgp.unlock(key, secret).then((result) => {
      e.sender.send('author:unlock', result)
    }).catch((e) => {
      console.log('hello')
      throw (e)
    })
  })
}
