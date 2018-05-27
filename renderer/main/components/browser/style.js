const css = require('csjs-inject')

const style = css`
  .browser {
    -webkit-overflow-scrolling: touch;
    align-items: stretch;
    background: var(--g);
    border-radius: 5px 0px 0px 5px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    font-family: 'HKG', sans-serif;
    height: calc(100vh - 2px);
    justify-content: space-between;
    max-width: 320px;
    min-width: 240px;
    overflow-y: hidden;
    width: 25vw;
  }

  .treeBase {
    -webkit-app-region: no-drag;
    flex-grow: 1;
    overflow-y: scroll;
  }

  .tree {
    list-style: none;
    margin-left: 0.75rem;
  }

  .header {
    
    width: 100%;
  }

  .footer {
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
    min-width: 100%;
    outline: var(--w);
    padding: 0;
    position: relative;
    text-align: left;
    width: -webkit-fit-content;
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
    min-width: 5rem;
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
    right: 0;
    z-index: 1;
  }

  .cell:hover:before {
    background-color: #29292f;
  }

  .cell:hover {
    color: (--w);
    background-color: #29292f;
  }

  .disabled {
    display: none;
  }

  .focus, .focus.active, .focus.modified, .cell.focus:hover, .cell.focus.active:hover {
    color: var(--k);
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

  .focus:before, .focus:hover:before {
    background-color: var(--w);
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
