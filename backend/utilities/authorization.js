const jwt = require('jsonwebtoken');

const isAuthorized = async (req, res, next) => {
    const { jwtToken } = req.cookies;
    if (!jwtToken) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const payload = jwt.verify(jwtToken, process.env.JWT_SECRET);
        req.user = payload;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ error: error.message || 'Unauthorized' });
    }
}

module.exports = { isAuthorized };