/**
 * Simple bootstrap select button to select the quarter
 * for the language ranking table
 * @author Fabian Beuke <mail@beuke.org>
 * @license AGPL-3.0
 */

import { observer } from 'mobx-react'
import 'react-select/dist/react-select.css'
import Select from './Select'
import React from 'react'

@observer
export default class SelectQuarter extends Select {

    static propTypes = {
        hist: React.PropTypes.any.isRequired,
        match: React.PropTypes.any.isRequired,
        history: React.PropTypes.any.isRequired,
        location: React.PropTypes.any.isRequired
    }

    constructor(props) {
        super(props)
    }
}
