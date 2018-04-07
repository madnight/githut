import React from 'react'
import PropTypes from 'prop-types'

export default class Lang extends React.Component {

    static propTypes = {
        store: PropTypes.object.isRequired,
        table: PropTypes.object.isRequired,
        hist: PropTypes.object
    }


    constructor(props) {
        super(props)
    }
}
