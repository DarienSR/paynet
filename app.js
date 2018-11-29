var express    = require('express'),
app            = express(),
methodOverride = require('method-override'),
bodyParser     = require('body-parser'),
flash          = require("connect-flash"),
mongoose       = require('mongoose'),
passport       = require('passport'),
LocalStrategy  = require('passport-local'),
User           = require('./models/user');
Transaction    = require('./models/transaction');

// Requiring Routes
authRoute    = require('./routes/authentication');
accountRoute = require('./routes/account');
paymentRoute = require('./routes/payment');

// mongoose.connect('mongodb://localhost:27017/paynet', { useNewUrlParser: true});
mongoose.connect("mongodb://Darien:transaction_01@ds241493.mlab.com:41493/paynet", { useNewUrlParser: true });
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(flash());

// Configuration of Passport
app.use(require('express-session')({
   secret: 'transaction of monetary value',
   resave: false,
   saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.get('/', function(req, res){
    res.redirect('/account');
});

app.use(authRoute);
app.use(accountRoute);
app.use(paymentRoute)

app.get('*', function(req,res){
    res.redirect('/');
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log('Listening on Localhost');
});