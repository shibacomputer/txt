const Polyglot = require('node-polyglot')
const strings = require('./strings.js')

module.exports = {
  init: function(locale) {
    if (locale.indexOf('en') !== -1) locale = 'en'
    else if (locale.indexOf('de') !== -1) lang = 'de'
    else if (locale.indexOf('fr') !== -1) lang = 'fr'
    else lang = 'en'

    var polyglot = new Polyglot({
      locale,
      phrases:strings[locale]
    })
    return polyglot
  }

}
