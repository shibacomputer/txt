const ipcRenderer = window.require('electron').ipcRenderer

export default function core (state, emitter) {

  emitter.on('DOMContentLoaded', () => {
    state.deferred = [ ]

    emitter.on('defer', (deferredEvent) => {
      state.deferred.push(deferredEvent)
    })

    emitter.on('reset', () => {
      state.deferred = [ ]
    })

    emitter.on('next', () => {
      emitter.emit(state.deferred[0].action, state.deferred[0].payload)
      state.deferred.shift()
    })
    emitter.on('open', (uri) => {
      ipcRenderer.send('open', uri)
    })

    ipcRenderer.on('message', (e, response) => {
      emitter.emit(response.action, response.payload)
    })

    emitter.on('close', () => {
      window.close()
    })
  })
}
