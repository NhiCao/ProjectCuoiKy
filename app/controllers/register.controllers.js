app.controller('registerControllers', function ($scope,socket) {
	$scope.serverMsg = [];
	$scope.serverMsg.push("welcome")
	$scope.register = function(ID){
		socket.emit("setUserName",ID);
	}
	socket.on("msg",function(msg){
		$scope.$apply(function() {
			$scope.serverMsg.unshift(msg);
			if($scope.serverMsg.length > 10){
				$scope.serverMsg.pop();
			}
	    });
	});
	socket.on('userNameOK', function() {
  		$scope.$apply(function() {
		    window.location = "/#/game";
	    });
  	});
  	$scope.loop = function($start,$end){
		r = [];
		for(var $i = $start ; $i< $end ; $i++){
			r.push($i);
		}
		return r;
	}
});