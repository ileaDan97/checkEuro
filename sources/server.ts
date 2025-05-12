import {chromium} from 'playwright';
// @ts-ignore
import nodemailer from 'nodemailer';
// @ts-ignore
import dotenv from 'dotenv';

dotenv.config();

let checkEuroValue = async () => {
    const browser = await chromium.launch({headless: true});
    const page = await browser.newPage();

    await page.goto("https://transilvaniaexchange.ro/")

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

    console.log("┌────────────────────────────┬──────┬────────┬────────┐");
    console.log("│ Currency                   │ Code │  Buy   │  Sell  │");
    console.log("├────────────────────────────┼──────┼────────┼────────┤");

    for (const row of rows) {
        if (row.currency && row.code) {
            console.log(`│ ${row.currency.padEnd(26)} │ ${row.code.padEnd(4)} │ ${row.buy?.padEnd(6)} │ ${row.sell?.padEnd(6)} │`);
        }
    }

    console.log("└────────────────────────────┴──────┴────────┴────────┘");

}

let sendEmail = async () => {
    const currentExchange = await checkEuroValue()
    const transporter = nodemailer.createTransport({
        service: 'yahoo',
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASSWORD, // NOT your Gmail password!
        },
    });

    const mailOptions = {
        from: process.env.USER_EMAIL,
        to: process.env.USER_EMAIL,
        subject: 'check daily Euro rate',
        text: `Euro current exchange is ${currentExchange}`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

sendEmail()