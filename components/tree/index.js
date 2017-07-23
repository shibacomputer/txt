const html = require('choo/html')
const style = require('./style')
const treeCell = require('../tree-cell')

module.exports = tree

function tree(state, emit) {
  if (state.fs || state.fs.children.length != 0) return initTree()
  else console.log('empty')

  return html` ${initTree()}`

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
                  ${ treeCell(f, emit) }
                  ${ f.type === 'directory' && f.open ? tree(f.children) : null }
                </li>
              `
            }
          })
        }
      </ul>
    `
  }
}
