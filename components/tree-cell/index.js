const html = require('choo/html'),
      style = require('./style')

module.exports = treeCell

function treeCell(item, emit) {
  if (item.type === 'directory') {
    return html`${ initDir() }`
  } else {
    return html`${ initFile() }`
  }

  function initDir() {
    return html`
      <a data-path=${item.path} class="${style} ${item.selected? 'highlight' : ''} ${item.editing? 'editing' : ''}" onclick=${open} ondblclick=${startRename}>
        <div data-path=${item.path}>
          <svg data-path=${item.path} data-uri=${item.path} viewBox="0 0 16 12">
            <use data-path=${item.path} xlink:href="#txt-${item.open? 'dir-open' : 'dir' }" />
          </svg>
          ${ item.rename?
            html`<input data-path=${item.path} type="text" value=${item.name} onblur=${submitRename}>` :
            html`<span data-path=${item.path}>${item.name}</span>`
          }
        </div>
      </a>
    `
  }
  function initFile() {
    var filename = item.name.replace('.txt.gpg', '')
    return html`
      <a data-path=${item.path} class="${style} ${item.selected? 'highlight' : ''} ${item.editing? 'editing' : ''}" onclick=${openFile} ondblclick=${startRename}>
        <div data-path=${item.path}>
          <svg data-path=${item.path} viewBox="0 0 16 12">
            <use data-path=${item.path} xlink:href="#txt-${item.changed? 'file-changed' : 'file' }" />
          </svg>
          ${ item.rename?
            html`<input data-path=${item.path} type="text" value=${filename} onblur=${submitRename}> ` :
            html`<span data-path=${item.path}>${filename}</span>`
          }
        </div>
      </a>
    `
  }

  function open(e){
    if (!item.rename) {
      var target = e.target.getAttribute('data-path')
      emit('filesystem:open', target)
    }
  }
  function openFile(e) {
    if (!item.rename) {
      var target = e.target.getAttribute('data-path')
    }
  }
  function startRename(e) {
    if (!item.rename) {
      var target = e.target.getAttribute('data-path')
      emit('filesystem:edit', target)
    }
  }

  function submitRename(e) {
    if (item.rename) {
      var target = {
        oldName: e.target.getAttribute('data-path'),
        newName: e.target.value
      }
      emit('filesystem:edit', target.oldName)
      emit('filesystem:rename', target)
    }

  }
}
