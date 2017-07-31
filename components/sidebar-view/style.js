const css = require('sheetify')

var style = css`
  :host {
    border-radius: 5px;
    border-right: 1px solid #303033;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 2px);
    max-width: 20rem;
    min-width: 14rem;
    width: 25vw;
  }
  :host > header {
    border-bottom: 1px solid #303033;
  }
  :host > div {
    -webkit-app-region: no-drag;
    -webkit-overflow-scrolling: touch;
    flex-grow: 1;
    overflow: scroll;
    overflow-x: scroll;
  }
  :host > footer {
    border-top: 1px solid #303033;
  }
`

module.exports = style
