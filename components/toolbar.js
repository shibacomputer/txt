const html = require('choo/html')
const css = require('sheetify')

const base = css`
  :host {
    width: 100%;
    height: 2.15rem;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background-color: rgba(0,0,0,0.1);
    padding: 0 0.5rem;
    font-size: 12px;
  }
`

module.exports = (elements, title, emit) => {
  function build (pos) {
    if (elements && elements[0]) {
      return html `
        <ul class="${pos}">
          ${ elements[0].map( (item) => {
            return html`
              <li>
                ${ item }
              </li>
              `
            })}
        </ul>
      `
    }
  }

  function center() {
    if (title) {
      return html`
        <nav class="center">
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
