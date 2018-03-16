const css = require('csjs-inject')

const style = css`
  .browser {
    -webkit-overflow-scrolling: touch;
    align-items: stretch;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    font-family: 'HKG', sans-serif;
    height: calc(100vh - 2px);
    justify-content: space-between;
    max-width: 320px;
    min-width: 240px;
    overflow-y: scroll;
    width: 25vw;
  }

  .treeBase {
    flex-grow: 1;
    overflow-y: scroll;
  }

  .tree {
    list-style: none;
    margin-left: 0.75rem;
  }

  .header {
    border-bottom: 1px solid #303033;
    width: 100%;
  }

  .footer {
    border-top: 1px solid #303033;
    width: 100%;
  }

  .cell {
    background: none;
    border: none;
    box-sizing: border-box;
    color: #9898a5;
    display: flex;
    flex-direction: row;
    font-family: 'HKG', sans-serif;
    font-size: 13px;
    height: 24px;
    outline: var(--w);
    padding: 0;
    position: relative;
    text-align: left;
    width: 100%;
    z-index: 5;
  }

  .metadata {
    color: currentColor;
    display: flex;
    flex-direction: row;
    margin-top: 1px;
    padding-right: 1rem;
    position: relative;
    white-space: nowrap;
    z-index: 10;
  }

  .input {
    background: none;
    border: none;
    color: currentColor;
    font-family: 'HKG', sans-serif;
    font-size: 13px;
    height: 13px;
    outline: none;
    width: 100%;
  }

  .input::selection {
    color: var(--k);
    background: var(--m);
  }

  .cell:before {
    content: '';
    height: 24px;
    left: -100%;
    margin-top: -4px;
    position: absolute;
    width: 100vw;
    z-index: 1;
  }

  .focus {
    color: var(--w);
  }

  .active {
    color: var(--c);
  }

  .modified {
    color: var(--y);
  }

  .rename {
    color: var(--m);
  }

  .focus:before {
    background-color: #29292f;
  }

  .icon {
    color: currentColor;
    flex: 0 0 auto;
    height: 1rem;
    margin-right: 0.5rem;
    width: 1rem;
    z-index: 10;
  }
`

module.exports = style
