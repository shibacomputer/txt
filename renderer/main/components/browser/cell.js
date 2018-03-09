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
      <button onclick=${select} ondblclick=${open}
                class="${style.cell} ${opts.focus? style.focus : '' } ${opts.active? style.active : '' } ${opts.rename? style.rename : '' }">
        <svg class=${style.icon}>
          <use xlink:href="#txt-${ opts.list ? 'dir-open' : 'dir'}">
        </svg>
        <div class=${style.metadata}>
          ${f.name}
        </div>
      </button>
    `
  }

  function fileCell() {
    var name = f.name.replace('.gpg', '')
    return html`
      <button onclick=${select} ondblclick=${open}
                class="${style.cell} ${opts.focus? style.focus : '' } ${opts.active? style.active : '' } ${opts.rename? style.rename : '' } ${opts.modified? style.modified : ''}">
        <svg class=${style.icon}>
          <use xlink:href="#txt-file">
        </svg>
        <div class=${style.metadata}>
          ${name}
        </div>
      </button>
    `
  }

  function select(e) {
    emit('state:library:select', f)
  }

  function open(e) {
    emit('state:library:open:' + f.type, f)
  }
}
