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

// var findAvailTime = function(request) { // add as function to Timeslot Obj
//   models.Timeslot.find({ date: request.date, start: request.start, end: request.end, open: true }, function(err, availableArr) {
//     if(availableArr.length === 0) {
//       res.send(200, {});
//     } else {
//       var foundTime = availableArr[0];
//         time.open = false;
//         time.requestedBy = student;
//         time.reservedFor = student;
//         time.save(function(err) {
//           return foundTime; // need to return promise
//         });
//     }
//   });
// };

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


// models.Teacher.findOneAndUpdate({email: req.body.email}, {}, {upsert:true}, function(err, teacher) {
//     if(err) { console.log(err); }

//     // first clean out existing teacher slots to then refresh
//     models.Timeslot.remove({teacher: teacher.id}, function(err, timeslots) {
//       if(err) { console.log(err); }

//       var availableTimes = req.body.available;

//       teacher.timeslots = [];

//       if(availableTimes.length === 0) {
//         teacher.save(function(err, teacher) {
//           console.log('teacher in ts create', teacher);
//           res.send(200, 'found teacher');
//         });
//       }

//       console.log('availTimes.length', availableTimes.length);

//       async.each(availableTimes, function(timeDayVal, cb) {
//         var timeDayArr = timeDayVal.split(' '); // '9 7.14' --> ['9', '7.14']
//         var start = parseInt(timeDayArr[0], 10);
//         var end = start + lessonDuration; // assumes that length is ONE HOUR
//         // var date = {
//         //   month: timeDayArr[1].split('.')[0],
//         //   day: timeDayArr[1].split('.')[1] // date[0] is month; date[1] is day
//         // };
//         var date = timeDayArr[1];

//         console.log(date);

//         models.Timeslot.create({
//           start: start,
//           end: end,
//           date: date,
//           // date: moment(new Date(2014, date.month - 1 , date.day)), // months are zero indexed with moment
//           teacher: teacher.id
//         }, function(err, timeslot) {
//           teacher.timeslots.push(timeslot._id);
//             cb(null);
//         });
//       }, function(err) {
//         if(err) { console.log(err); }
//         teacher.save(function(err, teacher) {
//           res.send(200, 'found teacher');
//         });
//       });
//     });
//   });
