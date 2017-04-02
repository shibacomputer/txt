const html = require('choo/html')
const css = require('sheetify')

module.exports = spinner

function spinner (state, emit) {

  const base = css`
    :host {
      width: auto;
      height: 100%;
      color: white;
      display: flex;
      flex: auto;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  `

  return html`
    <main class="${base}">
      Loading...
    </main>
  `
}
