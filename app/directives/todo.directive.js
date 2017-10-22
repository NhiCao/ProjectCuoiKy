app.directive('myTodo', function(){
    return {
      restrict: 'EA',
      templateUrl: 'app/directives/todo.tpl.html',
      scope: {
        list: '=',
        title: '@'
      },
      controller: function($scope){
        $scope.test = function($newtodo){
          //$scope.list.push({name: $newtodo, completed: false});
          //console.log($scope.todo);
        }
      }
    };
  });

