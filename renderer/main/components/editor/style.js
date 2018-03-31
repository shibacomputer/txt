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
    background-color: rgba(0,0,0,0.1);
    color: var(--w);
    display: flex;
    flex: 1;
    flex-direction: column;
    height: 100%;
    overflow-y: scroll;
  }

  .header {
    border-bottom: 1px solid #303033;
    width: 100%;
  }

  .footer {
    border-top: 1px solid #303033;
    width: 100%;
  }
`

module.exports = style
