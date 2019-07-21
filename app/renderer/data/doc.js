const ipcRenderer = window.require('electron').ipcRenderer
const _ = require('underscore')

export default function doc (state, emitter) {
  resetDocument()

  emitter.on('DOMContentLoaded', () => {

    ipcRenderer.on('doc:new', newDocument)
    ipcRenderer.on('doc:load', loadDocument)
    ipcRenderer.on('doc:save', saveDocument)
    ipcRenderer.on('doc:revert', revertDocument)
    ipcRenderer.on('doc:export', exportDocument)
    ipcRenderer.on('doc:close', closeDocument)

    emitter.on('doc:update', (doc) => {
      state.doc.words = wordCount(doc.contents)
      state.doc.contents = doc.contents

      updateContext()
    })
  })
  async function newDocument() {
    checkRequirements({ editorHasChanges: true } )
    .then((satisfied) => {
      if(satisfied) showModal('hasChanges', { documentName: state.doc.title })
      .then((changeAction) => {
        if (changeAction.valueOf() === 0) {
          emitter.emit('context:update', { working: true })
          saveDocument()
          .then( () => {
            resetDocument()
            updateContext()
            return
          })
          .catch((err) => {
          })
        } else if (changeAction.valueOf() === 1) {
          resetDocument()
          updateContext()
          return
        } else {
          return
        }
      })
      else {
        resetDocument()
        updateContext()
      }
    })
  }
  async function loadDocument(sender) {
    getReadUri()
    .then((readUri) => {
      checkRequirements({ editorHasChanges: true } )
      .then((satisfied) => {
        if (satisfied) {
          showModal('hasChanges', { documentName: state.doc.title })
          .then((changeAction) => {
            if (changeAction.valueOf() === 0) {
              emitter.emit('context:update', { working: true })
              saveDocument()
              .then( () => {
                resetDocument({ title: readUri.fn })
                load(readUri)
                .then(updateContext())
                return
              })
              .catch((err) => {
              })
              .finally(() => {
                updateContext()
              })
            } else if (changeAction.valueOf() === 1) {
              resetDocument({ title: readUri.fn })
              load(readUri)
              .then(updateContext())
              return
            } else {
              return
            }
          })
        } else {
          resetDocument({ title: readUri.fn })
          emitter.emit('context:update', { working: true })
          load(readUri)
          .then(updateContext())
        }
      })
    })
    .catch((err) => {
    })
  }

  async function load(target) {
    let payload = {
      author: state.author.name,
      key: state.author.key.privkey,
      opts: {
        uri: target.uri,
        enc: 'utf8'
      }
    }
    ipcRenderer.send('fs:read', payload)
    ipcRenderer.once('fs:read', (e, file) => {
      if(file) {
        state.doc = {
          contents: file.data,
          contributors: [],
          created: file.birthTime,
          id: 0,
          lastUpdated: file.mTime,
          uri: file.uri,
          uriParsed: file.uriParsed,
          staleContents: file.data,
          title: file.title,
          words: wordCount(file.data)
        }
        updateContext()
        emitter.emit('context:update', { working: false })
      }
      return
    })
  }

  async function saveDocument(sender, asNew = false, data = state.doc.contents, enc = 'utf8') {
    if (!state.context.authorExists) {
      abortSave()
      return
    }

    let payload = {
      author: state.author.name,
      key: state.author.key.privkey,
      ring: [ state.author.key.pubkey ],
      data: data,
      opts: {
        enc: enc,
      }
    }

    if (state.doc.uri && !asNew) {
      emitter.emit('context:update', { working: true })
      payload.opts.uri = state.doc.uri
      payload.opts.ext = state.doc.uriParsed.ext
      payload.opts.fn = state.doc.title

      save(payload)
      .then((file) => {
        let date = new Date
        state.doc.lastUpdated = date
        state.doc.staleContents = state.doc.contents
        state.doc.uri = payload.opts.uri
        state.doc.title = payload.opts.fn

        updateContext()
        return
      })
    } else {
      await getWriteUri()
      .then((writeUri) => {
        if (!writeUri) return

        payload.opts.uri = writeUri.uri
        payload.opts.ext = writeUri.ext
        payload.opts.fn = writeUri.fn

        save(payload)
        .then((file) => {
          let date = new Date
          state.doc.lastUpdated = date
          state.doc.created = date
          state.doc.staleContents = state.doc.contents
          state.doc.uri = file.uri
          state.doc.title = payload.opts.fn
          state.doc.uriParsed = file.uriParsed
          state.doc.ext = file.ext

          updateContext()
          return
        })
      })
      .catch((err) => {

      })
    }
  }
  async function save(payload) {

    })
  }

  async function revertDocument() {
    showModal('willRevert', { documentName: state.doc.title })
    .then((response) => {
      if (response.valueOf() !== 0) return
      state.doc.contents = state.doc.staleContents

      updateContext()
    })
    .catch(() => {
      return
    })
  }

  async function exportDocument(sender, asType = '.txt', data = state.doc.contents, enc = 'utf8') {
    let payload = {
      data: data,
      opts: {
        enc: enc,
        ext: asType,
        fn: state.doc.title,
        notify: true
      }
    }

    let options = {
      name: payload.opts.fn,
      ext: payload.opts.ext
    }

    getWriteUri(options)
    .then((writeUri) => {
      if (!writeUri) return

      payload.opts.uri = writeUri.uri
      payload.opts.fn = writeUri.fn

      save(payload)
    })
  }

  async function resetDocument(tempDoc = { }) {
    state.doc = {
      contents: '',
      contributors: [],
      created: null,
      id: 0,
      lastUpdated: null,
      uri: null,
      uriParsed: null,
      staleContents: '',
      title: tempDoc.title || 'Untitled',
      words: 0
    }
    updateContext()
  }

  async function closeDocument() {
    checkRequirements({ editorHasChanges: true } )
    .then((satisfied) => {
      if(satisfied) showModal('hasChanges', { documentName: state.doc.title })
      .then((changeAction) => {
        if (changeAction.valueOf() === 0) {
          saveDocument()
          .then( () => {
            emitter.emit('close')
            return
          })
          .catch((err) => {
          })
        } else if (changeAction.valueOf() === 1) {
          emitter.emit('close')
          return
        } else {
          return
        }
      })
      else emitter.emit('close')
    })
  }

  function wordCount(words) {
    if (!words || words === '') return 0
    let wc = words.replace(/(^\s*)|(\s*$)/gi,"")
    wc = wc.replace(/[ ]{2,}/gi," ")
    wc = wc.replace(/\n /,"\n")
    wc = wc.split(' ').length
    return new Intl.NumberFormat('en-US').format(wc)
    // TODO: Internationalisation
  }

  function abortSave() {
    showModal('needsAuthor')
    .then((changeAction) => {
      if (changeAction.valueOf() === 0) {
        ipcRenderer.send('modal:show', 'prefs', {
          payload: {
            resource: 'prefs'
          }
        })
      } else {
        return
      }
    })
  }

  function updateContext() {
    let hasChanges = state.doc.contents != state.doc.staleContents

    emitter.emit('context:update', {
      editorHasChanges: hasChanges,
      documentHasPath: state.doc.uri? true : false,
      editorHasContent: state.doc.contents.length > 0? true : false
    })

    let windowTitle = hasChanges ? state.doc.title + ' – Edited' : state.doc.title
    ipcRenderer.send('window:title', windowTitle)
  }

  async function checkRequirements(reqs) {
    return new Promise((resolve, reject) => {
      let satisfied = false
      if (_.isMatch(state.context, reqs)) {
        satisfied = true
      }
      resolve(satisfied)
    })
  }

  async function getReadUri() {
    return new Promise((resolve, reject) => {
      ipcRenderer.send('modal:show', 'open')
      ipcRenderer.once('modal:show', (e, response) => {
        if (response) resolve(response)
        reject(false)
      })
    })
  }

  async function getWriteUri(options = { name: state.doc.name, ext: '.gpg' }) {
    return new Promise((resolve, reject) => {
      ipcRenderer.send('modal:show', 'saveNew', options)
      ipcRenderer.once('modal:show', (e, response) => {
        if (response) resolve(response)
        else reject()
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
