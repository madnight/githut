import React from 'react'
import expect from 'expect.js'
import LangChart from '../src/js/components/LangChart'
import { mount } from 'enzyme'
import _ from 'lodash'

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time))
const waitFor = async (wrapper, str) => {
  while (!_.includes(wrapper.html(), str))
      await sleep(10)
}

describe('Test LangChart', () => {
  it('component import should work', () => {
    expect(LangChart).not.to.be.equal(null)
  })

  it('categories return array', () => {
    expect((new LangChart()).categories()).to.be.an(Array)
  })

  it('categories generates YEAR/QUARTER (12/Q1, 12/Q2, ...)', () => {
    const cats = new LangChart().categories()
    _.each(['12/Q1', '13/Q3', '16/Q4'], (date) =>
      expect(cats).to.contain(date)
    )
    _.each(['11/Q1', '101/Q1', '14/Q5', 'Q1/15'], (date) =>
      expect(cats).to.not.contain(date)
    )
  })

  it('render should work', () => {
    mount(<LangChart/>)
  })

  it('chart should contain JavaScript and Python', async () => {
    const wrapper = mount(<LangChart/>)
    await waitFor(wrapper, "Python")
    expect(wrapper.html()).to.contain('JavaScript')
    expect(wrapper.html()).to.contain('Python')
  }).timeout(5000)
})
