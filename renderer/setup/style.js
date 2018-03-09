const css = require('csjs-inject')

const style = css`
  .main {
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

  .header {
    align-items: center;
    color: var(--w);
    display: flex;
    flex-direction: column;
    font-family: 'HKG', sans-serif;
    font-size: 16px;
    line-height: 1.55;
    margin-top: 1rem;
    text-align: center;
  }

  .header > .logo {
    background-color: grey;
    height: 5rem;
    margin-bottom: 1rem;;
    width: 5rem;
  }

  .header > h1 {
    font-family: 'FiraCode', monospace;
  }

  .settings,
  .footer {
    align-items: stretch;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 100%;
    -webkit-app-region: no-drag;
  }

  .settings {
    flex: 1;
    margin-top: 1rem;
  }

  .segmented {
    align-items: stretch;
    border: 1px solid var(--c);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    line-height: 1.5;
    margin-bottom: 0.5rem;
  }

  .segmented input {
    position: absolute;
    visibility: hidden;
  }

  .segmented label {
    flex: 1;
    font-family: 'HKG', sans-serif;
    font-size: 13px;
    padding: 0.55rem 1rem 0.5rem 1rem;
    text-align: center;
  }

  .segmented input[type="radio"] + label {
    color: var(--c);
  }

  .segmented input[type="radio"]:checked + label {
    background: var(--c);
    color: var(--k);
  }

  .stringtab,
  .keytab {
    display: flex;
    flex-direction: column;
  }

  .stringtab label,
  .keytab label,
  .folder label  {
    display: block;
    font-family: 'HKG', sans-serif;
    font-size: 13px;
    line-height: 1.5;
    margin-bottom: 0.5rem;
    margin-top: 0.5rem;
  }

  .tip {
    color: var(--w);
    display: block;
    text-align: center;
  }

  .stringtab input,
  .keytab select,
  .folder .location {
    border: 1px solid currentcolor;
    background: none;
    font-size: 13px;
    padding: 0.75rem 0.5rem 0.75rem 0.5rem;
    font-family: 'Mono', monospace;
    font-weight: normal;
    outline: none;
  }

  .keytab select {
    height: 41px;
    border-radius: 0;
  }

  .stringtab input:focus,
  .stringtab input:active {
    background: var(--b);
    color: var(--k);
  }
  .stringtab input::selection {
    background: var(--k);
  }

  .folder {
    border-top: 1px solid #222;
    color: var(--b);
    margin-bottom: 0.5rem;
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    width: 100%;
  }

  .locationBox {
    display: flex;
    flex-direction: row;
  }

  .location {
    flex: 1;
  }

  .locationButton {
    display: none;
  }

  .locationBox button {
    background: var(--b);
    border: none;
    font-family: 'HKG', sans-serif;
    font-size: 15px;
    font-weight: bold;
    outline: var(--w);
    width: 3rem;
  }

  .locationBox button:active {
    background-color: var(--w);
    color: var(--k);
  }

  .footer button {
    border: none;
    outline: var(--w);
    font-family: 'HKG', sans-serif;
    font-size: 15px;
    font-weight: bold;
    padding: 0.75rem 1rem 0.75rem 1rem;
  }

  .footer button:disabled {
    background-color: #747474;
    color: var(--k);
  }

  .footer button:active {
    background-color: var(--c);
    color: var(--k);
  }
`

module.exports = style
