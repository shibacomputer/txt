const html = require('choo/html')
const style = require('./style')
const cell = require('./cell')

module.exports = tree

function tree(state, emit) {
  console.log(state.lib.children.filter(f => (f.mime === "text/gpg" || f.type === "directory")))
  if (typeof state.lib === 'undefined') return initEmptyState()
  else if (state.lib.children.filter(f => (f.mime === "text/gpg" || f.type === "directory")).length > 0) return initTree()
  else return(initEmptyState())

  function initTree() {
    return html`
      <main class="${style.treeBase}">
        ${ tree(state.lib.children) }
      </main>
    `
  }

  function initEmptyState() {
    return html`
      <main class=${style.emptyTreeBase}>
        <div class=${style.emptyTreeIllustration}>
          <svg>
            <use xlink:href="#txt-writer">
          </svg>
        </div>
        <div class=${style.emptyTreeMessage}>
          Welcome to Txt.<br />
          Each file you create is 
          encrypted and stored in your library.

          <div class=${style.emptyTreeActions}>
            <button data-type="file" name="file" onclick=${make}>New File</button>
            <button data-type="dir" name="dir" onclick=${make}>New Folder</button>
          </div>
          <button class=${style.emptyTreeSecondaryAction} onclick=${openGuide}>Welcome Guide</button>
        </div>

      </main>
    `
  }

  function make(e) {
    if(e.srcElement.dataset.type === 'file') emit('state:item:make', 'file')
    else emit('state:item:make', 'directory')
  }

  function openGuide() {
    require('electron').shell.openExternal('https://txtapp.io/support/guide')
  }

  function match(f, target) {
    if (target.id === f.id) return true
    else return false
  }

  function tree(dir) {
    const focus = state.status.focus
    const active = state.status.active
    const text = state.composer

    if (dir) {
      return html`
        <ul class=${style.tree}>
          ${
            dir.map( (f) => {
              var opts = { }
              opts.list = state.sidebar.openDirs.indexOf(f.id) !== -1 ? true : false
              opts.focus = match(f, focus)
              opts.active = match(f, active)
              opts.rename = (match(f, focus) && state.status.renaming) ? true : false
              opts.modified = (match(f, text) && state.status.modified) ? true : false
              if (
                (f.mime === 'text/gpg' || f.type === 'directory') &&
                (f.name.slice(0,1) !== '.')
              ) {
                return html`
                  <li>
                    ${ cell(f, opts, emit) }
                    ${ (f.type === 'directory' && opts.list) ? tree(f.children) : null}
                  </li>
                `
              }
            })
          }
        </ul>
      `
    }
  }
}
