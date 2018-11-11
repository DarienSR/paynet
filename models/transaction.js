
var mongoose = require('mongoose');

var TransactionSchema = new mongoose.Schema({
    receiver: String,
    sender: String,
    amount: Number,
    currency: String,
    date: String,
    notes: String
});

// Adds methods which can be used with UserSchema

module.exports = mongoose.model('Transaction', TransactionSchema);
