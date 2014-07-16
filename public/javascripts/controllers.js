angular.module('teacher.controllers', []).
  controller('Teacher', ['$scope', '$http', '$location', '$filter', '$timeout', function($scope, $http, $location, $filter, $timeout) {
    $scope.form = {
      time: null,
      email: "",
      available: []
    };

    var weekdatesGenerator = function(monthNow, dayNow, numberOfDays) {
      var weekdatesArr = ['Time']; // 'Time' is top-left header in table
      var futureDay;
      for(var i = 1; i <= numberOfDays; i++) {
        futureDay = moment.utc(new Date(2014, monthNow - 1 , dayNow+i)).toISOString();
        weekdatesArr.push(futureDay);
      }
      // var sortDate = moment.utc(new Date(2014, monthNow - 1 , dayNow)).toISOString();
      // console.log('sortDate after moment', sortDate);
      console.log('weekdates', weekdatesArr);
      return weekdatesArr;
    };

    $scope.weekdates = weekdatesGenerator(7,15,7);

    // $scope.weekdates = ['Time', '7.15', '7.16', '7.17', '7.18', '7.19', '7.20', '7.21']; // move to service
    $scope.day = [9,10,11,12,13,14,15,16,17,18,19,20,21]; // times
    $scope.daycount = [0,1,2,3,4,5,6]; // length
    $scope.dataset = {
      bytime: [],
      byteacher: [],
      bystudent: []
    };

    $scope.filterDay = '';
    $scope.banner = null;
    // $scope.testDate = '2014-07-19T04:00:00.000Z';

    $scope.submitCal = function() {
      $scope.banner = null;
      if($scope.form.email) {
        console.log('form', $scope.form);
        $http.post('/schedule/submit', $scope.form).success(function(response) {
          console.log('submitCal success', response);
          $scope.form.email = '';
          $scope.banner = "Your available times have been registered";
        });
      } else {
        $scope.banner = "Please submit email";
      }
    };

    $scope.toggleSchedule = function(timeslot) {
      console.log('val of td', timeslot);
      console.log('clicked!');
      if($scope.form.available.indexOf(timeslot) === -1) {
        $scope.form.available.push(timeslot);
      } else {
        var idx = $scope.form.available.indexOf(timeslot);
        $scope.form.available.splice(idx, 1);
      }
      console.log($scope.form.available);
    };

    $scope.sortByDay = function(day) {
      console.log('this.day', day);
      $scope.filterDay = day;
      // $scope.filterDay = convertSortDateToIsoDate(day) || '';
      console.log("sorting!");
      console.log('$filterDay for sorting', $scope.filterDay);
    };

    $scope.regexFilter = function (dateStr) {
      var reg = RegExp($scope.filterDay);
      return reg.test(dateStr);
    };

    $scope.noTimeslots = function(teacherObj) {
      var noSlots = false;

      if(teacherObj.timeslots.length === 0) {
        noSlots = true;
      } else {
        return noSlots;
      }

      teacherObj.timeslots.forEach(function(timeslot) {
        console.log('noTimeslot', timeslot);
        if(timeslot.open) {
          noSlots = false;
        }
      });
      return noSlots;
      // return teacherObj.timeslots.length === 0;
    };

    var init = function() {
      // $http.get('/schedule/bytime/show').success(function(dataByTime, status, headers, config) {
        $http.get('/schedule/byteacher/show').success(function(dataByTeacher, status, headers, config) {
          // $scope.dataset.bytime = dataByTime;
          $scope.dataset.byteacher = dataByTeacher;
          console.log('dataset', $scope.dataset);
        });
      // });
    };

    init(); // run on page init
}]);


angular.module('student.controllers', []).
  controller('Student', ['$scope', '$http', '$location', '$timeout', '$filter', '$rootScope', function($scope, $http, $location, $timeout, $filter, $rootScope) {

    // $scope.dataset.bystudent; // inherit dataset scope obj from parent teacher ctrl

    // $scope.studentData = { // in lieu of inheriting dataset object
    //   registered: null
    // };

    $scope.banner = null;

    $scope.isSelected = false;
    $scope.displayResults = false;

    $scope.form = {
      lessons: [],
      studentEmail: '' // defined in html via ng-model
    };

    $scope.toggleSelect = function(timeslot) { // should refactor along with similar function in Teacher Controller
      if($scope.form.lessons.indexOf(timeslot) === -1) {
        $scope.form.lessons.push(timeslot);
      } else {
        var idx = $scope.form.lessons.indexOf(timeslot);
        $scope.form.lessons.splice(idx, 1);
      }
      console.log('array', $scope.form.lessons);
    };

    var requestedTimes = function() {
      // if($location.path() == '/requests') { // should convert to RESTful service
        $http.get('/schedule/bystudent/show', {params: { email: $scope.form.studentEmail }}).success(function(dataByStudent, status, headers, config) {
          console.log('config', config);
          console.log('registered classes', dataByStudent);
          $scope.dataset.bystudent = dataByStudent; // inherit dataset scope obj from parent teacher ctrl
        });
    };
    $scope.submit = function() {
      $scope.banner = null;
      $http.post('/student/submit', $scope.form).success(function(response) {
        console.log($scope.form);
        if($scope.form.studentEmail) {
          $scope.banner = "Your requested times are below:";
          console.log('submitted', response);
          $scope.displayResults = true;
          $timeout(function() {
            requestedTimes();
          }, 100);
        } else {
          $scope.banner = "Please submit your email";
        }
      });
    };

}]);
