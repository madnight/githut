import { computed, observable, action } from "mobx";

class SelectedLangStore {
    @observable selected = [];

    @computed get getData() {
        return this.selected;
    }

    @action async set(d) {
        this.selected = d;
    }

    @action add(s) {
        this.selected.push(s);
    }

    @action delete(s) {
        const i = this.selected.indexOf(s);
        if (i !== -1) {
            this.selected.splice(i, 1);
        }
    }
}

export default new SelectedLangStore()
