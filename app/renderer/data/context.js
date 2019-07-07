const ipcRenderer = window.require('electron').ipcRenderer

export default function context (state, emitter) {
  state.context = {
    authorExists: false,
    authorIsNew: false,
    authorIsGenerating: false,
    authorIsLinking: false,
    canClose: true,
    documentHasPath: false,
    editorHasFocus: false,
    editorHasChanges: false,
    editorHasContent: false,
    hasDialog: false,
    isLocked: false,
    passphraseValidated: false,
    preferencesHaveChanges: false,
    working: false
  }

  emitter.on('DOMContentLoaded', () => {

    emitter.on('context:update', (obj) => {
      for (const key of Object.keys(obj)) {
        state.context[key] = obj[key]
      }
      emitter.emit('render')
      ipcRenderer.send('menu:update', 'main', state.context)
    })

  })
}
