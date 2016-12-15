import React from 'react'

export default class Content extends React.Component {

    constructor() {
        super()
    };

    render() {
        return (
            <div id="wrapper">
                <div id="header">
                    <h1>Git<b>Hut 2.0</b></h1>
                    <h2>A small place to discover languages in GitHub</h2>
                    <div class="social social-top">
                        <a href="//github.com/madnight/githut/" target="_blank" title="GitHub Repository"> <i class="fa fa-github"></i></a>
                    </div>
                </div>
            </div>
        );
    }

}
