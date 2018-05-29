const css = require('csjs-inject')

const style = css`
  .app {
    display: flex;
    flex-direction: row;
    transition: opacity 200ms linear, filter 250ms linear;
  }

  .unfocused {
    opacity: 0.45;
    filter: grayscale(100%);
  }
`

module.exports = style
