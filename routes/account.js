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


router.delete('/account/transaction/:id', isLoggedIn, function(req, res){
    Transaction.findByIdAndRemove(req.params.id, function(err){
        if(err) {
            console.log(err)
        } else {
            req.flash('success', 'Your transaction entry has been deleted.')
            res.redirect('/account')
        }
    });
});

router.delete('/account/convert/:id', isLoggedIn, function(req, res){
    Convert.findByIdAndRemove(req.params.id, function(err){
        if(err) {
            console.log(err)
        } else {
            req.flash('success', 'Your exchange entry has been deleted.')
            res.redirect('/account')
        }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};
module.exports = router;


