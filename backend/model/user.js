const mongoose = require('mongoose');
const { generateOtp } = require('../utilities/usefull');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        min: 1,
        max: 40
    },
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    role: {
        type: String,
        enum : ['user','admin'],
        required: true,
        default: 'user'
    },
    verified:{
        required: true,
        type: Boolean,
        default: false
    },
    loginVerificationOTP:{
        type: String,
        default: generateOtp
    },
    loginVerificationOTPGenerationTime:{
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('User', userSchema);