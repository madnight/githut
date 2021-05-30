/**
 * @jest-environment jsdom
*/

import React from "react"
import expect from "expect.js"
import Layout from "../src/components/Layout"
import { shallow, configure, mount } from "enzyme"
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { MemoryRouter } from "react-router-dom"
import ReactDOM from "react-dom";
configure({ adapter: new Adapter() })

describe("Test Layout", () => {
    it("render should work", () => {
        shallow(
            <MemoryRouter>
                <Layout />
            </MemoryRouter>
        )
    })

    it("content should contain GPLv3, Carlo Zapponi", () => {
        const html = mount(
            <MemoryRouter>
                <Layout />
            </MemoryRouter>
        ).html()

        expect(html).to.contain("GNU Affero General Public License")
        expect(html).to.contain("Carlo Zapponi")
        expect(html).to.contain("By analyzing how languages are used in GitHub")
        expect(html).to.contain("Related Work")
        expect(html).to.contain("PYPL PopularitY of Programming Language Index")
        expect(html).to.contain("Haskell")
        expect(html).to.contain("Python")
        expect(html).to.contain("TypeScript")

        expect(html).to.not.contain("Makefile")
        expect(html).to.not.contain("Jupyter Notebook")
        expect(html).to.not.contain("HTML")
        expect(html).to.not.contain("Example Index 42")
        expect(html).to.not.contain("license-42")
        expect(html).to.not.contain("Cucumber")
        expect(html).to.not.contain("Fabian")
    })
})
