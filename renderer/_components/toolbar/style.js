const css = require('csjs-inject')

var style = css`
  .toolbar {
    align-items: center;
    box-sizing: border-box;
    color: var(--w);
    display: flex;
    flex-direction: row;
    flex-shrink: 0;
    font-family: 'HKG', sans-serif;
    height: 2.25rem;
    padding: 0.3rem 0.5rem;
    min-height: 2rem;
    justify-content: space-between;
    width: 100%;
  }
  .toolbar ul {
    display: flex;
    flex-direction: row;
    list-style: none;
  }
  .group {
    align-items: center;
    display: flex;
    flex-basis: 33%;
    flex-direction: row;
    height: 1.5rem;
  }

  .left {
    justify-content: flex-start;
  }
  .center {
    flex-grow: 1;
    font-family: 'HKG', sans-serif;
    font-size: 13px;
    justify-content: center;
    text-align: center;
  }

  .right {
    flex-basis: 33%;
    justify-content: flex-end;
  }
  .right li {
    margin-left: 8px;
  }
`

module.exports = style
