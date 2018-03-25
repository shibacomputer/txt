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
            html`<input id="rename" type="text" value=${f.name} class=${style.input} onblur=${finishRename} />` :
            `${f.name}`}
        </div>
      </button>
    `
  }

  function fileCell() {
    var name = f.name.replace('.gpg', '')
    return html`
      <button onclick=${select} ondblclick=${open} oncontextmenu=${context}
                class="${style.cell} ${opts.focus? style.focus : '' } ${opts.active? style.active : '' } ${opts.rename? style.rename : '' } ${opts.modified? style.modified : ''}">
        <svg class=${style.icon}>
          <use xlink:href="#txt-file">
        </svg>
        <div class=${style.metadata}>
          ${opts.rename?
            html`<input id="rename" type="text" value=${name} class=${style.input} onblur=${finishRename} onkeypress=${resize}/>` :
            `${name}`}
        </div>
      </button>
    `
  }

  function rename(e) {
    if (!opts.focus || opts.rename) return
    else {
      emit('state:library:rename:start', f)
    }
  }

  function finishRename(e) {
    f.newUri = e.srcElement.value + (f.type === 'file'? '.gpg' : '')
    emit('state:library:rename:end', f)
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
    emit('state:library:context:display', 'sidebar')
  }

  function resize(e) {
    e.srcElement.style.width = ((this.value.length + 1) * 8) + 'px';
  }

  // Utility classes

}
