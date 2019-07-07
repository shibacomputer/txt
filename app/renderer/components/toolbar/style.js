import css from 'csjs-inject'

const style = css`
  .toolbar {
    -webkit-app-region: drag;
    align-items: center;
    border-top: 1px solid var(--border);
    box-sizing: border-box;
    color: var(--textalt);
    display: flex;
    flex-direction: row;
    font-family: 'Mono', monospace;
    font-size: 0.65rem;
    height: 1.75rem;
    justify-content: center;
    padding: 2px 8px 4px 8px;
  }

  .num {
    color: var(--text-bold);
  }

  .section {
    width: 33%;
    text-align: center;
  }

  .section:first-child {
    text-align: left;
  }

  .section:last-child {
    text-align: right;
  }

  .spinner {
    align-items: center;
    color: var(--textalt);
    display: flex;
    float: right;
    font-family: sans-serif;
    justify-content: center;
    margin-top: 0px;
    min-height: 32px;
  }

  .spinner:after {
    animation: animateSpinner .4s linear infinite;
    content: "⠋";
    display: block;
    font-size: 24px;
    transform: rotate(90deg);
  }

  @keyframes animateSpinner {
    10% { content: "⠙"; }
    20% { content: "⠹"; }
    30% { content: "⠸"; }
    40% { content: "⠼"; }
    50% { content: "⠴"; }
    60% { content: "⠦"; }
    70% { content: "⠧"; }
    80% { content: "⠇"; }
    90% { content: "⠏"; }
  }
`
export default style
