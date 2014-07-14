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
