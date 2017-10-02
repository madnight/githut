import React from 'react'
import expect from 'expect.js'
import LicensePie from '../src/js/components/LicensePie'
import { mount } from 'enzyme'
import _ from 'lodash'
const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time))
const waitFor = async (wrapper, str) => {
    while (!_.includes(wrapper.html(), str))
        await sleep(10)
}
describe('Test LicensePie', () => {
    it('component import should work', () => {
        expect(LicensePie).not.to.be.equal(null)
    })

    it('render should work', () => {
        mount(<LicensePie/>)
    })

    it('pie should contain top licenses', async () => {
        const wrapper = mount(<LicensePie/>)
        await waitFor(wrapper, "mit")
        const html = wrapper.html()
        _.each(['gpl-2.0', 'mit', 'bsd-3-clause'], (lang) =>
            expect(html).to.contain(lang)
        )
    })

    it('pie should not contain non licenses', async () => {
        const wrapper = mount(<LicensePie/>)
        await waitFor(wrapper, "mit")
        const html = wrapper.html()
        _.each(['lol', '42-license'], (lang) =>
            expect(html).to.not.contain(lang)
        )
    })
})
