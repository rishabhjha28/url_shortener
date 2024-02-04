const express = require('express');
const router = express.Router();
const {login, signin, logout, verifyLoginOTP, regenerateLoginOTP} = require('../controller/user');
const { isAuthorized } = require('../utilities/authorization');

router.post('/signin', signin);

router.post('/login', login);

router.post('/logout',isAuthorized, logout);

router.post('/verify', verifyLoginOTP )

router.post('/regenerateloginotp',regenerateLoginOTP)
module.exports = router;