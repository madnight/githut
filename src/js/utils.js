import axios from 'axios'
import { map, split, max, values, filter } from 'lodash/fp'
import pullRequests from '../data/gh-pull-request.json'

const getMaxDataDate = async () => {
    const data = await axios.get(pullRequests)
    const d = data.data | split('\n') | map(JSON.parse)
    const year = d
        | map('year')
        | values
        | max
    const maxQuarter = d
        | filter({ 'year': year })
        | map('quarter')
        | values
        | max
    return {year: year, quarter: maxQuarter}
}

module.exports = {
    getMaxDataDate: getMaxDataDate
}
