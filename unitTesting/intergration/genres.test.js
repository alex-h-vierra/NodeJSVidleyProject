const request = require('supertest');
const {Genre} = require('../../models/genres');
const {User} = require('../../models/registerModel');
const mongoose = require('mongoose');
let server;

describe('/api/genres', () => {
    beforeEach(() => {
        server = require('../../index');
    });
    afterEach(async () => {
        await server.close();
        await Genre.deleteMany({});
    });
    describe('GET /', () => {
        it('should return all genres', async() => {
            await Genre.collection.insertMany([
                {name: 'genre1'},
                {name: 'genre2'}
            ]);
            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
         });
    });
    describe('GET /:id', () => {
        it('should return genres given the ID is valid', async () => {
            const genre = await new Genre({name: 'genre1'});
            await genre.save();
            const res = await request(server).get('/api/genres/' + genre._id);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });
        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server).get('/api/genres/' + 1);
            expect(res.status).toBe(404);
        });
        it('should return 404 if no genre with the given id exists', async () => {
            const id = new mongoose.Types.ObjectId();
            const res = await request(server).get('/api/genres/' + id);
            expect(res.status).toBe(404);
        });
    });

    describe('Post /', () => {
        //Define the happy path. and then in each test.. we change
        //one parameter that clearly aligns with the name of the test
        //Define happy path
        let name;
        let token;
        const exec = async () => {
            return await request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({
                name
            });
        }
        
        beforeEach(() => {
            token = new User().generateAuthToken();
            name = 'genre1';
        }); 
        it('should return 401 if client is not logged in', async () => {
            token = '';
            const res = await exec();
            expect(res.status).toBe(401);
        });
        it('should return 400 if genre is less than 5 character', async () => {
            name = '1234';
            const res = await exec();
            expect(res.status).toBe(400);
        });
        it('should return 400 if genre is more than 50 character', async () => {
            name = new Array(52).join('a');
            const res = await exec();
            expect(res.status).toBe(400);
        });
        it('should save the genre if it is valid', async () => {                
            const genre = await Genre.find({name: 'genre1'});
            expect(genre).not.toBeNull();
        });
        it('should save the genre if it is valid ', async () => {
            await exec()
            const genre = await Genre.find({name: 'genre1'});
            expect(genre).not.toBeNull();
            });
        it('should save the genre if it is valid', async () => {                
            const res = await exec();
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');
            });
    });
});