import React from 'react'
import expect from 'expect.js'
import LangTable from '../src/js/components/LangTable'
import EventStore from "../src/js/stores/EventStore"
import HistStore from "../src/js/stores/HistStore"
import { mount } from 'enzyme'
import _ from 'lodash'

describe('Test LangTable', () => {
    it('component import should work', () => {
        expect(LangTable).not.to.be.equal(null)
    })

    it('render should work', () => {
        mount(<LangTable store={EventStore} hist={HistStore}/>)
    })

    it('chart should contain top 50 languages', async () => {
        const wrapper = mount(<LangTable store={EventStore} hist={HistStore}/>)
        const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
        await sleep(3000)
        const html = wrapper.html()
        _.each(['Ranking', 'Trend', 'Python', 'TypeScript',
            'CoffeeScript', 'Haskell'], (lang) =>
            expect(html).to.contain(lang)
        )
    }).timeout(5000)

    it('chart should not contain non programming languages', async () => {
        const wrapper = mount(<LangTable store={EventStore} hist={HistStore}/>)
        const html = wrapper.html()
        _.each(['Makefile', 'Jupyter Notebook', 'Smalltalk'], (lang) =>
            expect(html).to.not.contain(lang)
        )
    })
})
