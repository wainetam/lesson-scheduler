var app = {};

// TEACHER SPA
app.teacher = angular.module('teacher',
  ['teacher.controllers',
  // 'teacher.services',
  // 'teacher.filters',
  'ngRoute',
  'ngResource'
  ]);

app.teacher.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'partials/schedule.html',
      controller: 'Teacher'
    })
    // .when('/test', {
    //   templateUrl: 'partials/stud.html',
    //   controller: 'Teacher'
    // })
    .otherwise({
      redirectTo: '/'
    });
}]);

// STUDENT SPA
app.student = angular.module('student',
  ['student.controllers',
  // 'student.services',
  // 'student.filters',
  'ngRoute',
  'ngResource'
  ]);

app.student.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'partials/search.html',
      controller: 'Student'
    })
    // .when('/dashboard', {
    //   templateUrl: 'partials/dash.html',
    //   controller: 'DashCtrl'
    // })
    .otherwise({
      redirectTo: '/'
    });
}]);
