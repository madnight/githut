/**
 * Fancy material button to select the data set
 * @author Fabian Beuke <mail@beuke.org>
 * @license AGPL-3.0
 */

import React, { useEffect } from "react"
import { observer } from "mobx-react"
import { Button as MaterialButton } from "react-materialize"

export default observer(function Button({ match, store, history }) {
    useEffect(() => {
        const urlToEvent = (url) =>
            url.replace(/_/g, " ").replace(/\b[a-z]/g, (f) => f.toUpperCase())
        store.set(urlToEvent(match.params.event))
    }, [])

    function next() {
        store.next()
        const eventToUrl = (event) => event.toLowerCase().replace(/ /g, "_")
        history.push(
            "/" +
                eventToUrl(store.getEventName) +
                "/" +
                match.params.year +
                "/" +
                match.params.quarter
        )
    }

    const buttonClass = "waves-effect waves-light blue-grey lighten-2 btn"
    return (
        <div>
            <center>
                <MaterialButton
                    className={buttonClass}
                    onClick={next}
                >
                    {store.getEventName}
                </MaterialButton>
            </center>
        </div>
    )
})
