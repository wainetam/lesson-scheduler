var express = require('express');
var router = express.Router();
var models = require('../models');

var Q = require('q'),
    async = require('async'),
    moment = require('moment');

router.post('/submit', function(req, res) {
  models.Teacher.findOneAndUpdate({email: req.body.email}, {}, {upsert:true}, function(err, teacher) {
    if(err) { console.log(err); }

    models.Timeslot.remove({teacher: teacher.id}, function(err, timeslots) {
      if(err) { console.log(err); }
      // console.log('slots to delete', timeslots);

      var availableTimes = req.body.available;
      availableTimes.forEach(function(timeslot) {
        // console.log('timeslot data', timeslot);
        var timeDayArr = timeslot.split(' '); // '9 7.14' --> ['9', '7.14']
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
        });
      });

      console.log('found teacher');
      res.send(200, 'found teacher');
    });
    // teacher.timeslots = null;
    // teacher.save();

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
