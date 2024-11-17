const {genreSchema} = require('../models/genres');
const Joi = require('joi');
const mongoose = require('mongoose');

const Movie = mongoose.model ('Movie', new mongoose.Schema ({
    title: {
        type:String,
        required: true,
    },
    genres: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true
    },
    dailyRentalRate: {
        type:Number,
        required: true,
        min: 0,
        max: 255
    }
}));

exports.Movie = Movie;
