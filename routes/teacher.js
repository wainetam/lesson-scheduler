var express = require('express');
var router = express.Router();

/* GET teacher listing. */
router.get('/', function(req, res) {
  res.render('teacher');
});

module.exports = router;
