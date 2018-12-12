var express = require("express");

//Merges params between models
router      = express.Router({mergeParams: true});
User        = require("../models/user");
Transaction = require('../models/transaction');

module.exports = router;