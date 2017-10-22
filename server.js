var express = require('express'),
    app = express();
var http = require( "http" ).createServer( app );
var io = require( "socket.io" )( http );

app.use(express.static(__dirname + ''));


var playerSockets = [];				//mảng chứa socket của những người chơi trong phong
var userList = [];					//mảng chứa thông tin của user trong phòng
var rankList = [];					//mảng chứa vị thứ của user
var MaxNumberOfClient = 2;			//số người chơi tối đa
var DefaultTime = 30;


var playing = 0;					//1 khi đang chơi, 0 khi dừng chơi

var Vocabulary = getVoc();			//1 mảng chứa các đối tượng là từ vựng, 1 object gồm có từ vừng, từ đã xáo trộn và gợi ý
var gameTimer;						//biến timer của game
var numOfPlayer = 0;				//số người chơi

//hàm sinh ra từ vựng mới khi từ vựng đã hết
function getVoc(){
	var hint = ["Từ này là : tuco","Từ này là : tucothien","Từ này là : caohainhi","Từ này là : dangquocsinh","Từ này là : sinhabc"];
	var vocabulary = ["tuco","tucothien","caohainhi","dangquocsinh","sinhabc"];

	var vList = [];
	for(var i =0 ; i<vocabulary.length ; i++){
		var shuffled = vocabulary[i];
		while (shuffled === vocabulary[i]){
			shuffled = vocabulary[i].split('').sort(function(){return 0.5-Math.random()}).join('');
		}
		vList.push({
			vocabulary : vocabulary[i],
			shuffledVoc : shuffled,
			hint : hint[i]
		});
	}
	return vList;
}


// ham remove phan tu trong mang vocabulary
// input : tu vung
function removeVoc(VocList,voc){
	var index = 0;
	while(index <VocList.length && VocList[index].vocabulary != voc) index++;
	if(index < VocList.length){
		VocList.splice(index,1);
	}	
}

// app.listen(8088)


io.on('connection', function(clientsocket){
	clientsocket.on('setUserName',function(userName){
		if(playing == 0 && playerSockets.length < MaxNumberOfClient){
			console.log("setUserNAme " + userName);
			//them client vao danh sach nguoi choi
			var index = 0;
			while(index < userList.length && userName!==userList[index].userName) index++;
			if(index >= userList.length){
				playerSockets.push(clientsocket);
				userList.push({
					userName : userName,
					time : DefaultTime,
				});
				rankList.push[-1];
				clientsocket.emit("userNameOK");
				io.emit("msg",userName + " has joined, " + playerSockets.length  + " players in room");
			}else{
				clientsocket.emit("msg","UserName has been used!!!");
			}
		}else{
			clientsocket.emit("msg","The room is full, please wait!!!");
		}
	});

	clientsocket.on('match', function(voc){
		removeVoc(Vocabulary,voc);
		if(Vocabulary.length==0){
			Vocabulary = getVoc();
		}
		io.emit("setVocList",Vocabulary);
		

		var index = playerSockets.indexOf(clientsocket);
		console.log(index + "  match")
		if(index >-1 && index < playerSockets.length){
			userList[index].time += voc.length;
			for(var j = 0; j<playerSockets.length;j++){
				playerSockets[j].emit("setUserList",userList);
			}
		}
	});
	clientsocket.on('ready',function(){
		var index = playerSockets.indexOf(clientsocket);
		if(index > -1 && index < userList.length){
			clientsocket.emit("setUserName",userList[index].userName);	
			if(playing==0 && playerSockets.length == MaxNumberOfClient){
				io.emit("msg","start game");
				for(var i = 0; i<playerSockets.length;i++){
					socket = playerSockets[i];


					socket.emit("setUserList",userList);
					socket.emit("setVocList",Vocabulary);
					
					socket.emit("start");
					console.log("Start game");
				}
				
				var index = 0;
				numOfPlayer = MaxNumberOfClient;
				gameTimer = setInterval(function(){
					for(var i = 0 ; i<userList.length ; i++){
						if(userList[i].time>0){
							userList[i].time--;
						}else if(userList[i].time == 0){
							userList[i].time= -1;
							playerSockets[i].emit("stop");
							console.log(i + " __stop");
							rankList[i] = numOfPlayer;
							numOfPlayer--;
							if(numOfPlayer==0 && playing == 1){
								console.log("stop game");
								
								io.emit("msg","stop game");

								for(var ii = 0;ii<playerSockets.length ; ii++){
									var rankL = [];
									for(var k = 0;k<userList.length;k++){
										rankL.push({
											userName : userList[k].userName,
											rank : rankList[k]
										});
									}
									rankL.sort(function(a,b){
										return a.rank - b.rank;
									});
									playerSockets[ii].emit("rankList",rankL);
								}

								playing = 0;
								playerSockets = [];
								userList = [];
								rankList = [];
								Vocabulary = getVoc();
								clearInterval(gameTimer);
							}
						}
					}
					for(var i = 0; i<playerSockets.length;i++){
						var socket = playerSockets[i];
						socket.emit("setUserList",userList);
					}
					// console.log(index++);
				}, 1000);	
				playing = 1;
			
			}else{
			}
		}
	});
});
// io.on('connection', function(clientsocket){
// 	console.log("User connected");
// 	if(clientSockets.length < MaxNumberOfClient){
// 		clientSockets.push(clientsocket);
// 		if(clientSockets.length == MaxNumberOfClient){
// 			for(var i = 0; i<clientSockets.length;i++){
// 				socket = clientSockets[i];

// 				socket.emit("setVocList",Vocabulary);
// 				socket.emit("displayVocList");
// 				socket.emit("msg","start game");

// 				socket.on('match', function(user){
// 					io.emit('removeVoc', user);
// 					removeVoc(Vocabulary,user);
// 				});
// 			}
// 		}else{
// 			clientsocket.emit("msg","waiting");
// 		}

// 		clientsocket.on('Disconnect',function(){
// 			console.log("disconected");
// 		});
// 	}else{
// 		clientsocket.emit("msg","full roi");
// 	}

	
	
 // });

http.listen(8088, "127.0.0.1");
