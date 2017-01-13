import React from 'react'
import expect from 'expect.js'
import LangChart from '../src/js/components/LangChart'
import EventStore from "../src/js/stores/EventStore"
// import {React as R} from 'react/addons'
import { mount } from 'enzyme'
import _ from 'lodash'

describe('Test LangChart', () => {
  it('component import should work', () => {
    expect(LangChart).not.to.be.equal(null)
  })

  it('categories return array', () => {
    expect((new LangChart()).categories()).to.be.an(Array)
  })

  it('categories generates YEAR/QUARTER (12/Q1, 12/Q2, ...)', () => {
    const cats = new LangChart().categories()
    _.each(['12/Q2', '13/Q3', '16/Q4'], (date) =>
      expect(cats).to.contain(date)
    )
    _.each(['11/Q1', '101/Q1', '14/Q5', 'Q1/15'], (date) =>
      expect(cats).to.not.contain(date)
    )
  })

  it('render should work', () => {
    mount(<LangChart store={EventStore}/>)
  })

  it('chart should contain JavaScript and Python', async () => {
    const wrapper = mount(<LangChart store={EventStore}/>)
    expect(wrapper.html()).to.contain('JavaScript')
    expect(wrapper.html()).to.contain('Python')
  }).timeout(5000)
})
