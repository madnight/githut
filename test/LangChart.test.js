import React from "react"
import expect from 'expect.js'
import LangTable from '../src/js/components/LangTable'
import LangChart from '../src/js/components/LangChart'
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

const match = { params: {lang: undefined} }

describe('Test LangChart', () => {
    it('component import should work', () => {
        expect(LangChart).not.to.be.equal(null)
    })

    it('render should work', () => {
        mount(<LangChart match={match} hist={hist} store={event} table={table}/>)
    }).timeout(10000)

    it('chart should contain JavaScript and Python', async () => {

        mount(<LangChart match={match} hist={hist} store={event} table={table}/>)

        const wrapper = mount(
            <LangTable match={match} store={event} hist={hist} table={table}>
                <LangChart match={match} hist={hist} store={event} table={table}/>
            </LangTable>
        )

        const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
        await sleep(3000)
        const html = wrapper.children().html()
        expect(html).to.contain('JavaScript')
        expect(html).to.contain('Python')
    }).timeout(10000)
})
