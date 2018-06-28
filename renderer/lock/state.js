const { ipcRenderer } = require('electron')
const Mousetrap = require('mousetrap')

function state (state, emitter) {
  emitter.on('DOMContentLoaded', () => {

    emitter.on('state:init', init)
    emitter.on('state:passphrase:update', update)
    emitter.on('state:passphrase:send', sendToParent)
    emitter.on('state:cancel', cancel)

    Mousetrap.bind('esc', () => { emitter.emit('state:cancel') }, 'keyup') })

  function init (opts) {
    state.phrase = ''
    state.valid = false
    state.error = false
    state.next = ''
    state.show = true
    state.type = opts.type

    emitter.emit(state.events.RENDER)
  }

  function update(phrase) {
    if (state.error || state.valid) {
      state.error = false
      state.valid = false
      emitter.emit(state.events.RENDER)
    }
    state.phrase = phrase
  }

  function sendToParent() {
    let message = {
      secret: state.phrase,
      type: state.type
    }
    ipcRenderer.send('modal:parent:send', message)
    ipcRenderer.once('modal:parent:response', (event, arg) => { 

      switch (arg.success) {
        case true:
          window.setTimeout( () => {
            ipcRenderer.send('modal:done', { type: state.type, success: true, cancel: false })
          }, 500)
          
        break
        case false:
          state.error = true
          state.valid = false
          emitter.emit(state.events.RENDER)
        break
      }
    })

  }

  function cancel() {
    ipcRenderer.send('modal:done', { type: state.type, success: false, cancel: false })
  }

  ipcRenderer.on('modal:init', (event, opts) => {
    emitter.emit('state:init', opts)
  })
}

module.exports = state
