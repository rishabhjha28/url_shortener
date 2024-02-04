const { isEmailValid, isPasswordValid } = require('../utilities/validation');
const User = require('../model/user');
const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtTokenMaxAge } = require('../utilities/variables');
const transporter = require('../services/mail');
const { emailTemplateForLoginOTP } = require('../services/emailTemplate');
const { generateOtp, getDifferenceInMinutesWithCurruntTime } = require('../utilities/usefull');

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Please fill in all fields' });
    }
    if (!isEmailValid(email)) {
        return res.status(400).json({ error: 'Invalid email' });
    }
    if (!isPasswordValid(password)) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        if(!user.verified){
            return res.status(400).json({ error: 'Email not verified' });
        }
        const isPasswordCorrect = await bycrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const jwtToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: jwtTokenMaxAge });
        res.cookie('jwtToken', jwtToken, {
            httpOnly: true,
            maxAge: jwtTokenMaxAge * 1000,
        });
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}

const signin = async (req, res) => {
    const { email, password, fullName, role } = req.body;
    if (!email || !password || !fullName) {
        return res.status(400).json({ error: 'Please fill in all fields' });
    }
    if (!isEmailValid(email)) {
        return res.status(400).json({ error: 'Invalid email' });
    }
    if (!isPasswordValid(password)) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const salt = await bycrypt.genSalt(10);
        const hashedPassword = await bycrypt.hash(password, salt);
        const createdUser = await User.create({ email, password: hashedPassword, fullName, role });
        const mailOptions = {
            from: 'thegodrishabhanandjha@gmail.com',
            to: email,
            subject: 'Otp for god\'s url_shortener',
            html: emailTemplateForLoginOTP(createdUser.loginVerificationOTP)
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return res.status(500).json({ error: error.message || 'Internal Server Error' });
            }
            res.status(201).json({ message: `otp has been send to email ${email}` });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}

const verifyLoginOTP = async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ error: 'Please fill in all fields' });
    }
    if(!isEmailValid(email)){
        return res.status(400).json({ error: 'Invalid email' });
    }
    if(otp.length !== 6){
        return res.status(400).json({ error: 'Invalid otp' });
    }
    try {
        const userData = await User.findOne({ email , loginVerificationOTP:otp});
        if (!userData || getDifferenceInMinutesWithCurruntTime(userData.loginVerificationOTPGenerationTime) > 15) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }
        await User.findOneAndUpdate({email},{verified:true,$unset:{loginVerificationOTP:1,loginVerificationOTPGenerationTime:1}},{new:true})
        const jwtToken = jwt.sign({ id: userData._id, role: userData.role }, process.env.JWT_SECRET, { expiresIn: jwtTokenMaxAge });
        res.cookie('jwtToken', jwtToken, {
            httpOnly: true,
            maxAge: jwtTokenMaxAge * 1000,
        });
        res.status(200).json({ message: 'OTP verified' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }

}

const logout = async (req, res) => {
    res.clearCookie('jwtToken').status(200).json({ message: 'Logged out' });
}

module.exports = {
    login,
    signin,
    logout,
    verifyLoginOTP
}