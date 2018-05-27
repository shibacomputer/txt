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
    white-space: nowrap;
  }
  .center {
    box-sizing: border-box;
    flex: 1;
    font-family: 'HKG', sans-serif;
    font-size: 13px;
    justify-content: center;
    max-width: 75%;
    text-align: center;
  }
  .label {
    padding: 0 0.25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .right {
    justify-content: flex-end;
    white-space: nowrap;
  }
  .right li {
    margin-left: 8px;
  }
`

module.exports = style
