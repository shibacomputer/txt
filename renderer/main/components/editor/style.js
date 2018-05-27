const css = require('csjs-inject')

const style = css`

  .main {
    -webkit-overflow-scrolling: touch;
    align-items: stretch;
    box-sizing: border-box;
    display: flex;
    flex: 1;
    flex-direction: column;
    font-size: 13px;
    height: calc(100vh - 2px);
    justify-content: space-between;
    overflow-y: hidden;
  }

  .base {
    -webkit-app-region: no-drag;
    align-items: stretch;
    background-color: var(--k);
    color: var(--w);
    display: flex;
    flex: 1;
    flex-direction: column;
    height: 100%;
    overflow-y: scroll;
  }

  .header {
    width: 100%;
  }

  .footer {
    width: 100%;
  }
`

module.exports = style
