var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/teacher', function(req, res) {
  res.render('teacher');
});

router.get('/teacher/partials/:name', function(req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
});

router.get('/student', function(req, res) {
  res.render('student');
});

router.get('/student/partials/:name', function(req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
});


module.exports = router;
