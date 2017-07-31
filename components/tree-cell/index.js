const html = require('choo/html')
const path = require('path')
const style = require('./style')

module.exports = treeCell

function treeCell(item, emit) {
  if (item.type === 'directory') {
    return html`${ initDir() }`
  } else {
    return html`${ initFile() }`
  }

  function initDir() {
    return html`
      <a data-path=${item.path} class="${style} ${item.selected? 'highlight' : ''} ${item.rename? 'editing' : ''}" onclick=${select} ondblclick=${open}>
        <div data-path=${item.path}>
          <svg data-path=${item.path} data-uri=${item.path} onclick=${open}>
            <use data-path=${item.path} xlink:href="#txt-${item.open? 'dir-open' : 'dir' }" />
          </svg>
          ${ item.rename?
            html`<input data-path=${item.path} data-parent=${item.parent} type="text" value=${item.name} onblur=${submitRename}>` :
            html`<span data-path=${item.path}>${item.name}</span>`
          }
        </div>
      </a>
    `
  }
  function initFile() {
    var filename = item.name.replace('.txt.gpg', '')
    return html`
      <a data-path=${item.path} class="${style} ${item.selected? 'highlight' : ''} ${item.rename? 'editing' : ''}" onclick=${select} ondblclick=${openFile}>
        <div data-path=${item.path}>
          <svg data-path=${item.path}>
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
      emit('fs:open', target)
    }
  }

  function select(e) {
    if(!item.rename) {
      var target = e.target.getAttribute('data-path')
      emit('fs:select', target)
    }
  }

  function openFile(e) {
    if (!item.rename) {
      var target = e.target.getAttribute('data-path')
      emit('note:open', target)
    }
  }

  function startRename(e) {
    console.log('I am renaming', e)
    if (!item.rename) {
      var target = e.target.getAttribute('data-path')
      emit('fs:edit', target)
    }
  }

  function submitRename(e) {
    if (item.rename) {
      var target = {
        oldName: e.target.getAttribute('data-path'),
        newName: path.join(e.target.getAttribute('data-parent'), e.target.value)
      }

      emit('fs:edit', target.oldName)
      emit('fs:rename', target)
    }

  }
}
