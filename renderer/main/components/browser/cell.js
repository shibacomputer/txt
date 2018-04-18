const html = require('choo/html')
const path = require('path')
const style = require('./style')

module.exports = cell

function cell(f, opts, emit) {
  opts = typeof opts === "object" ? opts : {}
  if(f.type === 'directory') return html`${dirCell()}`
  else return html`${fileCell()}`
  function dirCell() {
    return html`
      <button onclick=${select} ondblclick=${open} oncontextmenu=${context}
                class="${style.cell} ${opts.focus? style.focus : '' } ${opts.active? style.active : '' } ${opts.rename? style.rename : '' }">
        <svg class=${style.icon}>
          <use xlink:href="#txt-${ opts.list ? 'dir-open' : 'dir'}">
        </svg>
        <div class=${style.metadata}>
          ${opts.rename?
            html`<input autofocus={opts.rename} id="rename" type="text" value=${f.name} class=${style.input} onblur=${finishRename} onkeyup=${update} />` :
            `${f.name}`}
        </div>
      </button>
    `
  }

  function fileCell() {
    var name = f.name.replace('.gpg', '')
    return html`
      <button onclick=${select} ondblclick=${open} oncontextmenu=${context}
                class="${style.cell} ${opts.focus? style.focus : ''} ${opts.active? style.active : ''} ${opts.rename? style.rename : ''} ${opts.modified? style.modified : ''}">
        <svg class=${style.icon}>
          <use xlink:href="#txt-file">
        </svg>
        <div class=${style.metadata}>
          ${opts.rename?
            html`<input autofocus={opts.rename} id="rename" type="text" value=${name} class=${style.input} onblur=${finishRename} onkeyup=${update} />` :
            `${name}`}
        </div>
      </button>
    `
  }

  function finishRename(e, code) {
    if (e.srcElement && code != "Escape") {
      f.newUri = e.srcElement.value + (f.type === 'file'? '.gpg' : '')
      emit('state:library:rename:commit', f, code)
    } else {
      f.newUri = f.name + (f.type === 'file'? '.gpg' : '')
      emit('state:library:rename:commit', f, code)
    }
  }

  function select(e) {
    if (opts.rename) return
    emit('state:library:select', f)
  }

  function open(e) {
    if (opts.rename) return
    if (f.type === 'file' && !opts.active) {
      emit('state:library:open:' + f.type, f)
    } else if (f.type === 'directory') {
      emit('state:library:open:' + f.type, f)
    }
  }

  function context(e) {
    if (opts.rename) return
    emit('state:library:select', f)
    emit('state:library:context:display', 'browser-cell')
  }

  function update(e) {
    if(e.key === "Enter" || e.key === "Escape") {
      finishRename(e, e.key)
    }
    e.srcElement.style.width = ((this.value.length + 1) * 8) + 'px';
  }
}
