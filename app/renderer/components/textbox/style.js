import css from 'csjs-inject'

const style = css`
  .box {
    background: var(--base);
    height: calc(100vh - 3.75rem - 1.75rem);
    overflow: scroll;
  }
  .area {
    background: none;
    border: none;
    color: white;
    display: block;
    font-variant-ligatures: no-common-ligatures;
    font-family: 'Mono', monospace;
    font-size: 14px;
    line-height: 1.85;
    min-height: 100%;
    max-width: 48rem;
    margin: 0 auto;
    outline: none;
    padding: 2rem;
    resize: none;
    width: 100vw;
  }
`

export default style
