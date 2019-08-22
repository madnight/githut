/**
 * The description / explanation of the chart and table, explains
 * data source, data aggregation, trend calculation, ...
 * Compiles markdown into html, content.md -> html
 * @author Fabian Beuke <mail@beuke.org>
 * @license AGPL-3.0
 */

import React from 'react'
import content from '../../content/content.md'

export default class Content extends React.Component {
    constructor () {
        super()
        this.contentStyle = {
            margin: 'auto',
            marginTop: '40px',
            marginBottom: '40px',
            maxWidth: 760,
            textAlign: 'justify',
            fontSize: 13
        }
    }

    shouldComponentUpdate (nextProps, nextState) {
        return false
    }

    /**
     * Please note that dangerouslySetInnerHTM is only dangerously
     * if content is loaded from external ressource, thats not the case here
     * For more information about dangerouslySetInnerHTML
     * @see {@link https://facebook.github.io/react/docs/dom-elements.html#dangerouslysetinnerhtml}
     */
    render () {
        return (
            <div style={this.contentStyle}>
                <div dangerouslySetInnerHTML={ { __html: content } }/>
            </div>
        )
    }
}
