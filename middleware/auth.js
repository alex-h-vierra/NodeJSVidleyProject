const jsonToken = require('jsonwebtoken');
const config = require('config');
let logger = require('../startups/logging');

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');
    if(!token) {
        return logger.error(res.status(401).send('Access denied. No token provided.'));
    }
    try {
        const decoded = jsonToken.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).send('Invalid token...');
        logger.error(ex.message);
    }
}