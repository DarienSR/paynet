var express = require("express"),
//Merges params between models
router      = express.Router({mergeParams: true}),
User        = require("../models/user");
Transaction = require('../models/transaction');


// INDEX ROUTE

router.get("/account", function(req, res){
    User.findById(req.user._id).populate('transactionHistory').exec(function(err, user){
        if(err){
            console.log(err);
        } else {
            var balance = user.balance;
            var userTransaction = user.transactionHistory;
            res.render("account", {userTransaction: userTransaction, balance: balance});
        }
    });      
}); 

module.exports = router;


