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
    var getReceiver = req.body.receiver;
    var getSender = req.body.sender;
    var getDate = req.body.date;
    var getNotes = req.body.notes;

    // if user is sending money to himself, cancel payment and redirect to account page
    if(getReceiver == req.user._id) {
        res.redirect('/account')
    } else {
        // another if statement to see if user has enough cash to cover. ADD THIS FEATURE
        var transactionObject = {
            amount: getAmount,
            currency: getCurrency,
            receiver: getReceiver,
            sender: getSender,
            date: getDate,
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
                        console.log(user.balance)
                    }
                 });
            }
        });
    
        // Send payment to receiver
        User.findById(getReceiver, function(err, receiverUser){
            if(err){
                console.log(err)
            } else {
                Transaction.create(transactionObject, function(err, sendPayment){
                    if(err){
                        console.log(err)
                    } else {
                        receiverUser.transactionHistory.push(sendPayment);
                        receiverUser.balance += sendPayment.amount;
                        receiverUser.save();
                    }
                });
            }
        });
        res.redirect('/account')        
    }
});
module.exports = router;
