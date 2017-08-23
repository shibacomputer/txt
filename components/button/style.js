const css = require('sheetify')

const style = css`
  :host {
    border: none;
    background: none;
    color: var(--c);
    padding: 0;
  }
  :host svg {
    fill: currentColor;
    height: 1.5rem;
    width: 1.5rem;
  }
  :host:active {
    color: var(--w);
  }
`

module.exports = style
