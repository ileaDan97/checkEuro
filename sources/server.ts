import {chromium} from 'playwright';
// @ts-ignore
import nodemailer from 'nodemailer';
// @ts-ignore
import dotenv from 'dotenv';

dotenv.config();

let checkEuroValue = async () => {
    const browser = await chromium.launch({headless: true});
    const page = await browser.newPage();

    let response: string = '';

    await page.goto("https://transilvaniaexchange.ro/");

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


    for (const row of rows) {
        if (row.currency && row.code && row.buy && row.sell) {
            response += `│ ${row.currency.padEnd(26)} │ ${row.code.padEnd(4)} │ ${row.buy.padStart(6)} │ ${row.sell.padStart(6)} │\n`;
        }
    }

    await browser.close();

    return response;
}

let sendEmail = async () => {

    const currentExchange = await checkEuroValue()
    const transporter = nodemailer.createTransport({
        service: 'yahoo',
        auth: {
            user: process.env.SECRET_NAME,
            pass: process.env.SECRET_PASSWORD, // NOT your Gmail password!
        },
    });

    const mailOptions = {
        from: process.env.SECRET_NAME,
        to: process.env.SECRET_NAME,
        subject: 'check daily Euro rate',
        text: currentExchange
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

sendEmail()