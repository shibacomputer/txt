const css = require('csjs-inject')

const style = css`
  .lock {
    align-items: center;
    display: flex;
    flex-direction: row;
    height: 100vh;
  }
  .unlocker {
    align-items: stretch;
    display: flex;
    flex: 1;
    flex-direction: row;
    padding: 2rem;
  }

  .logo {
    align-items: center;
    display: flex;
    flex-direction: row;
    margin-right: 1.5rem;
  }

  .input {
    border: 1px solid currentcolor;
    background: none;
    flex-grow: 1;
    font-size: 12px;
    padding: 0.75rem 0.5rem 0.75rem 0.5rem;
    font-family: 'Mono', monospace;
    font-weight: normal;
    outline: none;
  }

  .ready {
    color: var(--b)
  }

  .button {
    background: var(--b);
    border: none;
    font-size: 13px;
    margin-left: 1px;
    outline: var(--w);
    padding: 0 1rem;
  }

  .button:active {
    background-color: var(--w);
    color: var(--k);
  }
`
module.exports = style
