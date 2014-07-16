var express = require('express');
var router = express.Router();
var models = require('../models');

var Q = require('q'),
    async = require('async'),
    moment = require('moment');

var lessonDuration = 1; // in hours;

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

var incrementBy30Min = function(start) {  // assumes INCREMENT IS 30min
  var str = start.toString();
  var numArr = str.split('');

  if(numArr.length === 3) {
    numArr.unshift('0');
  }

  var minutes = numArr.slice(2).join('');
  var hours = numArr.slice(0,2).join('');

  var updatedMinutes;
  var updatedHours;

  if(minutes === '30') {
    updatedMinutes = '00';
    updatedHours = (parseInt(hours, 10) + 1).toString();
  } else {
    updatedMinutes = '30';
    updatedHours = hours.toString();
  }
  if(updatedHours[0] === 0) {
      updatedHours = updatedHours.splice(1);
  }
  return updatedHours + updatedMinutes;
};


router.post('/submit', function(req, res) {
  models.Teacher.findOneAndUpdate({email: req.body.email}, {}, {upsert:true}, function(err, teacher) {
    if(err) { console.log(err); }

    // first clean out existing teacher slots to then refresh
    models.Timeslot.remove({teacher: teacher.id}, function(err, timeslots) {
      if(err) { console.log(err); }

      var availableTimes = req.body.available;

      teacher.timeslots = [];

      if(availableTimes.length === 0) {
        teacher.save(function(err, teacher) {
          console.log('teacher in ts create', teacher);
          res.send(200, 'found teacher');
        });
      }

      console.log('availTimes.length', availableTimes.length);

      async.each(availableTimes, function(timeDayVal, cb) {
        var timeDayArr = timeDayVal.split(' '); // '9 7.14' --> ['9', '7.14']
        var start = parseInt(timeDayArr[0], 10);
        var end = start + lessonDuration; // assumes that length is ONE HOUR
        // var date = {
        //   month: timeDayArr[1].split('.')[0],
        //   day: timeDayArr[1].split('.')[1] // date[0] is month; date[1] is day
        // };
        var date = timeDayArr[1];

        console.log(date);

        models.Timeslot.create({
          start: start,
          end: end,
          date: date,
          // date: moment(new Date(2014, date.month - 1 , date.day)), // months are zero indexed with moment
          teacher: teacher.id
        }, function(err, timeslot) {
          teacher.timeslots.push(timeslot._id);
            cb(null);
        });
      }, function(err) {
        if(err) { console.log(err); }
        teacher.save(function(err, teacher) {
          res.send(200, 'found teacher');
        });
      });
    });
  });
});

router.get('/bytime/show', function(req, res) { // by timeslots
  models.Timeslot.find({}, function(err, timeslots) {
    if(err) { console.log(err); }

    async.mapSeries(timeslots, function(t, cb) {
      cb(err, new Timeslot(t.date, t.start, t.end, t.teacher, t.reservedFor, t.requestedBy));
    }, function(err, timeslotArr) {
      async.eachSeries(timeslotArr, function(t, cb) { // populate timeslots with teacherObjs
        models.Teacher.findById(t.teacher, function(err, teacher) {
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

    async.mapSeries(teachers, function(t, cb1) {
      cb1(err, new Teacher(t.email, t.timeslots));
    }, function(err, teacherArr) {
      async.eachSeries(teacherArr, function(tInstance, cbx) { // populate timeslots with teacherObjs
        async.each(tInstance.timeslots, function(timeslotId, cb3) {
          models.Timeslot.find({ _id: timeslotId }, function(err, tObj) {
            tInstance.timeslotObj.push(tObj[0]);
            cb3(null);
          });
        }, function(err) {
          if(err) { console.log(err); }
          cbx(null);
        });
      }, function(err) {
        if(err) { console.log(err); }
        // console.log('pre send JSON of teacherArr', teacherArr);
        res.json(teacherArr);
      });
    });
  });
});

router.get('/bystudent/show', function(req, res) { // by teachers
  models.Student.findOne({email: req.query.email}).populate('confirmed scheduled').exec(function(err, student) {
    console.log('studentPopulated', student);
    var teacherEmailArr = [];
    async.eachSeries(student.confirmed, function(timeslot, cb) {
      models.Timeslot.findById(timeslot._id).populate({path:'teacher'}).exec(function(err, timeslot) {
        console.log('timeslot', timeslot);
        teacherEmailArr.push(timeslot.teacher.email);
        cb(null);
      });
    }, function(err) {
      if(err) {console.log(err);}
      console.log('emailArr', teacherEmailArr);
      res.json({student: student, teachers: teacherEmailArr});
    });
  });
});

module.exports = router;
