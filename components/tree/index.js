const html = require('choo/html'),
      style = require('./style'),

      treeCell = require('../tree-cell')

module.exports = tree

function tree(state, emit) {
  if (state.filesystem || state.filesystem.children.length != 0) return initTree()
  else console.log('empty')
  
  return html` ${initTree()}`

  function initTree () {
    return html`${ tree(state.filesystem.children) }`
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
