var express = require("express"),
//Merges params between models
router      = express.Router({mergeParams: true}),
User        = require("../models/user");
Transaction = require('../models/transaction');


// NEW ROUTE 
router.get("/account/transaction", function(req, res){
    res.render("transaction");
});

router.post('/account', function(req, res){
    var getAmount = req.body.amount;  
    var getCurrency = req.body.currency;
    var getTo = req.body.to;
    var getFrom = req.body.from;
    var getDate = req.body.date;
    var getFullDate = req.body.fullDate
    var getNotes = req.body.notes;

    // if user is sending money to himself, cancel payment and redirect to account page
    if(getTo == req.user._id) {
        res.redirect('/account')   
    } else {
        // another if statement to see if user has enough cash to cover.
        if(req.user.balance < getAmount) {
            // CHANGE TO ERROR FLASH
            console.log('You do not have enough to cover this transaction.')
            res.redirect('/account')   
        } else {
            // Proceed with the transaction. Storing the pulled form information into an object
            var transactionObject = {
                amount: getAmount,
                currency: getCurrency,
                to: getTo,
                from: getFrom,
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
                            user.balance -= addTransaction.amount;
                            user.save();
                        }
                     });
                }
            });
        
            // Send payment to receiver and store in their transaction history
            User.findById(getTo, function(err, toUser){
                if(err){
                    console.log(err)
                } else {
                    Transaction.create(transactionObject, function(err, sendPayment){
                        if(err){
                            console.log(err)
                        } else {
                            toUser.transactionHistory.push(sendPayment);
                            toUser.balance += sendPayment.amount;
                            toUser.save();
                        }
                    });
                }
            });
        }     
        res.redirect('/account')   
    }
});
module.exports = router;
