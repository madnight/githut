import expect from "expect.js"
import puppeteer from "puppeteer"

describe("E2E Test Githut 2.0", () => {
    test("check if elements are there", async () => {
        let browser = await puppeteer.launch({ headless: true })
        let page = await browser.newPage()

        await page.goto("http://localhost:8080", {
            waitUntil: ["networkidle0", "domcontentloaded"],
        })
        let html = await page.evaluate(() => document.querySelector("*").outerHTML)

        expect(html).to.contain("gpl-2.0")
        expect(html).to.contain("bsd-3-clause")
        expect(html).to.contain("Ranking")
        expect(html).to.contain("Python")
        expect(html).to.contain("By analyzing how languages are used in GitHub")
        expect(html).to.contain("Related Work")
        expect(html).to.contain("PYPL PopularitY of Programming Language Index")
        expect(html).to.contain("Haskell")
        expect(html).to.contain("TypeScript")

        expect(html).to.not.contain("Makefile")
        expect(html).to.not.contain("Jupyter Notebook")
        expect(html).to.not.contain("HTML")
        expect(html).to.not.contain("Example Index 42")
        expect(html).to.not.contain("license-42")
        expect(html).to.not.contain("Cucumber")

        await page.goto("http://localhost:8080/#/pull_requests/2014/1", {
            waitUntil: ["networkidle0", "domcontentloaded"],
        })
        await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] })
        html = await page.evaluate(() => document.querySelector("*").outerHTML)

        expect(html).to.contain("Cucumber")
        expect(html).to.contain("19.761%")
        expect(html).to.contain("16.468%")

        await page.goto("http://localhost:8080/#/stars/2016/2", {
            waitUntil: ["networkidle0", "domcontentloaded"],
        })
        await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] })
        html = await page.evaluate(() => document.querySelector("*").outerHTML)

        expect(html).to.contain("DIGITAL Command Language")
        expect(html).to.contain("31.171%")
        expect(html).to.contain("12.134%")

        await browser.close()
    }, 60 * 1000)
})
