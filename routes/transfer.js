var express = require("express");

//Merges params between models
router      = express.Router({mergeParams: true});
User        = require("../models/user");
Transaction = require('../models/transaction');
Convert     = require('../models/convert');

router.post('/account/convert', isLoggedIn, function(req, res){
    // Pull form information from account page and store in variables.
    var firstCurrency = req.body.firstCurrency
    var secondCurrency = req.body.secondCurrency
    var initialAmount = req.body.amountFirstTransfer
    var endAmount = req.body.amountSecondTransfer
    var date = req.body.date



    // Check if user has enough currency to cover exchange
    if(firstCurrency === 'CAD' && req.user.balanceCAD < initialAmount || firstCurrency === 'USD' && req.user.balanceUSD < initialAmount) {
        req.flash('error', 'Not enough ' + firstCurrency + ' to cover exchange.')
        res.redirect('/account')
    } else {
    // Store variables into an object
        var convertObject = {
            initialCurrency: firstCurrency,
            endCurrency: secondCurrency,
            initialAmount: initialAmount,
            endAmount: endAmount,
            date: date
        }

        User.findById(req.user._id, function(err, user){
            if(err){
                console.log(err)
            } else {
                // Create a exchange transaction and add it to convertHistory
                Convert.create(convertObject, function(err, convert){
                    if(err){
                        console.log(err);
                    } else {
                        // Save to user's convert history, adding and subtracting from accounts.
                        user.convertHistory.push(convert);
                        if (convert.initialCurrency === 'CAD') {
                            user.balanceCAD -= convert.initialAmount;
                            user.balanceUSD += convert.endAmount;
                        } 
                        if (convert.initialCurrency === 'USD'){
                            user.balanceUSD -= convert.initialAmount
                            user.balanceCAD += convert.endAmount
                        }
                        user.save();
                    }
                });
            }
        });
    }
    req.flash('success', 'Exchanged Completed')
    res.redirect('/account')
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

module.exports = router;