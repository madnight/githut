import React from 'react'
import { observer } from 'mobx-react'
import { Button as MaterialButton } from 'react-materialize';

/**
 * Fancy material button to select the data set
 * @author Fabian Beuke <mail@beuke.org>
 * @license AGPL-3.0
 */
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
        const buttonClass= "waves-effect waves-light blue-grey lighten-2 btn"
        return (
            <div>
                <center>
                    <MaterialButton
                        className={buttonClass}
                        onClick={next}>
                        { this.props.store.getEventName }
                    </MaterialButton>
                </center>
            </div>
        )
    }
}
