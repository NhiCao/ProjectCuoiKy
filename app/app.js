var app = angular.module('customersApp', ['ngRoute']);

//This configures the routes and associates each route with a view and a controller
app.config(function ($routeProvider) {
    $routeProvider
        .when('/game',
            {
                controller: 'gameControllers',
                templateUrl: '/app/views/game.html'
            })
        .when('/register',
            {
                controller: 'registerControllers',
                templateUrl: '/app/views/register.html'
            })
        //Define a route that has a route parameter in it (:customerID)
        .otherwise({ redirectTo: '/register' });
});

app.factory('socket', ['$rootScope', function($rootScope) {
  var socket = io.connect();

  return {
    on: function(eventName, callback){
      socket.on(eventName, callback);
    },
    emit: function(eventName, data) {
      socket.emit(eventName, data);
    }
  };
}]);