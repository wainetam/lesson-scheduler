var express = require('express');
var router = express.Router();
var models = require('../models');

var Q = require('q'),
    async = require('async'),
    moment = require('moment');

/* GET teacher listing. */
router.get('/', function(req, res) {
  res.render('teacher');
});

module.exports = router;
