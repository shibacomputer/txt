import css from 'csjs-inject'

const style = css`
  .base {
    border-radius: 2px;
    font-family: 'Mono';
    font-size: 0.75rem;
    outline: none;
    padding: 0.3rem 0.75rem;
  }

  .base:active {
    opacity: 0.85;
  }

  .primary {
    background: var(--button-primary);
    border: 1px solid var(--border);
    color: var(--text);
  }

  .primary:hover {
    color: var(--text-bold);
  }

  .primary:focus {
    border: 1px solid var(--text);
  }

  .dark {
    background: #0D1317;
    border: 1px solid #232323;
    color: #E7F8FF;
  }

  .light {
    background: #EEEEEE;
    border: 1px solid #EEEEEE;
    color: #222222;
  }

  .light:hover {
    color: #000000;
  }

  .light:focus {
    border: 1px solid var(--b);
  }

  .secondary {
    border: 1px solid var(--border);
    background: none;
    color: var(--text);
  }

  .positive {
    color: var(--base);
    background: var(--positive);
    border: 1px solid var(--positive);
  }

  .disabled {
    border: 1px solid var(--border) !important;
    background: none !important;
    color: var(--text) !important;
    opacity: 0.25 !important;
  }

`

export default style
