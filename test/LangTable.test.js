import React from "react"
import expect from 'expect.js'
import LangTable from '../src/js/components/LangTable'
import { mount, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
configure({ adapter: new Adapter() })
import _ from 'lodash'

import pullRequests from "../src/data/gh-pull-request.json"
import pushEvent from "../src/data/gh-push-event.json"
import starEvent from "../src/data/gh-star-event.json"
import issueEvent from "../src/data/gh-issue-event.json"

const table = [{}, () => []];
const hist = [{ year: "2018", quarter: "1" }, () => []]
const event = [ {
    data: pullRequests,
    name: "Pull Requests",
    pullRequests,
    pushEvent,
    starEvent,
    issueEvent,
}, () => []]

describe('Test LangTable', () => {
    it('component import should work', () => {
        expect(LangTable).not.to.be.equal(null)
    })

    it('render should work', () => {
        mount(<LangTable table={table} store={event} hist={hist}/>)
    })

    it('chart should contain top 50 languages', async () => {
        const wrapper = mount(<LangTable store={event} hist={hist} table={table}/>)
        const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
        await sleep(3000)
        const html = wrapper.html()
        _.each(['Ranking', 'Trend', 'Python', 'TypeScript',
            'CoffeeScript', 'Haskell'], (lang) =>
            expect(html).to.contain(lang)
        )
    }).timeout(5000)

    it('chart should not contain non programming languages', async () => {
        const wrapper = mount(<LangTable table={table} store={event} hist={hist}/>)
        const html = wrapper.html()
        _.each(['Makefile', 'Jupyter Notebook','HTML'], (lang) =>
            expect(html).to.not.contain(lang)
        )
    })
})
