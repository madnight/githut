import { map, max, values, filter, pipe } from "lodash/fp"
import pullRequests from "data/gh-pull-request.json"

export async function getMaxDataDate() {
    const year = pipe(map("year"), values, max)(pullRequests)
    const maxQuarter = pipe(
        filter({ year: year }),
        map("quarter"),
        values,
        max
    )(pullRequests)
    return { year: year, quarter: maxQuarter }
}
