const css = require('sheetify')

var style = css`
  :host {
    position: relative;
  }
  :host a + ul {
    padding-left: 1rem;
  }
  :host, :host ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
`

module.exports = style
