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
    locale: getLocale(navigator.language),
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

  function getLocale(locale) {
    let lang
    if (locale.indexOf('en') !== -1) return 'en'
    else if (locale.indexOf('de') !== -1) return 'de'
    else if (locale.indexOf('fr') !== -1) return 'fr'
    else return 'en'
  }
}
