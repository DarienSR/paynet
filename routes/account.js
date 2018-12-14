var express = require("express");

//Merges params between models
router      = express.Router({mergeParams: true});
User        = require("../models/user");
Transaction = require('../models/transaction');


// INDEX ROUTE

router.get("/account", isLoggedIn, function(req, res){
    User.findById(req.user._id).populate('transactionHistory').populate('convertHistory').exec(function(err, user){
        if(err){
            console.log(err);
        } else {
            var user = user
            User.find({}, function(err, allUsers){
                res.render("account", {user: user, allUsers: allUsers}); 
            }); 
        }
    });     
}); 

// Update users account if transfer occurs




function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};
module.exports = router;


