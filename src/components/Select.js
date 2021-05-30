import React, { useState, useEffect } from "react"
import { range, toString } from "lodash/fp"
import { getMaxDataDate } from "../utils.js"
import { Link } from "react-router-dom"

export default function Select(props) {
    const year = props.year
    const [state, setState] = useState({})

    function vals(start, end) {
        return range(--start, end).map((i) => ({
            value: toString(i + 1),
            label: toString(i + 1),
        }))
    }

    function setValue(value) {
        const [_, dispatch] = props.hist

        dispatch({ type: year ? "setYear" : "setQuarter", payload: value })
        setState({ ...state, value: value })
    }

    useEffect(() => {
        getMaxDataDate().then((maxDate) => {
            setState({
                ...state,
                options: year ? vals(2014, maxDate.year) : vals(1, 4),
                value: year
                    ? props.match.params.year
                    : props.match.params.quarter,
            })
        })
        const { params } = props.match
        setValue(year ? params.year : params.quarter)
    }, [])

    if (!state) return null
    // const styles = {
    //     control: (provided) => ({ ...provided, height: 38 }),
    //     valueContainer: (provided) => ({ ...provided, height: 38 }),
    // }

    // <ReactSelect
    //     styles={styles}
    //     onChange={onChange}
    //     options={state.options}
    //     searchable={false}
    //     clearable={false}
    //     value={{ value: state.value, label: state.value }}
    // />

    if (!state.options) return (null)
    return (
        <div style={{ width: "200px", paddingRight: "20px" }}>
            <h4 className="section-heading">{year ? "Year" : "Quarter"}</h4>

            <div className="dropdown">
                <button className="dropbtn">Dropdown</button>
                <div className="dropdown-content">

 {[2014, 2015].map((link) => (
                    <Link key={1} to={link}>{link}</Link>
    ))}
                </div>
            </div>
        </div>
    )
}
