var mongoose          = require('mongoose'),
passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    //  NOTE: Add total Balance and option for different currencies later. When creating an account set balance to 0
    balanceCAD: Number,
    balanceUSD: Number,
    transactionHistory: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction"           
        }
    ]
});

// Adds methods which can be used with UserSchema
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);