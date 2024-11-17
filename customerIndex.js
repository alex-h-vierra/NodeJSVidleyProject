const express = require('express');
const app = express();
const joi = require('joi');
const mongoose = require('mongoose');
const customer = require('./routes/customerAPI');

app.use(express.json());
app.use('/api/customer', customer);

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});





