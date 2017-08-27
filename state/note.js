const remote = window.require('electron').remote
const { dialog } = remote.require('electron')
const { ipcRenderer } = window.require('electron')

const path = require('path')
const utils = require('../utils/utils')
const file = require('../utils/files')

module.exports = noteState

function noteState (state, emitter) {
  init()

  emitter.on('DOMContentLoaded', function () {
    emitter.emit('log:debug', 'Loading Note Store')
    emitter.on('note:new', init)
    emitter.on('note:open', open)
    emitter.on('note:update', update)
    emitter.on('note:close', close)
    ipcRenderer.on('menu:file:new', (e) => { begin('new', 'note:new') })
    ipcRenderer.on('menu:file:open', (e) => { begin('open', 'note:open') })
    ipcRenderer.on('menu:file:save', (e) => { begin('save', 'note:update') })
    ipcRenderer.on('menu:file:duplicate', (e) => { begin('duplicate', 'note:update') })
    ipcRenderer.on('menu:file:close', (e) => { begin('close', 'note:close') })
  })

  function init(cb) {
    state.note = {
      path: null,
      title: 'Untitled',
      staleBody: '',
      body: '',
      status: {
        loading: false,
        modified: false
      }
    }
    ipcRenderer.send('menu:note:modified', state.note.status.modified)
  }

  function begin(from, to) {
    emitter.emit('log:debug', 'Beginning route')
    if (state.note.status.modified || from === 'duplicate') {
      // We need to decide if we're going to save
      decide(from, (response) => {
        switch (response) {
          case 0: // Save
            save((err) => {
              if (!err && to) {
                emitter.emit(to)
              } else {
                showErr(err)
              }
            })
            break
          case 1:
            init()
            emitter.emit(to)
            break
          case 2:
            break
        }
      })
    } else {
      if (from === 'save') {
        save((err) => {
          if (!err && to) {
            emitter.emit(to)
          } else {
            showErr(err)
          }
        })
      } else {
        console.log(to)
        emitter.emit(to)
      }
    }
  }

  function decide(from, cb) {
    var detail
    //@TODO: Localisation here lol
    switch (from) {
      case 'save':
        cb(0)
        return
        break
      case 'duplicate':
        state.note.path = null
        cb(0)
        return
        break
      case 'new':
        detail = 'Your changes will be lost if you create a new file without saving.'
        break
      case 'close':
        detail = 'Your changes will be lost if you close without saving.'
        break
      case 'open':
        detail = 'Your changes will be lost if you open another file without saving.'
        break
      case 'quit':
        detail = 'Your changes will be lost if you quit without saving.'
        break
      default:
        detail = 'Your changes will be lost if you choose to discard them.'
    }

    dialog.showMessageBox(remote.getCurrentWindow(), {
      type: 'question',
      buttons: [
        'Encrypt & Save',
        'Discard',
        'Cancel'
      ],
      defaultId: 0,
      title: 'Save changes...',
      message: state.note.title + ' has unsaved changes. Do you want to save?',
      detail: detail
    }, (response) => {
      cb(response)
    })
  }

  function showErr (err) {
    dialog.showMessageBox({
      type: 'error',
      buttons: [
        'OK',
        'Report Issue'
      ],
      title: 'Error',
      message: 'Error',
      detail: err
    })
  }

  function save (cb) {
    var err
    emitter.emit('log:debug', 'Beginning save process')
    saveto ((target) => {
      file.write(state.note, {
        type: state.key.type
      }, (err) => {
        if (!err) {
          state.note.status.modified = false
          state.note.staleBody = state.note.body
          ipcRenderer.send('menu:note:modified', state.note.status.modified)
          emitter.emit('render')
        }
        cb(err)
      })
    })
  }

  function saveto (cb) {
    if (!state.note.path) {
      dialog.showSaveDialog(remote.getCurrentWindow(), {
        title: 'Save File',
        buttonLabel: 'Save',
        nameFieldLabel: state.note.title,
        filters: [
          { name: 'Encrypted Text', extensions: ['gpg'] }
        ]
      }, (savePath) => {
        if (savePath) {
          // @TODO: Move decryption out of the renderer.
          state.note.path = path.normalize(savePath)
          var title = state.note.path.split('/')
          title = title[title.length-1].replace(/\.[^/.]+$/, "") // @TODO: Replace this with better handling
          state.note.title = title
          cb(savePath)
        }
      })
    } else {
      cb(state.note.path)
    }
  }

  function open (target) {
    emitter.emit('log:debug', 'Opening a note')

    openfrom((target) => {
      if (target != state.note.path) {
        file.open(target, {
          type: state.key.type
        }, (n, err) => {
          var url = target.split('/')
          var note = {
            path: target,
            title: url[url.length-1].replace(/\.[^/.]+$/, ""), // @TODO: Replace this with better handling
            staleBody: n.data,
            body: n.data,
            status: {
              modified: false,
              loading: false
            }
          }
          state.note = note
          ipcRenderer.send('menu:note:isNew', false)
          emitter.emit('render')
        })
      }
    })
  }

  function openfrom (cb) {
    dialog.showOpenDialog(remote.getCurrentWindow(), {
      title: 'Open File',
      buttonLabel: 'Open',
      properties: ['openFile'],
      filters: [
        { name: 'Encrypted Text', extensions: ['gpg'] }
      ]
    }, (filePath) => {

      if (filePath) {
        cb(path.normalize(filePath[0]))
      }
    })
  }


  function update (changes) {
    if (typeof changes === 'object') {
      state.note.body = changes.body
      state.note.staleBody = changes.staleBody
      state.note.status.modified = changes.modified
    }
  }
}
