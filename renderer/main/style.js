const css = require('csjs-inject')

const style = css`
  .app {
    display: flex;
    flex-direction: row;
    transition: opacity 100ms linear, filter 100ms linear;
  }

  .unfocused {
    opacity: 0.85;
    filter: grayscale(100%);
  }
`

module.exports = style
