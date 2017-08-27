const css = require('sheetify')

const style = css`
  :host {
    display: flex;
    flex-direction: row;
  }
  :host.modified {
    color: var(--w);
  }
  :host.unmodified {
    color: var(--w);
  }
  :host:hover {
    text-decoration: underline;
  }
  :host > h1 {
    font-family: 'HKG', sans-serif;
    font-size: 15px;
    font-weight: normal;
    justify-content: center;
    margin-top: -1px;
  }
  :host > svg {
    height: 1rem;
    width: 1rem;
    margin-right: 2px;
  }
`

module.exports = style
