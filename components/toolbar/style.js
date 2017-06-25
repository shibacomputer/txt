const css = require('sheetify')

var style = css`
  :host {
    align-items: center;
    background-color: rgba(0,0,0,0.1);
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    font-size: 12px;
    height: auto;
    padding: 0.3rem 0.5rem;
    justify-content: space-between;
    min-height: 2rem;
    width: 100%;
  }
  :host ul {
    display: flex;
    flex-direction: row;
    list-style: none;
  }
  :host .group {
    display: flex;
    flex-direction: row;
    flex-basis: 33%;
  }
  :host .left {
    justify-content: flex-start;
  }
  :host .center {
    color: var(--c);
    font-family: 'HKG', sans-serif;
    font-size: 15px;
    justify-content: center;
  }

  :host .right {
    justify-content: flex-end;
  }
  :host .right li {
    margin-left: 8px;
  }
`

module.exports = style
