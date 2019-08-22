import { computed, observable, action } from 'mobx'
import pullRequests from '../../data/gh-pull-request.json'
import pushEvent from '../../data/gh-push-event.json'
import starEvent from '../../data/gh-star-event.json'
import issueEvent from '../../data/gh-issue-event.json'
import { mapValues, first, map, split, keys } from 'lodash/fp'

/**
 * This Store keeps the GitHub api data for
 * Pull Request, Pushes, Stars or Issues depending on users choice
 * @author Fabian Beuke <mail@beuke.org>
 * @license AGPL-3.0
 */
export class EventStore {
    @observable.ref data = {}
    @observable event = [
        {'Pull Requests': pullRequests},
        {'Pushes': pushEvent},
        {'Stars': starEvent},
        {'Issues': issueEvent}
    ]

    constructor () {
        this.fetchData(pullRequests)
    }

    /**
     * Selects next data set by rotation
     * @returns {Object} next GitHub api data set
     */
    @action async next () {
        const rotateRight = a => a.push(a.shift())
        rotateRight(this.event)
        this.event
          | first
          | mapValues(e => this.fetchData(e))
    }

    @action async set (event) {
        const rotateRight = a => a.push(a.shift())
        if ((this.event | map(x => (x | keys)
            .includes(event))).includes(true)) {
            while ((this.event | first | keys | first) !== event) { rotateRight(this.event) }
        }
        this.event
          | first
          | mapValues(e => this.fetchData(e))
    }

    /**
     * Parse raw GitHub api data
     * @param {Object} data - GitHub api data set
     * @returns {Object} JSON parsed result
     */
    parseJSON (data) {
        return data
          | split('\n')
          | map(JSON.parse)
    }

    /**
     * Fetches GitHub api data
     * @param {Object} json - GitHub api data set to fetch
     * @returns {Object} JSON parsed result
     */
    @action async fetchData (json) {
        this.data = json
    }

    @computed get getData () {
        return this.data
    }

    @computed get getEventName () {
        return this.event | first | keys | first
    }
}

export default new EventStore()
