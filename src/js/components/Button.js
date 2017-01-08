import React from 'react'
import { observer } from 'mobx-react'
import { first, keys } from 'lodash/fp'
import { Button as MaterialButton } from 'react-materialize';

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
                    <MaterialButton className="waves-effect waves-light btn"  onClick={next}>
                        { this.props.store.event | first | keys }
                    </MaterialButton>
                </center>
            </div>
        )
    }

}
