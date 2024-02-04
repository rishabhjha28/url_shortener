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

const sendMail = async (to, subject, html) => {
    const mailOptions = {
        from: 'thegodrishabhanandjha@gmail.com',
        to,
        subject,
        html
    }
    return await transporter.sendMail(mailOptions)
}

module.exports = {
    sendMail
}