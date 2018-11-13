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
            var balanceCAD = user.balanceCAD;
            var balanceUSD = user.balanceUSD;
            var userTransaction = user.transactionHistory;
            User.find({}, function(err, allUsers){
                res.render("account", {allUsers: allUsers, userTransaction: userTransaction, balanceCAD: balanceCAD, balanceUSD: balanceUSD}); 
            }); 
        }
    });     
}); 

module.exports = router;


