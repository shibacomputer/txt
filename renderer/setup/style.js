const css = require('csjs-inject')

const style = css`
  .main {
    -webkit-overflow-scrolling: touch;
    align-items: stretch;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    font-size: 13px;
    height: 100vh;
    justify-content: space-between;
    overflow-y: hidden;
    padding: 1.5rem 1rem;
    transition: opacity 100ms linear;
  }

  .core {
    align-items: stretch;
    box-sizing: border-box;
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
  }

  .unfocused {
    opacity: 0.45;
  }

  .header {
    align-items: center;
    color: var(--w);
    display: flex;
    flex-direction: column;
    font-family: 'HKG', sans-serif;
    font-size: 16px;
    line-height: 1.55;
    margin-top: 1rem;
    text-align: center;
  }

  .header .logo {
    margin-bottom: 1rem;
    width: 5rem;
  }

  .header h1 {
    color: var(--w);
    font-family: 'HKG', sans-serif;
    font-size: 14px;
    font-weight: normal;
  }

  .view {
    flex-grow: 1;
    margin: 1rem 0;
    position: absolute;
    transition: transform 450ms cubic-bezier(0.86, 0, 0.07, 1);
  }

  .option {
    align-items: stretch;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 100%;
    -webkit-app-region: no-drag;
  }

  .field {
    display: flex;
    flex-direction: row;
  }
  .field input {
    border: 1px solid currentcolor;
    background: none;
    flex-grow: 1;
    font-size: 13px;
    padding: 0.75rem 0.5rem 0.75rem 0.5rem;
    font-family: 'Mono', monospace;
    font-weight: normal;
    outline: none;
  }
  .field input:focus {
    background: var(--w);
    color: var(--k);
  }

  .field label,
  .option label {
    color: currentColor;
    display: block;
    font-family: 'HKG', sans-serif;
    font-size: 13px;
    line-height: 1.5;
    margin-bottom: 0.5rem;
    margin-top: 1rem;
  }

  .locationOSInput {
    display:none;
  }

  .location {
    border: 1px solid currentcolor;
    background: none;
    flex-grow: 1;
    font-size: 12px;
    padding: 0.75rem 0.5rem 0.75rem 0.5rem;
    font-family: 'Mono', monospace;
    font-weight: normal;
    outline: none;
  }

  .locationButton {
    background: var(--b);
    border: none;
    outline: var(--w);
    width: 3rem;
  }

  .locationButton:active {
    background-color: var(--w);
    color: var(--k);
  }

  .tip label {
    text-align: center;
    margin-top: 0.5rem;
  }


  .footer nav {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .footer button {
    border: none;
    outline: var(--w);
    font-family: 'HKG', sans-serif;
    font-size: 15px;
    font-weight: bold;
    flex-grow: 1;
    padding: 0.75rem 1rem 0.75rem 1rem;
  }

  .footer button:disabled {
    background-color: #747474;
    color: var(--k);
  }

  .footer button:active {
    background-color: var(--c);
    color: var(--k);
  }

  .blocker {
    align-items: center;
    color: var(--c);
    background: rgba(0,0,0,0.85);
    border-radius: 6px;
    bottom: 1px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    left: 1px;
    position: absolute;
    right: 1px;
    top: 1px;
  }

  .spinner {
    border-radius: 50%;
    color: var(--c);
    font-size: 8px;
    height: 1em;
    position: relative;
    width: 1em;
    animation: anim 1.3s infinite linear;
    transform: translateZ(0);
  }

  .transitionToLeft {
    transform: translateX(-100vw);
    transition: transform 450ms cubic-bezier(0.86, 0, 0.07, 1);
  }

  .transitionEnd {
    transform: translateX(0vw);
    transition: transform 450ms cubic-bezier(0.86, 0, 0.07, 1);
  }

  .hiddenFromRight {
    transform: translateX(100vw);
    transition: transform 450ms cubic-bezier(0.86, 0, 0.07, 1);
  }


  @keyframes anim {
    0%,
    100% {
      box-shadow: 0 -3em 0 0.2em, 2em -2em 0 0em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 0;
    }
    12.5% {
      box-shadow: 0 -3em 0 0, 2em -2em 0 0.2em, 3em 0 0 0, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em;
    }
    25% {
      box-shadow: 0 -3em 0 -0.5em, 2em -2em 0 0, 3em 0 0 0.2em, 2em 2em 0 0, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em;
    }
    37.5% {
      box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0em 0 0, 2em 2em 0 0.2em, 0 3em 0 0em, -2em 2em 0 -1em, -3em 0em 0 -1em, -2em -2em 0 -1em;
    }
    50% {
      box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 0em, 0 3em 0 0.2em, -2em 2em 0 0, -3em 0em 0 -1em, -2em -2em 0 -1em;
    }
    62.5% {
      box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 0, -2em 2em 0 0.2em, -3em 0 0 0, -2em -2em 0 -1em;
    }
    75% {
      box-shadow: 0em -3em 0 -1em, 2em -2em 0 -1em, 3em 0em 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 0, -3em 0em 0 0.2em, -2em -2em 0 0;
    }
    87.5% {
      box-shadow: 0em -3em 0 0, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 0, -3em 0em 0 0, -2em -2em 0 0.2em;
    }
}
`

module.exports = style
