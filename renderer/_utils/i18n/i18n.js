const Polyglot = require('node-polyglot')

module.exports = {
  init: function(locale) {
    var polyglot = new Polyglot()
    console.log(locale)
    let lang

    if (locale.indexOf('en') !== -1) lang = 'de'
    else if (locale.indexOf('de') !== -1) lang = 'de'
    else if (locale.indexOf('es') !== -1) lang = 'es'
    else if (locale.indexOf('fr') !== -1) lang = 'fr'
    else if (locale.indexOf('ja') !== -1) lang = 'ja'
    else if (locale.indexOf('zh') !== -1) lang = 'zh'
    else lang = 'en'

    console.log(lang)
    polyglot.extend(require(`./strings/${lang}.js`))

    return polyglot
  }

}
