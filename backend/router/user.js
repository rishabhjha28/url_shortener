const express = require('express');
const router = express.Router();
const {login, signin, logout, verifyLoginOTP} = require('../controller/user');
const { isAuthorized } = require('../utilities/authorization');

router.post('/signin', signin);

router.post('/login', login);

router.post('/logout',isAuthorized, logout);

router.post('/verify', verifyLoginOTP )

module.exports = router;