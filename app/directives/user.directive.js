app.directive('userdir', function(){
    return {
      restrict: 'EA',
      templateUrl: 'app/templates/user.tpl.html',
      scope: {
        user: '=',
        matchfunc:'='
      },
      controller: function($scope){
        $scope.testfunc = function($UVoc){
          console.log($UVoc + " == " + $scope.vocabulary + " ? ");
          if($UVoc === $scope.vocabulary.vocabulary){
            $scope.matchfunc($UVoc);
            $scope.UVoc = "";
          }else{
            console.log("mismatch");
          }
        }
      }
    };
  });

