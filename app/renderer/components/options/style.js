import css from 'csjs-inject'

const style = css`
  .options {
    align-items: flex-start;
    box-sizing: border-box;
    color: var(--text);
    display: flex;
    flex-direction: row;
    font-size: 0.75rem;
    font-family: 'Mono';
    padding: 1rem;
  }

  .group {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 2rem);
    justify-content: space-between;
  }

  .offset {
    margin-top: 6px;
  }

  .textoffset {
    margin-top: -3px;
  }

  .left {
    display: flex;
    flex-basis: 35%;
    justify-content: flex-end;
    margin-right: 0.5rem;
  }

  .right {
    display: flex;
    flex-direction: column;
    flex-basis: 65%;
    flex-wrap: wrap;
    justify-content: flex-start;
    margin-left: 0.5rem;
  }
  
  .right > *:last-child {
    margin-bottom: 0;
  }

  .set {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    margin-bottom: 0.75rem;
  }

  .set > * {
    margin-right: 0.5rem;
  }

  .label {
    color: var(--text);
    font-weight: bold;
  }

  .rule {
    border: 1px solid var(--border);
    width: calc(100% - 2rem);
    border-bottom: none;
    border-left: none;
    border-right: none;
  }

  .tip {
    font-size: 0.75rem;
    color: var(--textalt);
    line-height: 1.5;
  }

  .footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0 1rem 1rem 1rem;
    width: 100%;
  }

`

export default style
