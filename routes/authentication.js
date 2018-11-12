var express = require("express"),
router      = express.Router(),
passport    = require("passport"),
User        = require("../models/user");


// Show register form
router.get("/register", function(req, res){
    res.render("register");
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username, balance: 1000});

    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.redirect('/register');
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/account"); 
        });
    });
});

// Show login form
router.get("/login", function(req, res){
   res.render("login"); 
});

//Handle login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/account",
        failureRedirect: "/login"
    }), function(req, res){
});

// Logout route logic
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

module.exports = router;