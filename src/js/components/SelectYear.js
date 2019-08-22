/**
 * Simple bootstrap select button to select the year
 * for the language ranking table
 * @author Fabian Beuke <mail@beuke.org>
 * @license AGPL-3.0
 */

import { observer } from 'mobx-react'
import Select from './Select'

@observer
export default class SelectYear extends Select {
    constructor (props) {
        super(props)
        this.year = true
    }
}
