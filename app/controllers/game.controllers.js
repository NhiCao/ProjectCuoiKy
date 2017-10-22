
app.controller('gameControllers', function ($scope,socket) {
	var vocList = new Array();
	$scope.Vocabulary = new Array();
	$scope.userName = "this";
	$scope.userList = [];
	$scope.serverMsg = [];
	$scope.rankList = [];

	socket.emit("ready");
	$scope.Playing = false;
	document.getElementById('scoreScreen').style.display ="none";
	document.getElementById('gameplaying').style.display ="none";

	$scope.match = function($voc){
		// console.log($voc + " Match");
		socket.emit('match', $voc);
	}

	socket.on('start', function() {
  		$scope.$apply(function() {
  			document.getElementById('gameScreen').disabled = false;
		    $scope.Playing = true;
		    document.getElementById('gameplaying').style.display ="inline";
  			document.getElementById('scoreScreen').style.display ="none";
  			$scope.rankList = [];
	    });
  	});

  	socket.on("stop",function(){
  		$scope.$apply(function() {
  			document.getElementById('gameScreen').disabled = true;
		    $scope.Playing = false;
		    console.log("stop");
	    });
  	});

  	socket.on("rankList",function(rankList){
  		$scope.$apply(function() {
  			console.log("ranklist called");
	  		console.log(rankList);
	  		$scope.rankList = rankList;
	  		document.getElementById('gameplaying').style.display ="none";
	  		document.getElementById('scoreScreen').style.display ="inline";
	    });
  		
  		
  	});

	socket.on('setUserName', function(user) {
  		$scope.$apply(function() {
		    $scope.userName = user;
	    });
  	});

  	socket.on('setUserList', function(userlist) {
  		$scope.$apply(function() {
		    $scope.userList = userlist;
		    
	    });
  	});

  	socket.on('msg', function(msg) {
  		$scope.$apply(function() {
		    $scope.serverMsg.unshift(msg);
			if($scope.serverMsg.length > 10){
				$scope.serverMsg.pop();
			}
	    });
  	});
	

	//Ham gan Vocabulary list
  	socket.on('setVocList', function(list) {
  		$scope.$apply(function() {
		     $scope.Vocabulary = list;
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