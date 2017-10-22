app.directive('gametext', function(){
    return {
      restrict: 'EA',
      templateUrl: 'app/templates/textbox.tpl.html',
      scope: {
        vocabulary: '=',
        matchfunc:'='
      },
      controller: function($scope){
        $scope.testfunc = function(event,$UVoc){
          if (event.which === 13){
            // console.log($UVoc + " == " + $scope.vocabulary + " ? ");
            if($UVoc === $scope.vocabulary.vocabulary){
              $scope.matchfunc($UVoc);
              $scope.UVoc = "";
            }else{
              // console.log("mismatch");
            }
          }
        }
        $scope.loop = function($start,$end){
          r = [];
          for(var $i = $start ; $i< $end ; $i++){
            r.push($i);
          }
          return r;
        }
      }
    };
  });

