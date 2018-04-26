/**
 * Simple bootstrap select button to select the quarter
 * for the language ranking table
 * @author Fabian Beuke <mail@beuke.org>
 * @license AGPL-3.0
 */

import { observer } from 'mobx-react'
import Select from './Select'
import PropTypes from 'prop-types'

@observer
export default class SelectQuarter extends Select {

    static propTypes = {
        hist: PropTypes.any.isRequired,
        match: PropTypes.any.isRequired,
        history: PropTypes.any.isRequired,
        location: PropTypes.any.isRequired
    }

    constructor(props) {
        super(props)
    }
}
