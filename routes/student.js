var express = require('express');
var router = express.Router();
var models = require('../models');

var Q = require('q'),
    async = require('async'),
    moment = require('moment');


/* GET student listing. */
router.get('/', function(req, res) {
  res.render('student');
});

router.post('/submit', function(req, res) {
  console.log('email', req.body.studentEmail);
  models.Student.findOneAndUpdate({email: req.body.studentEmail}, {}, {upsert:true}, function(err, student) {
    if(err) { console.log(err); }

    var requestedLessons = req.body.lessons; // array of selected timeslot objectes

    var confirmedTimes = [];
    console.log('input request', requestedLessons);
    async.each(requestedLessons, function(timeslot, cb) {
      console.log('requested timeslot', timeslot);
      student.scheduled.push(timeslot._id);

      models.Timeslot.find({ date: timeslot.date, start: timeslot.start, end: timeslot.end, open: true }, function(err, availableArr) {
        if(availableArr.length === 0) {
          res.send(200, 'no available timeslot');
        } else {
          console.log('results from search', availableArr);
          var foundTime = availableArr[0];
          // edit timeslot object
          foundTime.open = false;
          foundTime.requestedBy.push(student);
          foundTime.reservedFor = student;
          foundTime.save(function(err) {
          // return foundTime; // need to return promise
          confirmedTimes.push(foundTime);
          console.log('edited foundTime = confirmedTimes');

          // edit student object
          student.confirmed.push(foundTime);
          console.log('student while running search', student);
          student.save(function(err) {
            cb(null);
          });
        });
        }
      });
    }, function(err) {
      if(err) { console.log(err); }
      console.log('array of confirmedTimes', confirmedTimes);
      // res.json(confirmedTimes);
      res.send(200);
    });
  });
});

module.exports = router;
