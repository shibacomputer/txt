const html = require('choo/html')
const style = require('./style')
const treeCell = require('../tree-cell')

module.exports = tree

function tree(state, emit) {
  var opts = {
    open: state.sys.status.open,
    focus: state.sys.status.focus,
    rename: state.sys.status.rename,
  }

  if (state.fs) return initTree()

  function initTree () {
    return html`${ tree(state.fs.children) }`
  }

  function tree(dir) {
    return html`
      <ul class="${style}">
        ${
          dir.map( (f) => {
            if (f.mime === 'text/gpg' || f.type === 'directory') {
              return html`
                <li>
                  ${ treeCell(f, opts, emit) }
                  ${ f.type === 'directory' && opts.open.indexOf(f.id) > -1 ? tree(f.children) : null }
                </li>
              `
            }
          })
        }
      </ul>
    `
  }
}
