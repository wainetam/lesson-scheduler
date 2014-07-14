var express = require('express');
var router = express.Router();
var models = require('../models');

var Q = require('q'),
    async = require('async'),
    moment = require('moment');

var Timeslot = function(date, start, end, teacher, reservedFor, requestedBy) {
  this.date = date;
  this.start = start;
  this.end = end;
  this.teacher = teacher;
  this.teacherObj = {};
  this.reservedFor = reservedFor;
  this.requestedBy = requestedBy;
};

var Teacher = function(email, timeslots) {
  this.email = email;
  this.timeslots = timeslots;
  this.timeslotObj = [];
};

router.post('/submit', function(req, res) {
  models.Teacher.findOneAndUpdate({email: req.body.email}, {}, {upsert:true}, function(err, teacher) {
    if(err) { console.log(err); }

    // first clean out existing teacher slots to then refresh
    models.Timeslot.remove({teacher: teacher.id}, function(err, timeslots) {
      if(err) { console.log(err); }
      // console.log('slots to delete', timeslots);

      var availableTimes = req.body.available;

      // async.eachSeries(availableTimes, function(timeDayVal, cb) {
      //   var timeDayArr = timeDayVal.split(' '); // '9 7.14' --> ['9', '7.14']
      //   var start = parseInt(timeDayArr[0], 10);
      //   var end = start + 1; // assumes that length is ONE HOUR
      //   var date = {
      //     month: timeDayArr[1].split('.')[0],
      //     day: timeDayArr[1].split('.')[1] // date[0] is month; date[1] is day
      //   };
      //   cb(null);
      // }, function(err) {
      //   if(err) { console.log(err); }
      //   models.Timeslot.create({
      //     start: start,
      //     end: end,
      //     date: moment(new Date(2014, date.month - 1 , date.day)), // months are zero indexed with moment
      //     teacher: teacher.id
      //   }, function(err, timeslot) {
      //     // console.log('timeslot in create', timeslot);
      //     console.log('teacher before push', teacher);
      //     teacher.timeslots = [];
      //     teacher.timeslots.push(timeslot._id);
      //     teacher.save(function(err, teacher) {
      //       console.log('teacher in ts create', teacher);
      //       res.send(200, 'found teacher');
      //     });
      //   });
      // });

      teacher.timeslots = [];

      if(availableTimes.length === 0) {
        // teacher.timeslots = [];
        teacher.save(function(err, teacher) {
          console.log('teacher in ts create', teacher);
          res.send(200, 'found teacher');
        });
      }

      console.log('availTimes.length', availableTimes.length);

      async.each(availableTimes, function(timeDayVal, cb) {
        var timeDayArr = timeDayVal.split(' '); // '9 7.14' --> ['9', '7.14']
        var start = parseInt(timeDayArr[0], 10);
        var end = start + 1; // assumes that length is ONE HOUR
        var date = {
          month: timeDayArr[1].split('.')[0],
          day: timeDayArr[1].split('.')[1] // date[0] is month; date[1] is day
        };
        console.log(date);

        models.Timeslot.create({
          start: start,
          end: end,
          date: moment(new Date(2014, date.month - 1 , date.day)), // months are zero indexed with moment
          teacher: teacher.id
        }, function(err, timeslot) {
          // console.log('timeslot in create', timeslot);
          // console.log('teacher before push', teacher);
          teacher.timeslots.push(timeslot._id);
          // teacher.save(function(err, teacher) {
            // console.log('teacher in ts create', teacher);
            cb(null);
          // });
        });
      }, function(err) {
        if(err) { console.log(err); }
        teacher.save(function(err, teacher) {
          res.send(200, 'found teacher');
        });
      });
        // .forEach(function(timeDayVal) {
      // });
    });
    // teacher.timeslots = null;
    // teacher.save();

  });
});

router.get('/bytime/show', function(req, res) { // by timeslots
  models.Timeslot.find({}, function(err, timeslots) {
    if(err) { console.log(err); }

    async.mapSeries(timeslots, function(t, cb) {
      cb(err, new Timeslot(t.date, t.start, t.end, t.teacher, t.reservedFor, t.requestedBy));
    }, function(err, timeslotArr) {
      async.eachSeries(timeslotArr, function(t, cb) { // populate timeslots with teacherObjs
        // console.log('t', t);
        models.Teacher.findById(t.teacher, function(err, teacher) {
          // console.log('teacher', teacher);
          t.teacherObj = teacher;
          cb(null);
        });
      }, function(err) {
        if(err) { console.log(err); }
        res.json(timeslotArr);
      });
    });
  });
});

router.get('/byteacher/show', function(req, res) { // by teachers
  models.Teacher.find({}, function(err, teachers) {
    if(err) { console.log(err); }
    console.log('byteacher', teachers);

    async.mapSeries(teachers, function(t, cb1) {
      cb1(err, new Teacher(t.email, t.timeslots));
    }, function(err, teacherArr) {
      async.eachSeries(teacherArr, function(tInstance, cb2) { // populate timeslots with teacherObjs
        async.eachSeries(tInstance.timeslots, function(timeslotId, cb3) {
          // console.log('id?', timeslotId);
          models.Timeslot.find({ _id: timeslotId }, function(err, tObj) {
          // console.log('t.timeslotObj', tInstance.timeslotObj);
          // console.log('tObj?', tObj[0]);
          // console.log('tInstance', tInstance);
          tInstance.timeslotObj.push(tObj[0]);
          // console.log('post push of TimeslotObj?', tInstance.timeslotObj);
          // console.log('post push of teacherArr', teacherArr);
          cb3(null);
        }, function(err) {
          if(err) { console.log(err); }
          cb2(null);
          // console.log('post push of TimeslotObj?', tInstance.timeslotObj);
          });
        }, function(err) {
          if(err) { console.log(err); }
          // console.log('pre send JSON of teacherArr', teacherArr);
          res.json(teacherArr);
        });
      });
    });
  });
});

module.exports = router;


  // models.User.findOne({fbId: req.user.fbId }, function(err, user) {
  //   if(err) { console.log(err); }
  //   console.log('Confirmed user', user);
  //   console.log('Confirmed amazon email', req.body.email);
  //   user.customerEmail = req.body.email;
  //   user.submittedEmail = true;
  //   user.save(function() {
  //     var data = {
  //       user: user
  //     };
  //     mailer.composeMail(user.email, mailtemplates.emailConfirm, data, function(mailOptions) {
  //       mailer.sendMail(mailOptions);
  //       res.send(200);
  //     });
  //   });
  // });
