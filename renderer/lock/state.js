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
    state.phrase = null
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
    console.log(state.phrase)
  }

  function sendToParent() {
    let message = {
      secret: state.phrase,
      type: state.type
    }
    ipcRenderer.send('modal:parent:send', message)
    ipcRenderer.once('modal:parent:response', (event, arg) => { 

      /*
        1.  Check response.
            - Possible responses: 'Valid / Invalid'
        2.  What do I do next?
            - Possible responses: close.
      */
      switch (arg.success) {
        case true:
          ipcRenderer.send('window:modal:parent:done')
          window.close()
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
    window.close()
  }

  ipcRenderer.on('window:modal:init', (event, opts) => {
    emitter.emit('state:init', opts)
  })
}

module.exports = state
