import React from 'react'
import expect from 'expect.js'
import Content from '../src/js/components/Content'
import { shallow } from 'enzyme'

describe('Test Content', () => {
    it('component import should work', () => {
        expect(Content).not.to.be.equal(null)
    })

    it('render should work', () => {
        shallow(<Content/>)
    })

    it('content should contain some content text, PYPL', () => {
        const html = shallow(<Content/>).html()
        expect(html).to.contain('By analyzing how languages are used in GitHub')
        expect(html).to.contain('Related Work')
        expect(html).to.contain('PYPL PopularitY of Programming Language Index')
        expect(html).to.not.contain('Example Index 42')
    })
})
