/**
 * This reducer keeps track of the state of
 * Pull Request, Pushes, Stars or Issues depending on users choice
 * @author Fabian Beuke <mail@beuke.org>
 * @license AGPL-3.0
 */
export default function eventReducer(state, action) {
    switch (action.type) {
        case "pull_requests":
            return { ...state, name: "Pull Request", data: state.pullRequests }
        case "stars":
            return { ...state, name: "Stars", data: state.starEvent }
        case "pushes":
            return { ...state, name: "Pushes", data: state.pushEvent }
        case "issues":
            return { ...state, name: "Issues", data: state.issueEvent }
        default:
            return { ...state, name: "Pull Request", data: state.pullRequests }
    }
}
