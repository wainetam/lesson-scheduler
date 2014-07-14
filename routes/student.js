var express = require('express');
var router = express.Router();

/* GET student listing. */
router.get('/', function(req, res) {
  res.render('student');
});


module.exports = router;
