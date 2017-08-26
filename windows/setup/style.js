const css = require('sheetify')

const style = css`
  :host {
    -webkit-overflow-scrolling: touch;
    align-items: center;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    font-size: 13px;
    height: 100vh;
    justify-content: space-between;
    padding: 1.5rem 1rem;
    overflow-y: scroll;
  }

  :host > header {
    align-items: center;
    display: flex;
    flex-direction: column;
    font-family: 'HKG', sans-serif;
    font-size: 16px;
    line-height: 1.35;
    margin-top: 1rem;
    text-align: center;
  }
  :host > header > .logo {
    background-color: grey;
    height: 5rem;
    margin-bottom: 1rem;;
    width: 5rem;
  }
  :host > header > h1 {
    font-family: 'FiraCode', monospace;
  }
  :host > section, :host > footer {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
  :host > section > label {
    font-family: 'HKG', sans-serif;
    font-size: 15px;
    line-height: 1.5;
    margin-bottom: 0.5rem;
    margin-top: 0.5rem;

  }
  :host > section > span {
    color: var(--b);
    display: block;
    font-family: 'HKG', sans-serif;
    font-size: 15px;
    font-weight: bold;
    line-height: 1.5;
  }
  :host > section > input {
    border: 1px solid currentcolor;
    background: none;
    font-size: 14px;
    padding: 0.75rem 1rem 0.75rem 1rem;
    font-family: 'FiraCode', monospace;
    font-weight: bold;
    outline: none;
  }
  :host > section > input:focus,
  :host > section > input:active {
    background: var(--b);
    color: var(--k);
  }
  :host > section > input::selection {
    background: white;
    color: var(--k);
  }

  :host > footer > button {
    border: none;
    font-family: 'HKG', sans-serif;
    font-size: 15px;
    font-weight: bold;
    padding: 0.75rem 1rem 0.75rem 1rem;
  }
  :host > footer > button:disabled {
    background-color: #747474;
    border: 1px solid #B3B3B3;
  }

  :host > footer > button:active {
    background-color: var(--c);
    color: var(--k);
  }

  :host > footer > button:disabled {
    background-color: #747474;
    border: 1px solid #B3B3B3;
  }
`

module.exports = style
