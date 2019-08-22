import { computed, observable, action } from 'mobx'

/**
 * @author Fabian Beuke <mail@beuke.org>
 * @license AGPL-3.0
 */
export class TableStore {
    @observable data = {}

    constructor () {
        this.data = { }
    }

    @computed get getData () {
        return this.data
    }

    @action async set (d) {
        this.data = d
    }
}
export default new TableStore()
