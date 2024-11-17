const {Movie} = require('../../models/MovieMondels');
const {Rental} = require('../../models/rentals');
const mongoose = require('mongoose');
const request = require('supertest');
const {User} = require('../../models/registerModel');
const moment = require('moment');

describe('/api/returns', () => {
    let server = undefined; 
    let customerId = undefined;
    let movieId = undefined;
    let rental = {};
    let token = undefined;
    let movie;
    beforeEach(async() => {
        server = require('../../index');
        customerId = new mongoose.Types.ObjectId();
        movieId = new mongoose.Types.ObjectId();
        token = new User().generateAuthToken();
        movie = new Movie ({
            _id: movieId,
            title: '12345',
            dailyRentalRate: 2,
            genres: {
                id: '123123',
                name: '1231123'
            },
            numberInStock: 10
        });
        rental = new Rental ({
            customer: {
                _id: customerId,
                name:'12345',
                phone: '12345'
            },
            movie: {
                _id: movieId,
                title: '12345',
                dailyRentalRate: 2
            }
        });
        await rental.save();
        await movie.save();
    });
    afterEach(async () => {
        await server.close();
        Rental.deleteMany({});
        Movie.deleteMany({});
    });
    const exec = async () => {
        return await request(server).post('/api/returns')
        .set('x-auth-token', token)
        .send({
            customerId,
            movieId
        });
    }
    it('Return 401 if client is not logged in', async () => {
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
    });
    it('Return 400 if clients customerId is not provided', async () => {
        customerId = '';
        const res = await exec();
        expect(res.status).toBe(400);
    });
    it('Return 400 if clients movieId is not provided', async () => {
        movieId = '';
        const res = await exec();
        expect(res.status).toBe(400);
    });
    it('Return 404 if clients MovieId and CustomerId found no rental', async () =>{
        await Rental.deleteMany({});
        const res = await exec();
        expect(res.status).toBe(404);
    });
    it('Return 400 if rental date is already set', async () => {
        rental.dateReturned = new Date();
        await rental.save();
        const res = await exec();
        expect(res.status).toBe(400);
    });
    it('Return 200 if a valid request is accepted', async () => {
        res = await exec();
        expect(res.status).toBe(200);
    });
    it('Should set a ReturnDate if input is valid', async ()=> {
        const res = await exec();
        const rentalInDb = await Rental.findById(rental._id);
        const difference = new Date() - rentalInDb.dateReturned;
        expect(difference).toBeLessThan(10 * 1000);
    });
    it('Should calculate the rental fee (numberOfDays * dailyRentalRate', async () => {
        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save();
    
        const res = await exec();

        const rentalInDb = await Rental.findById(rental._id);
        expect(rentalInDb.rentalFee).toBe(14);
    });
    it('Should increase number in stock if input value is good', async () => {
        const res = await exec();
        const movieInDb = await Movie.findById(movieId);
        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
    })
    it('Should return the rental if the input is valid', async () => { 
        const res = await exec();
        const rentalInDb = await Rental.findById(rental._id);

        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining(
                ['dateOut', 'dateReturned', 'rentalFee', 'customer', 'movie']
            ));
    });
});