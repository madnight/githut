import React from 'react'
import {observer} from 'mobx-react'
import { update, range, includes, uniqBy, reject, flatten, map, split, take, zipWith, divide, unzip, sum, filter, drop } from 'lodash/fp'

@observer
export default class Button extends React.Component {

    constructor() {
        super()
    }

    render() {
        const next = () => this.props.store.next()
        return (
            <div>
                <center>
                    <button onClick={next}>
                        { this.props.store.id }
                    </button>
                </center>
            </div>
        )
    }

}
