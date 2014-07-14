var app = {};

// TEACHER SPA
app.teacher = angular.module('app.teacher',
  ['teacher.controllers',
  'app.filters',
  // 'teacher.services',
  'ngRoute',
  'ngResource'
  ]);

app.teacher.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'partials/schedule.html',
      controller: 'Teacher'
    })
    .otherwise({
      redirectTo: '/'
    });
}]);

// STUDENT SPA
app.student = angular.module('app.student',
  ['student.controllers',
  'teacher.controllers',
  'app.filters',
  // 'student.services',
  'ngRoute',
  'ngResource'
  ]);

app.student.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'partials/search.html',
      controller: 'Teacher'
    })
    .otherwise({
      redirectTo: '/'
    });
}]);
