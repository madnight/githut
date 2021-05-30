/**
 * Material button to select the data set
 * @author Fabian Beuke <mail@beuke.org>
 * @license AGPL-3.0
 */

import React, { useEffect, useState } from "react"
import { Button as MaterialButton } from "react-materialize"
import { Link } from "react-router-dom"

export default function Button({ match, store, history }) {
    const [state, setState] = useState([
        "pushes",
        "stars",
        "issues",
        "pull_requests",
    ])

    useEffect(() => {
        store[1]({ type: match.params.event })
    }, [match.params.event])

    function next() {
        const rotateRight = (a) => [...a.slice(1, a.length), a[0]]
        setState(rotateRight(state))
        history.push(
            "/githut/" +
                state[0] +
                "/" +
                match.params.year +
                "/" +
                match.params.quarter
        )
    }

    const loc = window.location.href

    let x = "pull_requests"

    if (loc.includes("pull_requests")) { x = "stars" }
    if (loc.includes("stars")) { x = "pushes" }
    if (loc.includes("pushes")) { x = "issues" }
    if (loc.includes("issues")) { x = "pull_requests" }

    const link =
        "/githut/" + x + "/" + match.params.year + "/" + match.params.quarter


    return (
        <div>
            <center>
                <Link to={link} activeClassName="active">
                <MaterialButton
                    className={
                        "waves-effect waves-light blue-grey lighten-2 btn"
                    }
                    onClick={next}
                >
                    {store[0].name}
                </MaterialButton>
                </Link>
            </center>
        </div>
    )
}
