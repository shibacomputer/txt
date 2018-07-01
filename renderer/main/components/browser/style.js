const css = require('csjs-inject')

const style = css`
  .browser {
    -webkit-overflow-scrolling: touch;
    align-items: stretch;
    background: var(--g);
    border-right: 1px solid #000;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    font-family: 'HKG', sans-serif;
    height: 100vh;
    justify-content: space-between;
    max-width: 320px;
    min-width: 240px;
    overflow-y: hidden;
    transition: transform 100ms ease-in-out;
    width: 25vw;
  }

  .treeBase, .emptyTreeBase {
    flex-grow: 1;
  }

  .treeBase {
    -webkit-app-region: no-drag;
    flex-grow: 1;
    overflow-y: scroll;
  }

  .emptyTreeBase {
    align-items: center;
    color: var(--c);
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .emptyTreeIllustration {
    margin-bottom: 1rem;
  }
  .emptyTreeIllustration > svg {
    height: 64px;
    width: 48px;
  }

  .emptyTreeMessage {
    font-size: 13px;
    max-width: 12rem;
    text-align: center;
    width: 85%;
  }

  .emptyTreeActions {
    margin-top: 1rem;
    margin-bottom: 2rem;
  }

  .emptyTreeActions > button {
    background: none;
    border: 1px solid currentColor;
    box-sizing: border-box;
    color: var(--c)
    outline: none;
    font-family: 'HKG', sans-serif;
    font-size: 13px;
    flex-grow: 1;
    padding: 0.55rem 0.45rem 0.45rem 0.45rem;
    width: 45%;
  }
  .emptyTreeActions > button:focus {
    outline: var(--w);
  }
  .emptyTreeActions > button:active {
    background: var(--c);
    color: var(--k);
    outline: var(--w);
  }
  .emptyTreeActions > button:first-child {
    margin-right: 0.5rem;
  }
  .emptyTreeSecondaryAction {
    background: none;
    border: none;
    color: var(--b);
    outline: none;
    font-family: 'HKG', sans-serif;
    font-size: 13px;
  }
  .emptyTreeSecondaryAction:active {
    color: var(--w);
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
    color: var(--w);
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
    background-color: rgba(255, 255, 255, 0.05);
  }

  .cell:hover {
    color: (--w);
    background-color: rgba(255, 255, 255, 0.05);
  }

  .disabled {
    position: absolute;
    transform: translateX(-100%);
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
