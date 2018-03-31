const html = require('choo/html')
const style = require('./style')
const cell = require('./cell')
const io = require('../../../_utils/io')
module.exports = tree

function tree(state, emit) {
  if (state.data.lib) return initTree()

  function initTree () {
    return html`
      <main class="${style.treeBase}">
        ${ tree(state.data.lib.children) }
      </main>
    `
  }

  function tree(dir) {
    if (dir) {
      return html`
        <ul class=${style.tree}>
          ${
            dir.map( (f) => {
              var opts = {}
              opts.active = state.data.ui.sidebar.activeId === f.id ? true : false
              opts.list = state.data.ui.sidebar.openDirs.indexOf(f.id) !== -1 ? true : false
              opts.focus = state.data.ui.sidebar.focusId === f.id ? true : false
              opts.rename = state.data.ui.sidebar.renamingId === f.id ? true : false
              opts.modified = (state.data.ui.sidebar.activeId === f.id && state.data.modified) ? true : false
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
