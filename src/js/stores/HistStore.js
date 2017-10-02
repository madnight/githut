import { computed, observable } from "mobx"

/**
 * This Store keeps the current time state year and quarter
 * @author Fabian Beuke <mail@beuke.org>
 * @license AGPL-3.0
 */
export class HistStore {

    @observable data = {}

    constructor() {
        this.data = { year: '2017', quarter: '3' }
    }

    @computed get getData() {
        return this.data
    }

}
export default new HistStore
