const mongoose = require('mongoose');

const id = new mongoose.Types.ObjectId();
console.log(`Object id: ${id}`);
console.log(`\nObject Time Stamp: ${id.getTimestamp()}`);

const isValid = mongoose.Types.ObjectId.isValid('1234');
console.log(`\nValidate ObjectId: ${isValid}`);