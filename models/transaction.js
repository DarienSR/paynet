
var mongoose = require('mongoose');

var TransactionSchema = new mongoose.Schema({
    to: String,
    toUsername: String,
    from: String,
    fromUsername: String,
    amount: Number,
    currency: String,
    date: String,
    fullDate: String,
    notes: String
});

// Adds methods which can be used with UserSchema

module.exports = mongoose.model('Transaction', TransactionSchema);
