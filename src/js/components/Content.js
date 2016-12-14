import React from 'react'
import ReactMarkdown from "react-markdown"
import content from "../../content/content.md"

export default class Content extends React.Component {

    constructor() {
        super()
        this.contentStyle = {
            width: '100%',
            margin: 'auto',
            maxWidth: 960,
            align: 'center',
            overflow: 'hidden',
            padding: '10px',
            color: '#111',
            fontSize: 13
        };
    };

    render() {
        console.log(content)
        return (
            <div style={this.contentStyle}>
                <div style={ { margin: '20px 100px' } }>
                    <ReactMarkdown source={content}/>
                </div>
            </div>
        );
    }

}
