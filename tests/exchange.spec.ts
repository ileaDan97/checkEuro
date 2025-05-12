import {test} from "@playwright/test";

test("Verify Euro exchange - TRANSILVANIA EXCHANGE", async ({page}) => {
    await page.goto('https://transilvaniaexchange.ro/');

    const rows = await page.$$eval('#tablepress-1 tbody tr', trs => {
        return trs.map(tr => {
            const cells = tr.querySelectorAll('td');
            return {
                currency: cells[1]?.textContent?.trim(),
                code: cells[2]?.textContent?.trim(),
                buy: cells[3]?.textContent?.trim(),
                sell: cells[4]?.textContent?.trim(),
            };
        });
    });

    console.log("┌────────────────────────────┬─────┬────────┬────────┐");
    console.log("│ Currency                   │ Code│  Buy   │  Sell  │");
    console.log("├────────────────────────────┼─────┼────────┼────────┤");

    for (const row of rows) {
        if (row.currency && row.code) {
            console.log(`│ ${row.currency.padEnd(26)} │ ${row.code.padEnd(4)} │ ${row.buy?.padEnd(6)} │ ${row.sell?.padEnd(6)} │`);
        }
    }

    console.log("└────────────────────────────┴─────┴────────┴────────┘");
})