import React from 'react'
import content from '../../content/content.md'

export default class Content extends React.Component {

  constructor () {
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
    }
  }

  render () {
    return (
            <div style={this.contentStyle}>
                <div style={ { margin: '20px 100px' } }>
                    {/* only dangerously if content is loaded from external ressource */}
                    <div dangerouslySetInnerHTML={ { __html: content } }/>
                </div>
            </div>
    )
  }

}
