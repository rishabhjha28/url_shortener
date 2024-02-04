const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'rishabhanandjha@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

module.exports = transporter;