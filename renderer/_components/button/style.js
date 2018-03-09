const css = require('csjs-inject')

const style = css`
  .button {
    border: none;
    background: none;
    color: var(--c);
    padding: 0;
  }
  .button > svg {
    fill: currentColor;
    height: 1.5rem;
    width: 1.5rem;
  }
  .button:active {
    color: var(--w);
  }
`

module.exports = style
