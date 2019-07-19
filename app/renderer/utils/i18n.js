import { Children, PropTypes } from 'react'
import Polyglot from 'node-polyglot'

import { withContext } from 'recompose'

import strings from '../../i18n/strings.js'

const locale = () => {
  if (navigator.language.indexOf('en') !== -1) return 'en'
  else if (navigator.language.indexOf('de') !== -1) return 'de'
  else if (navigator.language.indexOf('fr') !== -1) return 'fr'
  else return 'en'
}

const withI18nContext = withContext({
  locale: locale,
  translate: PropTypes.func.isRequired,
}, ({ locale }) => {
  const polyglot = new Polyglot({
    locale,
    phrases: strings[locale],
  })

  
  const translate = polyglot.t.bind(polyglot)

  return { locale, translate }
})


export const I18n = ({ children }) => Children.only(children)

export default withI18nContext(I18n)
