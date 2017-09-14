import React from 'react'
import ReactDisqusThread from 'react-disqus-thread'

export default class Comments extends React.Component {

  constructor () {
    super()
    this.style = {
      width: '100%',
      margin: 'auto',
      maxWidth: 760
    }
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
