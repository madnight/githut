/**
 * Simple discussion box
 * @author Fabian Beuke <mail@beuke.org>
 * @license AGPL-3.0
 */

import React from "react"
import ReactDisqusThread from "react-disqus-comments"

export default function Comments() {
    return (
        <div style={{ margin: "auto", maxWidth: 760 }}>
            <ReactDisqusThread
                shortname="githut2"
                identifier="githut2"
                title="GitHut2 Thread"
            />
        </div>
    )
}
