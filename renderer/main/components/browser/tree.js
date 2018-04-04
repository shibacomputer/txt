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
    const items = state.data.ui.sidebar.item
    const text = state.data.text

    if (dir) {
      return html`
        <ul class=${style.tree}>
          ${
            dir.map( (f) => {
              var opts = { }
              opts.list = state.data.ui.sidebar.openDirs.indexOf(f.id) !== -1 ? true : false
              opts.focus = matchesFocus(f, items)
              opts.active = matchesActive(f, items)
              opts.rename = (matchesFocus(f, items) && state.data.ui.sidebar.renaming) ? true : false
              opts.modified = (matchesOpen(f, text) && state.data.modified) ? true : false
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

  function matchesActive(f, items) {
    if (!items.active.id) return
    if (items.active.id === f.id
      || items.active.uri === f.uri) return true
    else return false
  }

  function matchesFocus(f, items) {
    if (!items.focus.id) return
    if (items.focus.id === f.id
      || items.focus.uri === f.uri) return true
    else return false
  }

  function matchesOpen(f, text) {
    if (!text.id) return
    if (text.id === f.id
      || text.uri === f.uri) return true
    else return false
  }
}
