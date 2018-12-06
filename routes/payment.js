var express = require("express"),
//Merges params between models
router      = express.Router({mergeParams: true}),
User        = require("../models/user");
Transaction = require('../models/transaction');

router.get("/account/transaction", isLoggedIn, function(req, res){
    User.findById(req.user._id).populate('transactionHistory').exec(function(err, user){
        if(err){
            console.log(err);
        } else {
            var user = user
            console.log(user)
            User.find({}, function(err, allUsers){
                console.log(user)
                var allUsers = allUsers
                console.log(allUsers)
                res.render("transaction", {user: user, allUsers: allUsers}); 
            }); 
        }
    });     
}); 


router.get("/account/transaction", isLoggedIn, function(req, res){
    User.find({}, function(err, allUsers){
        res.render("transaction", {allUsers: allUsers});
    });
});


// NEW ROUTE 
router.post('/account', function(req, res){
    // Request user inputs
    var getAmount   = req.body.amount,  
    getCurrency     = req.body.currency,
    // Gets two values and splits them into an array
    pullGetTo       =  req.body.to.split(','),
    // Storing each index into its own variable
    getTo           = pullGetTo[0],
    getToUsername   = pullGetTo[1],
    getFrom         = req.body.from,
    getFromUsername = req.body.fromUsername,
    getDate         = req.body.date,
    getFullDate     = req.body.fullDate,
    getNotes        = req.body.notes;

    // if user is sending money to himself, cancel payment and redirect to account page and display an error
    if(getTo == req.user._id) {
        req.flash('error', 'User ID belongs to current account.')
        res.redirect('/account/transaction')   
    } else {
        // see if user has enough cash to cover, if not redirect to the transaction page and display an error.
        if(req.user.balanceCAD < getAmount || req.user.balanceUSD < getAmount){
            req.flash('error', 'You do not have enough to cover this transaction ('+getCurrency+')');
            res.redirect('/account/transaction');
        } else {
            // Proceed with the transaction. Storing the pulled form information into an object
            var transactionObject = {
                amount: getAmount,
                currency: getCurrency,
                to: getTo,
                toUsername: getToUsername,
                from: getFrom,
                fromUsername: getFromUsername,
                date: getDate,
                fullDate: getFullDate,
                notes: getNotes
            }

            User.findById(req.user._id, function(err, user){
                if(err){
                    console.log(err)
                } else {
                    Transaction.create(transactionObject, function(err, addTransaction){
                        if(err){
                            console.log(err);
                        } else {
                            // Save to user's transaction history
                            user.transactionHistory.push(addTransaction);
                            if(addTransaction.currency === 'CAD'){
                                user.balanceCAD -= addTransaction.amount;
                            } else {
                                user.balanceUSD -= addTransaction.amount;
                            }
                            user.save();
                        }
                     });
                }
            });
        
            // Send payment to receiver and store in their transaction history
            User.findById(getTo || username, function(err, toUser){
                if(err){
                    console.log(err)
                } else {
                    Transaction.create(transactionObject, function(err, sendPayment){
                        if(err){
                            console.log(err)
                        } else {
                            toUser.transactionHistory.push(sendPayment);
                            if(sendPayment.currency === 'CAD'){
                                toUser.balanceCAD += sendPayment.amount;
                            } else {
                                toUser.balanceUSD += sendPayment.amount;
                            }
                            toUser.save();
                        }
                    });
                }
            });
        }     
        req.flash('success', 'Payment has been sent!')
        res.redirect('/account')   
    }
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};
module.exports = router;
