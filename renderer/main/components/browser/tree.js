const html = require('choo/html')
const style = require('./style')
const cell = require('./cell')
const io = require('../../../_utils/io')
module.exports = tree

function tree(state, emit) {
  if (typeof state.lib != 'undefined') return initTree()

  function initTree () {
    return html`
      <main class="${style.treeBase}">
        ${ tree(state.lib.children) }
      </main>
    `
  }

  function match(f, target) {
    if (!target.id) return
    if (target.id === f.id
      || target.uri === f.uri) return true
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
