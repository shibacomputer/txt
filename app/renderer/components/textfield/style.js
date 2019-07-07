import css from 'csjs-inject'

const style = css`
  .input {
    background: var(--button-primary);
    border: 0;
    color: var(--text);
    font-family: "Mono";
    font-size: 0.8125rem;
    height: 1.25rem;
    padding: 0.75rem 0.25rem;
    width: 100%;
  }
  .input-focus {
    outline-color: var(--text);
  }

  .input-valid {
    outline-color: var(--c);
  }
`

export default style
