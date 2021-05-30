import { useState, useEffect } from "react";
import ReactSelect from "react-select"
import { range, toString } from "lodash/fp"
import { getMaxDataDate } from "utils.js"

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

    function histPush(x, y, z) {
        props.history.push("/" + x + "/" + y + "/" + z)
    }

    function onChange({ value }) {
        const { params } = props.match
        setValue(value)
        if (year) {
            histPush(params.event, value, params.quarter)
        } else {
            histPush(params.event, params.year, value)
        }
    }

    if (!state) return null
    const styles = {
        control: (provided) => ({ ...provided, height: 38 }),
        valueContainer: (provided) => ({ ...provided, height: 38 }),
    }
    return (
        <div style={{ width: "200px", paddingRight: "20px" }}>
            <h4 className="section-heading">{year ? "Year" : "Quarter"}</h4>
            <ReactSelect
                styles={styles}
                onChange={onChange}
                options={state.options}
                searchable={false}
                clearable={false}
                value={{ value: state.value, label: state.value }}
            />
        </div>
    )
}
