/**
 * Contains everything that belongs into the page header
 * Please note this class is not to be confused with Head.js (html head)
 * Fork me ribbon, page title and desc
 * @author Fabian Beuke <mail@beuke.org>
 * @license AGPL-3.0
 */

import GitHubForkRibbon from "react-github-fork-ribbon";

export default function Header() {
    return (
        <div id="wrapper">
            <div id="header">
                <h1>
                    Git<b>Hut 2.0</b>
                </h1>
                <h2>A small place to discover languages in GitHub</h2>
            </div>
            <GitHubForkRibbon
                href="//github.com/madnight/githut"
                color="black"
                target="_blank"
                position="right"
            >
                Fork me on GitHub
            </GitHubForkRibbon>
        </div>
    )
}
