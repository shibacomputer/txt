const html = require('choo/html')
const path = require('path')
const style = require('./style')

module.exports = treeCell

function treeCell(item, opts, emit) {
  opts = typeof opts === "object" ? opts : {}
	opts.open = typeof opts.open !== "undefined" ? opts.open : []
  opts.focus = typeof opts.focus !== "undefined" ? opts.focus : false
  opts.rename = typeof opts.rename !== "undefined" ? opts.rename : false
  var open = opts.open.indexOf(item.id) > -1 ? true : false
  var focus = opts.focus == item.id
  var rename = opts.rename == item.id

  if (item.type === 'directory') {
    return html`${ initDir() }`
  } else {
    return html`${ initFile() }`
  }

  function initDir() {

    return html`
      <a data-id=${item.id} class="${style} ${focus? 'highlight' : ''} ${rename? 'editing' : ''}" onclick=${select} ondblclick=${openDir}>
        <div data-id=${item.id}>
          <svg data-id=${item.id} data-uri=${item.path} onclick=${openDir}>
            <use data-id=${item.id} xlink:href="#txt-${open? 'dir-open' : 'dir' }" />
          </svg>
          ${ item.rename?
            html`<input data-id=${item.id} data-parent=${item.parent} type="text" value=${item.name} onblur=${submitRename}>` :
            html`<span data-id=${item.id}>${item.name}</span>`
          }
        </div>
      </a>
    `
  }
  function initFile() {
    var filename = item.name.replace('.txt.gpg', '')
    return html`
      <a data-id=${item.id} class="${style} ${focus? 'highlight' : ''} ${rename? 'editing' : ''}" onclick=${select} ondblclick=${openFile}>
        <div data-id=${item.id}>
          <svg data-id=${item.id}>
            <use data-id=${item.id} xlink:href="#txt-${item.changed? 'file-changed' : 'file' }" />
          </svg>
          ${ item.rename?
            html`<input data-id=${item.id} type="text" value=${filename} onblur=${submitRename}> ` :
            html`<span data-id=${item.id}>${filename}</span>`
          }
        </div>
      </a>
    `
  }

  function openDir(e) {
    var target = e.target.getAttribute('data-id')
    emit('sys:status:open:update', target)
  }

  function select(e) {
    var target = e.target.getAttribute('data-id')
    emit('sys:status:focus:update', target)
  }

  function openFile(e) {
    var target = e.target.getAttribute('data-id')
    emit('sys:status:active:update', target)
    emit('note:open', target)
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
