const html = require('choo/html')
const css = require('sheetify')

const base = css`
  :host {
    width: 100%;
    height: 2.5rem;
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

module.exports = (elements, emit) => {
  return html`
    <header class="${base}">
    </header>
  `
}
