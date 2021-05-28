export default function tableReducer(state, action) {
    switch (action.type) {
        case "set":
            return { data: action.payload }
        default:
            throw new Error()
    }
}
