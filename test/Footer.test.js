import React from 'react'
import expect from 'expect.js'
import Footer from '../src/js/components/Footer'
import { shallow, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
configure({ adapter: new Adapter() })


describe('Test Footer', () => {
    it('component import should work', () => {
        expect(Footer).not.to.be.equal(null)
    })

    it('render should work', () => {
        shallow(<Footer/>)
    })

    it('content should contain GPLv3, Carlo Zapponi', () => {
        const html = shallow(<Footer/>).html()
        expect(html).to.contain('GNU Affero General Public License')
        expect(html).to.contain('Carlo Zapponi')
        expect(html).to.not.contain('Fabian')
    })
})
