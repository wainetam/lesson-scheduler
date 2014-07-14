angular.module('app.filters', [])
  .filter('dayMatchFilter', function() {
    return function(timeslotObj) {
      var dayString = $scope.dayToSortBy;

      var month = dayString.split('.')[0];
      var day = dayString.split('.')[1];

      var sortDate = moment.utc(new Date(2014, month - 1 , day)).toISOString();
      console.log('sortDate after moment', sortDate);

      timeslotObj.forEach(function(dateObj) {
        var d = dateObj.date;
        if(JSON.stringify(d) == JSON.stringify(sortDate)) {
          return true;
        } else {
          return false;
        }
      });
    };
  });

// $scope.dayFilter = function(timeslotObj) {
//       console.log('tsObj', timeslotObj);
//       var dayString = $scope.dayToSortBy;
//       if(dayString !== null) {
//         var month = dayString.split('.')[0];
//         var day = dayString.split('.')[1];

//         var sortDate = moment.utc(new Date(2014, month - 1 , day)).toISOString();
//         console.log('sortDate after moment', sortDate);

//         timeslotObj.forEach(function(dateObj) {
//           var d = dateObj.date;
//           if(JSON.stringify(d) == JSON.stringify(sortDate)) {
//             console.log('TRUE');
//             return true;
//           } else {
//             console.log('F');
//             return false;
//           }
//         });
//       }
//     };

    // $scope.matchSortDay = function(obj) {
    //   console.log('input obj', obj);
    //   console.log('id', obj.id);
    //   if(obj.id === $scope.filterDay) {
    //     console.log(true);
    //     return true;
    //   } else {
    //     return false;
    //   }
    // };


    // $scope.filterDates = function(day) {
    //   console.log('day', day);
    //   console.log('filtering');
    //   $scope.filterDay = day || null;
    //   $scope.dataset.byteacher.forEach(function(teacher) {
    //     // teacher.timeslotObj.forEach(function(timeslot) {
    //       // console.log('teacher.timeslotObj.timeslottime', teacher.timeslotObj.time);
    //       // console.log('convertSortDatetoIsoDate()', convertSortDatetoIsoDate());
    //     // });
    //     if(teacher.timeslotObj) {
    //       for(var i = 0; i < teacher.timeslotObj.length; i++) {
    //         if(teacher.timeslotObj[i].date) {
    //           console.log(JSON.stringify(teacher.timeslotObj[i].date),'JSON.stringify(teacher.timeslotObj[i].date)');
    //           console.log(convertSortDatetoIsoDate(), 'convertSortDatetoIsoDate()');
    //           if(JSON.stringify(teacher.timeslotObj[i].date) == convertSortDatetoIsoDate()) {
    //             console.log('MATCH');
    //             console.log('teacher.timeslotObj before', teacher.timeslotObj[i]);
    //             teacher.timeslotObj.splice(i, 1);
    //             console.log('teacher.timeslotObj after', teacher.timeslotObj[i]);
    //           } else {
    //             console.log('FAIL');
    //             console.log('teacher.timeslotObj after', teacher.timeslotObj[i]);
    //           }
    //         }
    //       }
    //     }
    //   });
    // };
