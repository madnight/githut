/**
 * Simple bootstrap select button to select the year
 * for the language ranking table
 * @author Fabian Beuke <mail@beuke.org>
 * @license AGPL-3.0
 */

import { observer } from 'mobx-react'
import 'react-select/dist/react-select.css'
import Select from './Select'

@observer
export default class SelectYear extends Select {

    constructor(props) {
        super(props)
        this.year = true
        this.state = {
            options: this.vals(2014, 2018),
            value: this.props.match.params.year
        }
    }
}
