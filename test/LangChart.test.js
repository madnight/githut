import React from 'react'
import expect from 'expect.js'
import LangChart from '../src/js/components/LangChart'
import {mount} from 'enzyme'
import {map, first} from 'lodash'
const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time))

describe('Test LangChart', () => {
  it('component import should work', () => {
    expect(LangChart).not.to.be.equal(null)
  })

  it('categories return array', () => {
    expect((new LangChart()).categories()).to.be.an(Array)
  })

  it('categories generates YEAR/QUARTER (12/Q1, 12/Q2, ...)', () => {
    _.mixin({
      contain: (a, b) => {
        expect(a).to.contain(b)
        return a
      },
      notcontain: (a, b) => {
        expect(a).to.not.contain(b)
        return a
      }
    })
    return _.chain((new LangChart()).categories())
            .contain('12/Q1')
            .contain('12/Q2')
            .contain('13/Q3')
            .contain('16/Q4')
            .notcontain('11/Q1')
            .notcontain('101/Q1')
            .notcontain('Q1/15')
            .value()
  })

  it('sumQuarters summarize monthly data to quarters', () => {
    const sumQ = (new LangChart()).sumQuarters([
            { data: [ 1, 2, 3 ] },
            { data: [ 0, 5, 42 ] },
            { data: [ -2, 2, 2, 50, 1, 2 ] }
    ])
    expect(sumQ).to.eql([
            { data: [ 6 ] },
            { data: [ 47 ] },
            { data: [ 2, 53 ] }
    ])
    expect(sumQ).not.to.eql([
            { data: [ 6 ] },
            { data: [ 47 ] },
            { data: [ 3, 53 ] }
    ])
  })

  it('render should work', () => {
    mount(<LangChart/>)
  })

  it('chart should contain JavaScript and Python', () => {
    const wrapper = mount(<LangChart/>)
    return sleep(1500).then(() => {
      expect(wrapper.html()).to.contain('JavaScript')
      expect(wrapper.html()).to.contain('Python')
    })
  })
})
