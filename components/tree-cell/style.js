const css = require('sheetify')

var style = css`
  :host + ul {
    padding-left: 10px;
  }
  :host {
    color: var(--s);
    display: flex;
    flex-direction: row;
    font-family: 'HKG', sans-serif;
    fint-weight: normal;
    font-size: 13px;
    height: 1.75rem;
    padding-left: 10px;
    z-index: 5;
  }
  :host:before {
    content: '';
    height: 1.75rem;
    left: 1px;
    max-width: 20rem;
    min-width: 12rem;
    position: fixed;
    width: calc(100% - 1px);
    z-index: 1;
  }
  :host:hover:before {
    background-color: rgba(0,0,0,0.15);
  }
  :host.highlight:before {
    background-color: rgba(0,0,0,0.25)
  }
  :host.editing {
    color: var(--w);
  }
  :host div {
    align-items: center;
    display: flex;
    flex-basis: 100%;
    flex-direction: row;
    padding-right: 0.5rem;
    position: relative;
    z-index: 5;
    white-space: nowrap;
  }
  :host svg {
    height: 1rem;
    margin-right: 0.45rem;
    margin-top: -2px;
    width: 1rem;
  }

  :host input {
    background: none;
    border: none;
    box-sizing: border-box;
    color: var(--w);
    font-family: 'HKG', sans-serif;
    font-style: normal;
    font-size: 13px;
    padding: 0;
    outline: none;
    width: auto;
  }
  :host input::selection {
    background-color: var(--c);
  }

  :host .rename {
    color: var(--w);
  }
`

module.exports = style
