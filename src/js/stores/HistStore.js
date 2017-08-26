import { computed, observable } from "mobx"

export class HistStore {

  @observable data = {}

  constructor() {
    this.data = { year: '2017', quarter: '2' }
  }

  @computed get getData() {
    return this.data
  }

}
export default new HistStore
