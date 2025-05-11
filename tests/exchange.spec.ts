import {expect, test} from "@playwright/test";

test("Verify Euro exchange - TRANSILVANIA EXCHANGE", async ({page}) => {
    await page.goto("https://transilvaniaexchange.ro/")
    const sellEuroText = await page.locator(".row-2.even .column-5").textContent()
    console.log(sellEuroText)

    // Clean and convert the string to a number
    const sellEuroRaw = parseFloat(sellEuroText?.replace(",", ".") || "0")

    console.log(sellEuroRaw)
    expect(sellEuroRaw).toBeLessThan(5)
})