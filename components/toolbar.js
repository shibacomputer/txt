const html = require('choo/html')
const css = require('sheetify')

module.exports = (left, right, title, emit) => {
  const base = css`
    :host {
      align-items: center;
      background-color: rgba(0,0,0,0.1);
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      font-size: 12px;
      height: 2.15rem;
      justify-content: space-between;
      width: 100%;
    }
    :host ul {
      display: flex;
      flex-direction: row;
      list-style: none;
    }
    :host .group {
      display: flex;
      flex-direction: row;
      flex-basis: 33%;
    }
    :host .left {
      justify-content: flex-start;
    }
    :host .center {
      color: var(--c);
      justify-content: center;
    }
    :host .right {
      justify-content: flex-end;
    }
    :host .right li {
      margin-left: 8px;
    }
  `
  function build (pos) {
    var items = pos === 'left'? left : right
    return html`
      <div class="${pos} group">
        <ul>
          ${ items? items.map( (item) => {
            console.log(item)
              return html`
                <li>
                  ${ item }
                </li>
              `
            }) : null
          }
        </ul>
      </div>
    `
  }

  function center() {
    if (title) {
      return html`
        <nav class="center group">
          ${ title }
        </nav>
      `
    }
  }

  return html`
    <header class="${base}">
      ${ build('left') }
      ${ center() }
      ${ build('right') }
    </header>
  `
}
