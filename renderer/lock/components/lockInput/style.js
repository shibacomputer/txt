const css = require('csjs-inject')

const style = css`

  .lock {
    align-items: center;
    display: flex;
    flex-direction: row;
    height: 100vh;
  }
  .unlocker {
    align-items: stretch;
    display: flex;
    flex: 1;
    flex-direction: row;
    padding: 2rem;
  }

  .logo {
    align-items: center;
    display: flex;
    flex-direction: row;
    margin-right: 1.5rem;
  }

  .inputfield {
    align-items: stretch;
    display: flex;
    flex: 1;
  }

  .inputfield.headShake {
    animation-duration: 900ms;
    animation-name: headShake;
    animation-timing-function: ease-in-out;
  }

  .input {
    border: 1px solid currentcolor;
    background: none;
    flex-grow: 1;
    font-size: 12px;
    padding: 0.75rem 0.5rem 0.75rem 0.5rem;
    font-family: 'Mono', monospace;
    font-weight: normal;
    outline: none;
  }

  .input::selection {
    background-color: var(--b)
  }

  .error::selection {
    background-color: var(--r)
  }

  .input.error {
    color: var(--r)
  }

  .input.error::placeholder {
    color: var(--r)
  }

  .ready {
    color: var(--b)
  }

  .button {
    background: var(--b);
    border: none;
    font-size: 13px;
    margin-left: 1px;
    outline: var(--w);
    padding: 0 1rem;
  }

  .button.error {
    background: var(--r);
    color: var(--k);
  }

  .button:active {
    background-color: var(--w);
    color: var(--k);
  }

  @keyframes headShake {
    0% {
      transform: translateX(0);
    }

    6.5% {
      transform: translateX(-10%) rotateY(-9deg);
    }

    18.5% {
      transform: translateX(9%) rotateY(7deg);
    }

    31.5% {
      transform: translateX(-5%) rotateY(-5deg);
    }

    43.5% {
      transform: translateX(1%) rotateY(3deg);
    }

    50% {
      transform: translateX(0);
    }
  }
`
module.exports = style
