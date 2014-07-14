angular.module('teacher.controllers', []).
  controller('Teacher', ['$scope', '$http', '$location', '$sce', function($scope, $http, $location, $sce) {
    $scope.form = {
      time: null,
      email: "",
      available: []
    };

    $scope.weekdates = ['Time', '7.14', '7.15', '7.16', '7.17', '7.18', '7.19', '7.20']; // move to service
    $scope.day = [9,10,11,12,13,14,15,16,17,18,19,20,21];
    $scope.daycount = [0,1,2,3,4,5,6]; // len
    $scope.dataset = {
      bytime: [],
      byteacher: []
    };

    $scope.submitCal = function() {
      if($scope.form.email) {
        console.log('form', $scope.form);
        $http.post('/schedule/submit', $scope.form).success(function(response) {
          // $location.path('/');

          // $scope.submitted = true;
          console.log('submitCal success', response);
        });
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
      console.log("sorting!");
      console.log(day);
    };

    var init = function() {
      $http.get('/schedule/bytime/show').success(function(dataByTime, status, headers, config) {
        $http.get('/schedule/byteacher/show').success(function(dataByTeacher, status, headers, config) {
          $scope.dataset.bytime = dataByTime;
          $scope.dataset.byteacher = dataByTeacher;
          console.log('dataset', $scope.dataset);
        });
      });
    };

    init(); // run on page init
}]);


angular.module('student.controllers', []).
  controller('Student', ['$scope', '$http', '$location', '$sce', function($scope, $http, $location, $sce) {

    $scope.form = {
      time: null,
      email: "",
      available: []
    };

    $scope.weekdates = ['Time', '7.14', '7.15', '7.16', '7.17', '7.18', '7.19', '7.20'];
    $scope.day = [9,10,11,12,13,14,15,16,17,18,19,20,21];
    $scope.daycount = [0,1,2,3,4,5,6]; // len




}]);
