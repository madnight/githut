import React from 'react'
import {observer} from 'mobx-react'
import { first, keys } from 'lodash/fp'

@observer
export default class Button extends React.Component {

    constructor() {
        super()
    }

    static propTypes = {
        store: React.PropTypes.any.isRequired
    }

    render() {
        const next = () => this.props.store.next()
        return (
            <div>
                <center>
                    <button onClick={next}>
                        { this.props.store.event | first | keys }
                    </button>
                </center>
            </div>
        )
    }

}
