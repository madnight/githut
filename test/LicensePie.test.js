import React from 'react'
import expect from 'expect.js'
import LicensePie from '../src/js/components/LicensePie'
import { mount } from 'enzyme'
import _ from 'lodash'
const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time))

describe('Test LicensePie', () => {
  it('component import should work', () => {
    expect(LicensePie).not.to.be.equal(null)
  })

  it('render should work', () => {
    mount(<LicensePie/>)
  })

  it('pie should contain top licenses', () => {
    const wrapper = mount(<LicensePie/>)
    return sleep(500).then(() => {
      const html = wrapper.html()
      _.each(['gpl-2.0', 'mit', 'bsd-3-clause'], (lang) =>
        expect(html).to.contain(lang)
      )
    })
  })

  it('pie should not contain non licenses', () => {
    const wrapper = mount(<LicensePie/>)
    return sleep(500).then(() => {
      const html = wrapper.html()
      _.each(['lol', '42-license'], (lang) =>
        expect(html).to.not.contain(lang)
      )
    })
  })
})
