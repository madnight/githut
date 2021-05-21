/**
 * This reducer handles year and quarter state changes
 * @author Fabian Beuke <mail@beuke.org>
 * @license AGPL-3.0
 */

export default function histReducer(state, action) {
    switch (action.type) {
        case "setYear":
            return { ...state, year: action.payload }
        case "setQuarter":
            return { ...state, quarter: action.payload }
        default:
            throw new Error()
    }
}
