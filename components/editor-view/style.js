const css = require('sheetify')

var style = css`
  :host {
    border-radius: 5px;
    background-color: var(--k);
    color: var(--w);
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    height: calc(100vh - 2px);
    line-height: 1.5;
    z-index: 5;
  }
  :host > header {
    border-bottom: 1px solid #303033;
  }
  :host > div {
    -webkit-app-region: no-drag;
    -webkit-overflow-scrolling: touch;
    flex-grow: 1;
    margin-top: 1rem;
    overflow: scroll;

  }
  :host > footer {
    border-top: 1px solid #303033;
  }
`

module.exports = style
