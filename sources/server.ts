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
    const sellEuroText = await page.locator(".row-2.even .column-5").textContent()

    // Clean and convert the string to a number
    const sellEuroRaw = parseFloat(sellEuroText?.replace(",", ".") || "0")

    return sellEuroRaw
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

// sendEmail()