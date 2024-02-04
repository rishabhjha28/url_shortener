const emailTemplateForLoginOTP = (otp) => {
    return `
        <h1>Your OTP is ${otp}</h1>
        <p>Use this OTP to verify your email</p>
        <p><b>note:</b>Do not share this OTP with anyone and it's <b>valid</b> only for <b>15 min only</b></p>
    `;
}

module.exports = { emailTemplateForLoginOTP };