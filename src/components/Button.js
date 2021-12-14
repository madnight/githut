/**
 * Material button to select the data set
 * @author Fabian Beuke <mail@beuke.org>
 * @license AGPL-3.0
 */

import { useEffect } from "react";
import { Button as MaterialButton } from "react-materialize"

export default function Button({ match, store, history, title }) {

//    let activec = active;
//    const [activec, setState] = useState(active)

    useEffect(() => {
        store[1]({ type: match.params.event })
    }, [match.params.event])
    console.log("M",match.params.event);

    function next() {
        // const rotateRight = (a) => [...a.slice(1, a.length), a[0]]
        // setState(true)
        history.push(
            "/" +
            title +
            "/" +
            match.params.year +
            "/" +
            match.params.quarter +
            (match.params.lang ?
                ("/" + match.params.lang) : "")
                )
    }
    let button;
    if(title===match.params.event){
        button= <MaterialButton
        className={
            " waves-effect waves-light blue-grey darken-1  "
        }
        onClick={next}
    >
        {title}
    </MaterialButton>
    }
    else{
        button = <MaterialButton
                    className={
                        " waves-effect waves-light blue-grey-inactive"
                    }
                    onClick={next}
                >
                    {title}
                </MaterialButton>
    }
    return (
        <div>
            <center>
                {button}
            </center>
        </div>
    )
}
