
const {User} = require('../models/registerModel');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

describe('AuthToken', () => {
    it('should return a valid Jwt', () => {
        const payload = {
            _id: new mongoose.Types.ObjectId().toHexString(),
             isAdmin: true
        }
        let user = new User(payload);
        const token = user.generateAuthToken();
        const decoded = jwt.verify(token,config.get('jwtPrivateKey'));
        expect(decoded).toMatchObject(payload);
    });
});