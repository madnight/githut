/**
 * Fancy material button to select the data set
 * @author Fabian Beuke <mail@beuke.org>
 * @license AGPL-3.0
 */

import React from 'react'
import { observer } from 'mobx-react'
import { Button as MaterialButton } from 'react-materialize'

@observer
export default class Button extends React.Component {
    componentWillMount () {
        const { match, store } = this.props
        const value = match.params.event
        const urlToEvent = url => url
            .replace(/_/g, ' ')
            .replace(/\b[a-z]/g, f => f.toUpperCase())
        store.set(urlToEvent(value))
    }

    next () {
        const { match } = this.props
        this.props.store.next()
        const event = this.props.store.getEventName
        const eventToUrl = event => event
            .toLowerCase()
            .replace(/ /g, '_')
        this.props.history.push(
            '/' + eventToUrl(event)
            + '/' + match.params.year
            + '/' + match.params.quarter)
    }

    render () {
        const buttonClass = 'waves-effect waves-light blue-grey lighten-2 btn'
        return (
            <div>
                <center>
                    <MaterialButton
                        className={buttonClass}
                        onClick={this.next.bind(this)}>
                        { this.props.store.getEventName }
                    </MaterialButton>
                </center>
            </div>
        )
    }
}
