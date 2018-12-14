
var mongoose = require('mongoose');

var convertSchema = new mongoose.Schema({
    initialCurrency: String,
    endCurrency: String,
    initialAmount: Number,
    endAmount: Number,
    date: String
});

// Adds methods which can be used with UserSchema

module.exports = mongoose.model('Convert', convertSchema);
