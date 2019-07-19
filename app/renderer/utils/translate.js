import { PropTypes } from 'react'
import { getContext } from 'recompose'

export default getContext({
    translate: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
});
