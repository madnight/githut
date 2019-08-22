/**
 * Simple discussion box
 * @author Fabian Beuke <mail@beuke.org>
 * @license AGPL-3.0
 */

import React from 'react'
import ReactDisqusThread from 'react-disqus-comments'

export default class Comments extends React.Component {
    constructor () {
        super()
        this.style = {
            margin: 'auto',
            maxWidth: 760
        }
    }

    shouldComponentUpdate (nextProps, nextState) {
        return false
    }

    render () {
        return (
            <div style={this.style}>
                <ReactDisqusThread
                    shortname="githut2"
                    identifier="githut2"
                    title="GitHut2 Thread"
                />
            </div>
        )
    }
}
