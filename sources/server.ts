import { chromium } from 'playwright';
let checkEuroValue = async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto("https://transilvaniaexchange.ro/")
    const sellEuroText = await page.locator(".row-2.even .column-5").textContent()
    console.log(sellEuroText)

    // Clean and convert the string to a number
    const sellEuroRaw = parseFloat(sellEuroText?.replace(",", ".") || "0")

    console.log(sellEuroRaw)
}



checkEuroValue()