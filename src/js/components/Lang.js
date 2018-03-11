import React from 'react'

export default class Lang extends React.Component {

    static propTypes = {
        store: React.PropTypes.object.isRequired,
        table: React.PropTypes.object.isRequired,
        hist: React.PropTypes.object
    }


    constructor(props) {
        super(props)
    }
}
