const html = require('choo/html')
const style = require('./style')
function lockInput(state, emit, opts) {
  console.log(opts)
  return html`
    <section class=${style.lock}>
      <div class=${style.unlocker}>
        <div class=${style.logo}>
          <svg height="32" viewBox="0 0 32 32" width="32" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><linearGradient id="a" x1="12.039671%" x2="91.080996%" y1="7.214581%" y2="92.037581%"><stop offset="0" stop-color="#fc1fff"/><stop offset=".474936777" stop-color="#ffd900"/><stop offset="1" stop-color="#00ff84"/></linearGradient><path id="b" d="m29.7142857 30.8571429h-10.2857143v1.1428571h-2.2857143v-2.2857143h2.2857143v-1.1428571h10.2857143v-26.28571431h2.2857143v28.57142861zm-27.42857141-2.2857143h10.28571431v1.1428571h2.2857143v2.2857143h-2.2857143v-1.1428571h-10.28571431-2.28571429v-28.57142861h2.28571429zm12.57142861 1.1428571v-25.14285713h2.2857142v25.14285713zm-2.2857143-25.14285713v-2.28571428h2.2857143v2.28571428zm-10.28571431-2.28571428v-2.28571429h10.28571431v2.28571429zm14.85714281 2.28571428v-2.28571428h2.2857143v2.28571428zm2.2857143-2.28571428v-2.28571429h10.2857143v2.28571429zm0 5.71428571v-2.28571429h8v2.28571429zm-14.85714283 0v-2.28571429h8.00000003v2.28571429zm14.85714283 4.5714286v-2.2857143h8v2.2857143zm-14.85714283 0v-2.2857143h8.00000003v2.2857143zm14.85714283 4.5714285v-2.2857142h8v2.2857142zm-14.85714283 0v-2.2857142h8.00000003v2.2857142zm14.85714283 4.5714286v-2.2857143h8v2.2857143zm-14.85714283 0v-2.2857143h8.00000003v2.2857143zm14.85714283 4.5714286v-2.2857143h8v2.2857143zm-14.85714283 0v-2.2857143h8.00000003v2.2857143z"/><filter id="c" height="103.1%" width="103.1%" x="-1.6%" y="-1.6%"><feOffset dx="0" dy="-1" in="SourceAlpha" result="shadowOffsetInner1"/><feComposite in="shadowOffsetInner1" in2="SourceAlpha" k2="-1" k3="1" operator="arithmetic" result="shadowInnerInner1"/><feColorMatrix in="shadowInnerInner1" type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0"/></filter></defs><g fill="none" fill-rule="evenodd"><use fill="url(#a)" fill-rule="evenodd" xlink:href="#b"/><use fill="#000" filter="url(#c)" xlink:href="#b"/></g></svg>
        </div>
        <input placeholder=${opts.placeholder} autocomplete="current-password" type="password" class="${style.input} ${style.ready}"/>
        <button class="${style.button}">${opts.verb}</button>
      </div>
    </section>
  `
}

module.exports = lockInput
