import axios from 'axios'
import { computed, observable, action } from "mobx"
import pullRequests from '../../data/gh-pull-request.json'
import pushEvent from '../../data/gh-push-event.json'
import { filter, sortBy, reverse, toString, omitBy, isNil, first, assign, take, includes, reject, pick, map, split } from 'lodash/fp'

export class EventStore {

  @observable data = {}
  @observable id = "Pull Request"

  constructor() {
    this.fetchData(pullRequests)
  }

  @action async next() {
    switch (this.id) {
      case "Pull Request":
        this.fetchData(pushEvent)
        this.id = "Push Event"
        break;
      case "Push Event":
        this.fetchData(pullRequests)
        this.id = "Pull Request"
        break;
    }
  }

  parseJSON(data) {
    return data
      | split('\n')
      | map(JSON.parse)
  }

  @action async fetchData(json) {
    const { data } = await axios.get(json)
    this.data = data | this.parseJSON
  }

  @computed get getData() {
    return this.data
  }

}

export default new EventStore
