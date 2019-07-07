import css from 'csjs-inject'

const style = css`
  .label {
    color: var(--w);
  }

  .header {
    -webkit-app-region: drag;
    justify-content: space-between;
    border-bottom: 1px solid var(--border);
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    font-size: 13px;
    font-weight: normal;
    height: 3.75rem;
    justify-content: center;
    padding: 0px 6px;
  }

  .component {
    -webkit-app-region: drag;
    border-left-width: 1px;
    border-left-style: solid;
    border-image: linear-gradient(to bottom, var(--base) 50%, var(--border) 50%);
    border-image-slice: 1;
    color: var(--textalt);
    display: flex;
    font-size: 0.75rem;
    flex-direction: column;
    font-family: 'Mono';
    padding: 12px 12px;
    width: 25%;
  }

  .component:first-child {
    border: none;
  }

  .title {
    color: currentColor;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .value {
    color: currentColor;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .hasChanges {
    color: var(--c);
  }

  .edited {
    color: var(--g);
  }
`

export default style
