const ipcRenderer = window.require('electron').ipcRenderer

export default function author (state, emitter) {
  state.author = { }

  emitter.on('DOMContentLoaded', () => {
    state.author = { }
    emitter.on('author:init', initialiseAuthor)
    emitter.on('author:new', newAuthor)
    emitter.on('author:import', importAuthor)
    emitter.on('author:link', linkAuthor)
    emitter.on('author:delete', deleteAuthor)
    emitter.on('author:export', exportAuthor)
    emitter.on('author:validate', validateAuthor)

    emitter.emit('author:import')
  })

  function initialiseAuthor(author = { }, key = null) {
    state.author = author
    if (key) state.author.key = key

    emitter.emit('context:update', {
      authorExists: state.author.name && state.author.key? true : false,
      authorIsGenerating: false,
      authorIsLinking: state.author.key && !state.author.name? true: false,
      working: false,
      authorIsNew: false
    })
    emitter.emit('render')
  }

  // Create a new author
  function newAuthor(author) {
    if (!author) return
    emitter.emit('context:update', { working: true })

    ipcRenderer.send('author:create', author)
    ipcRenderer.once('author:create', (e, newKey) => {
      let key = {
        pubkey: newKey.publicKeyArmored,
        privkey: newKey.privateKeyArmored,
        cert: newKey.revocationCertificate
      }
      setup(author, key)
    })
  }

  // Import author from keychain
  function importAuthor() {
    if (author) return
    emitter.emit('context:update', { working: true })

    let author = {}, key = null

    ipcRenderer.send('author:fetch')
    ipcRenderer.once('author:fetch', (e, services) => {
      if (services.length === 0) {
        emitter.emit('author:init')
        return
      }

      // TODO Can implement multi user support here
      for (var i=0; i < services.length; i++){

        if (services[i].account.indexOf('@txt') !== -1) {
          author.keychainName = services[i].account
          key = JSON.parse(services[i].password)
        }
        else {
          author.name = services[i].account
        }
      }
      emitter.emit('author:init', author, key)
    })
  }

  // Link the author from disk
  function linkAuthor() {
    getReadUri()
    .then((readUri) => {
      let payload = {
        opts: {
          uri: readUri.uri,
          ext: readUri.ext,
          enc: 'utf8'
        }
      }
      ipcRenderer.send('fs:read', payload)
      ipcRenderer.once('fs:read', (e, file) => {
        emitter.emit('context:update', { working: true })
        let key = JSON.parse(file.data)
        let author = { }
        setup(author, key)
      })
    })
  }

  function setup(newAuthor = null, key = null) {
    if (!key) return
    setupKey(key)
    .then((keyResult) => {
      newAuthor.keychainName = keyResult.author.keychainName
      if(newAuthor.secret) {
        setupAuthor(newAuthor? newAuthor : keyResult.userid)
        .then(() => {
          newAuthor.secret = null
          emitter.emit('author:init', newAuthor? newAuthor : keyResult.author, key)
        })
        .catch((e) => {
          console.log(e)
        })
      } else {
        emitter.emit('author:init', newAuthor, key)
      }
    })
    .catch((e) => {
      console.log(e)
    })
  }

  async function setupKey(key = null) {
    return new Promise((resolve, reject) => {
      if (!key) reject()
      parse(key)
      .then((parsedKey) => {
        emitter.emit('context:update', { working: true })
        let newIdentity = {
          name: parsedKey.privkey.users[0].userId.userid,
          keychainName: parsedKey.privkey.users[0].userId.userid.concat('@txt')
        }
        ipcRenderer.send('author:save', newIdentity.keychainName, JSON.stringify(key))
        resolve({ key: key, author: newIdentity })
      }).catch((e) => {
        reject()
      })
    })
  }

  function validateAuthor(author) {
    if (!author.secret) return
    testKey(author.secret, state.author.key.privkey)
    .then(() => {
      setupAuthor(author)
      .then(() => {
        author.secret = null
        emitter.emit('author:init', author, state.author.key)
      })
    })
    .catch((e) => {
      console.log(e)
    })
  }

  async function setupAuthor(author = null) {
    return new Promise((resolve, reject) => {
      if (!author.secret) reject()
      ipcRenderer.send('author:save', author.name, author.secret)
      resolve()
    })
  }

  async function testKey(secret, key) {
    return new Promise((resolve, reject) => {
      ipcRenderer.send('author:unlock', key, secret)
      ipcRenderer.once('author:unlock', (e, result) => {
        result? resolve() : reject()
      })
    })
  }

  function deleteAuthor() {
    showModal('askToDeleteAuthor', { name: state.author.name })
    .then((changeAction) => {
      if (changeAction.valueOf() === 2) {
        deleteAuthorAndKey()
      } else if(changeAction.valueOf() === 1) {
        exportAuthor()
        .then(() => {
          deleteAuthorAndKey()
        })
        .catch((err) => {
          console.log(err)
        })
      } else {
        return
      }
    })
  }

  async function exportAuthor() {
    return new Promise((resolve, reject) => {
      let stringifiedKey = JSON.stringify(state.author.key)
      getWriteUri({ fn: state.author.name })
      .then((writeUri) => {
        if (!writeUri) return false
        emitter.emit('context:update', { working: true })

        let payload = {
          data: stringifiedKey,
          opts: {
            uri: writeUri.uri,
            ext: writeUri.ext,
            fn: writeUri.fn,
            notify: true
          }
        }

        ipcRenderer.send('fs:write', payload)
        ipcRenderer.once('fs:write', (e, notification) => {
          if(notification.notify) {
            let exportNotification = new Notification('Exported ' + notification.fn, {
              body: 'Click to reveal on disk…'
            })

            exportNotification.onclick = () => {
              ipcRenderer.send('find', notification.uri)
            }
          }
          emitter.emit('context:update', { working: false })
          resolve()
        })
      })
      .catch((e) => {
        reject()
      })
    })
  }

  function deleteAuthorAndKey() {
    ipcRenderer.send('author:delete')
    ipcRenderer.once('author:delete', () => {
      emitter.emit('author:init')
    })
  }

  async function parse(key) {
    return new Promise((resolve, reject) => {
      ipcRenderer.send('author:parse', key)
      ipcRenderer.once('author:parse', (e, parsedKey) => {
        parsedKey? resolve(parsedKey) : reject()
      })
    })
  }

  async function getReadUri(options) {
    return new Promise((resolve, reject) => {
      ipcRenderer.send('modal:show', 'authorImport')
      ipcRenderer.once('modal:show', (e, response) => {
        if (response) resolve(response)
        reject(false)
      })
    })
  }

  async function getWriteUri(options) {
    return new Promise((resolve, reject) => {
      ipcRenderer.send('modal:show', 'authorExport', options)
      ipcRenderer.once('modal:show', (e, response) => {
        if (response) resolve(response)
        else reject(false)
      })
    })
  }

  async function showModal(name, options) {
    return new Promise((resolve, reject) => {
      ipcRenderer.send('modal:show', name, options)
      ipcRenderer.once('modal:show', (e, response) => {
        let res = new Number(response)
        if (res) resolve(new Number(response))
        else reject()
      })
    })
  }
}
