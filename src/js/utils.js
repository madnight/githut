import { map, max, values, filter } from 'lodash/fp'
import pullRequests from '../data/gh-pull-request.json'

const getMaxDataDate = async () => {
    const year = pullRequests
        | map('year')
        | values
        | max
    const maxQuarter = pullRequests
        | filter({ 'year': year })
        | map('quarter')
        | values
        | max
    return {year: year, quarter: maxQuarter}
}

module.exports = {
    getMaxDataDate: getMaxDataDate
}
