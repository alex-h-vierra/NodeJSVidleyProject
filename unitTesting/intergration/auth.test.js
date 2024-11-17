
const request = require('supertest');
const {User} = require('../../models/registerModel');
const {Genre} = require('../../models/genres');
let server;
describe('auth middleware', () => {
    let token;
    beforeEach(() => {
        server = require('../../index');
        token = new User().generateAuthToken();
    });
    afterEach(async () => {
        await server.close();
        await Genre.deleteMany({});
    });
    const exec = () => {
        return request(server).post('/api/genres')
        .set('x-auth-token', token)
        .send({
            name:'genre1'
        });
    }

    it('should return a 401 if no token is provided', async () => {
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
    });
    it('should return a 400 if token is INVALID', async () => {
        token = '123';
        const res = await exec();
        expect(res.status).toBe(400);
    });
    it('should return 200 if token is valid', async () => {
        const res = await exec();
        expect(res.status).toBe(200);
    });
})