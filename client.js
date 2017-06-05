//var tournamentID=142857;
var tournamentID=12;
var user_name='estabilidad';
var movimiento=0; 
var myID;
var playerTurnID;
var otherID;
//192.168.1.112
var socket = require('socket.io-client')('http://localhost:3000');
var tablero;
var last=1000; 
var resul_mov=[];
var pesos=[
[ 4,-3, 2, 2, 2, 2,-3, 4],
[-3,-4,-1,-1,-1,-1,-4,-3],
[ 2,-1, 1, 0, 0, 1,-1, 2],
[ 2,-1, 0, 1, 1, 0,-1, 2],
[ 2,-1, 0, 1, 1, 0,-1, 2],
[ 2,-1, 1, 0, 0, 1,-1, 2],
[-3,-4,-1,-1,-1,-1,-4,-3],
[ 4,-3, 2, 2, 2, 2,-3, 4]];

socket.on('connect', function(){
  socket.emit('signin', {
    user_name: user_name,
    tournament_id: tournamentID,
    user_role: 'player'
  });
});

socket.on('ok_signin', function(){
  console.log("Successfully signed in!");
});


socket.on('ready', function(data){
  tablero =[];
  var gameID = data.game_id;
  playerTurnID = data.player_turn_id;
  myID=data.player_turn_id;
  otherID=inverse(myID);
  var board = data.board;
  var aux=[];
  //convertir el tablero 
  for(var i=0;i<board.length;i++){
  	if(i%8==0&&i!=0){
    	tablero.push(aux);
        aux=[];
    }
    aux.push(board[i]);
    if(i==board.length-1){
    	tablero.push(aux);
    }
  }
 
  var movimiento=alfaBeta(tablero,-100000,100000);
  
  socket.emit('play', {
    tournament_id: tournamentID,
    player_turn_id: playerTurnID,
    game_id: gameID,
    movement: movimiento
  });
});

socket.on('finish', function(data){
  var gameID = data.game_id;
  var playerTurnID = data.player_turn_id;
  var winnerTurnID = data.winner_turn_id;
  var board = data.board;

  
  // TODO: Your cleaning board logic here
   console.log("A la guerra!");
  socket.emit('player_ready', {
    tournament_id: tournamentID,
    player_turn_id: playerTurnID,
    game_id: gameID
  });
});

function getMoves(estado,id){
	var movs=[];
	resul_mov=[];
	movs=movs.concat(horizontal1(estado,id));
	movs=movs.concat(horizontal2(estado,id));
	movs=movs.concat(diagonal1(estado,id));
	movs=movs.concat(diagonal2(estado,id));
	movs=movs.concat(diagonal3(estado,id));
	movs=movs.concat(diagonal4(estado,id));
 	//console.log(movs);
 	//console.log(resul_mov); 
	return movs; 
}
function inverse(id){
	if(id==1){
		return 2;
	}else{
		return 1; 
	}
}

function horizontal1(tablero, id) {
	var movs=[];
	var fichasV=[];
	var fichasV1=[];
	//console.log(tablero.length);
	for(var i=0; i<tablero.length;i++){
		var myF=0; 
		var otF=0; 
		var myF1=0; 
		var otF1=0; 
		for(var j=0;j<tablero.length;j++){
			//console.log(tablero[i][j]);
			//horizontal
			if(myF){
				if(tablero[j][i]==inverse(id)){
					otF=1;
					fichasV.push((j*8)+i);
					//console.log("ficha contraria ");
				}else{
					myF=0; 
				}
			}
			if(tablero[j][i]==id){
				//console.log('ficha mia encontrada');
				fichasV=[];
				myF=1; 
			} 
		 	if(otF){
				if(tablero[j][i]==0){
					otF=0; 
					if(fichasV.length>0){
						movs.push((j*8)+i);
						resul_mov.push([(j*8)+i,fichasV]);
					}
					
				}	
			}
				//vertical
			if(myF1){
				if(tablero[i][j]==inverse(id)){
					otF1=1; 
					fichasV1.push((i*8)+j);
					//console.log("ficha contraria1");
				}else{
					myF1=0; 
				}
			}
			if(tablero[i][j]==id){
				//console.log('ficha mia encontrada1');
				fichasV1=[];
				myF1=1; 
			} 
		 	if(otF1){
				if(tablero[i][j]==0){
					otF1=0; 
					//console.log('exito1')
					if(fichasV1.length>0){
						movs.push((i*8)+j);
						resul_mov.push([(i*8)+j,fichasV1]);
					}
				}	
			}
		}
    }
    return movs; 
}
function horizontal2(tablero, id){
	var movs=[];
	var fichasV=[];
	var fichasV1=[];
	for(var i=0; i<tablero.length;i++){
		var myF=0; 
		var otF=0; 
		var myF1=0; 
		var otF1=0; 
		for(var j=tablero.length-1;j>=0;j--){
			//console.log(tablero[i][j]);
			//horizontal
			if(myF){
				if(tablero[j][i]==inverse(id)){
					otF=1; 
					fichasV.push((j*8)+i);
					//console.log("ficha contraria ");
				}else{
					myF=0; 
				}
			}
			if(tablero[j][i]==id){
				//console.log('ficha mia encontrada');
				myF=1; 
				fichasV=[];
			} 
		 	if(otF){
				if(tablero[j][i]==0){
					otF=0; 
					if(fichasV.length>0){
						movs.push((j*8)+i);
						resul_mov.push([(j*8)+i,fichasV]);
					}
				}	
			}
				//vertical
			if(myF1){
				if(tablero[i][j]==inverse(id)){
					otF1=1; 
					fichasV1.push((i*8)+j);
					//console.log("ficha contraria1");
				}else{
					myF1=0; 
				}
			}
			if(tablero[i][j]==id){
				//console.log('ficha mia encontrada1');
				myF1=1; 
				fichasV1=[];
			} 
		 	if(otF1){
				if(tablero[i][j]==0){
					otF1=0; 
					//console.log('exito1')
					if(fichasV1.length>0){
						movs.push((i*8)+j);
						resul_mov.push([(i*8)+j,fichasV1]);
					}
				}	
			}
		}
	}
    return movs; 
}
function diagonal1(tablero, id){
	var movs=[];
	var fichasV=[];
	var fichasV1=[];
	for(var i=0; i<8;i++){
		var myF=0; 
		var otF=0;
		var myF1=0; 
		var otF1=0; 
		for(var j=0;j<8;j++){
			if(j+i<8){
				if(myF){
					if(tablero[j][j+i]==inverse(id)){
						otF=1;
						fichasV.push((j*8)+j+i); 
						//console.log("ficha contraria1");
					}else{
						myF=0; 
					}
				}
				if(tablero[j][j+i]==id){
					//console.log('ficha mia encontrada1');
					myF=1; 
					fichasV=[];
				} 
			 	if(otF){
					if(tablero[j][j+i]==0){
						otF=0; 
						//console.log('exito1')
						if(fichasV.length>0 && movs.indexOf((j*8)+j+i)==-1){
							movs.push((j*8)+j+i);
							resul_mov.push([(j*8)+j+i,fichasV]);
						}
					}	
				}
				//---------------------------------------------
				if(myF1){
					if(tablero[j+i][j]==inverse(id)){
						otF1=1; 
						fichasV1.push(((j+i)*8)+j);
						//console.log("ficha contraria1");
					}else{
						myF1=0; 
					}
				}
				if(tablero[j+i][j]==id){
					//console.log('ficha mia encontrada1');
					myF1=1; 
					fichasV1=[];
				} 
			 	if(otF1){
					if(tablero[j+i][j]==0){
						otF1=0; 
						//console.log('exito1')
						if(fichasV1.length>0 && movs.indexOf(((j+i)*8)+j)==-1){
							movs.push(((j+i)*8)+j);
							resul_mov.push([((j+i)*8)+j,fichasV1]);
						}
					}	
				}
			}
		}
    }
    return movs;    
}
function diagonal2(tablero, id){
	var movs=[];
	var fichasV=[];
	var fichasV1=[];
	for(var i=tablero.length-1; i>=0;i--){
		var myF=0; 
		var otF=0;
		var myF1=0; 
		var otF1=0;  
		var cost=7-i; 
		for(var j=tablero.length-1;j>=0;j--){
			if(cost<8){
				//console.log(j, cost);
				//console.log(tablero[j][i-j]);
				if(myF){
					if(tablero[j][cost]==inverse(id)){
						otF=1; 
						fichasV.push((j*8)+cost);
						//console.log("ficha contraria1");
					}else{
						myF=0; 
					}
				}
				if(tablero[j][cost]==id){
					//console.log('ficha mia encontrada1');
					myF=1; 
					fichasV=[];
				} 
			 	if(otF){
					if(tablero[j][cost]==0){
						otF=0; 
						//console.log('exito1')
						if(fichasV.length>0 && movs.indexOf((j*8)+cost)==-1){
							movs.push((j*8)+cost);
							resul_mov.push([(j*8)+cost,fichasV]);
						}
					}	
				}
					//-----------------------------------------------
				//console.log(7-cost,7-j);
				if(myF1){
					if(tablero[7-cost][7-j]==inverse(id)){
						otF1=1; 
						fichasV1.push(((7-cost)*8)+7-j);
						////console.log("ficha contraria1");
					}else{
						myF1=0; 
					}
				}
				if(tablero[7-cost][7-j]==id){
					////console.log('ficha mia encontrada1');
					myF1=1; 
					fichasV1=[];
				} 
			 	if(otF1){
					if(tablero[7-cost][7-j]==0){
						otF1=0; 
						//console.log('exito1')
						if(fichasV1.length>0 && movs.indexOf(((7-cost)*8)+7-j)==-1){
							movs.push(((7-cost)*8)+7-j);
							resul_mov.push([((7-cost)*8)+7-j,fichasV1]);
						}
					}	
				}
			}
			cost++;
		}
    }
    return movs; 
}
function diagonal3(tablero, id){
	var movs=[];
	var fichasV=[];
	var fichasV1=[];
	for(var i=tablero.length-1; i>=0;i--){
		var myF=0; 
		var otF=0;
		var myF1=0; 
		var otF1=0; 
		for(var j=0;j<tablero.length;j++){
			//console.log(j, i-j);
			//console.log(tablero[j][i-j]);
			if(i-j>=0){
				if(myF){
					if(tablero[j][i-j]==inverse(id)){
						otF=1; 
						fichasV.push((j*8)+i-j);
						//console.log("ficha contraria1");
					}else{
						myF=0; 
					}
				}
				if(tablero[j][i-j]==id){
					//console.log('ficha mia encontrada1');
					myF=1;
					fichasV=[]; 
				} 
			 	if(otF){
					if(tablero[j][i-j]==0){
						otF=0; 
						//console.log('exito1');
						if(fichasV.length>0 && movs.indexOf((j*8)+i-j)==-1){
							movs.push((j*8)+i-j);
							resul_mov.push([(j*8)+i-j,fichasV]);
						}
					}	
				}
				//----------------------------------------------------------------------
				//console.log(7-(i-j),7-j);
				if(myF1){
					if(tablero[7-(i-j)][7-j]==inverse(id)){
						otF1=1; 
						fichasV1.push(((7-(i-j))*8)+ 7-j);
						//console.log("ficha contraria1");
					}else{
						myF1=0; 
					}
				}
				if(tablero[7-(i-j)][7-j]==id){
					//console.log('ficha mia encontrada1');
					myF1=1; 
					fichasV1=[];
				} 
			 	if(otF1){
					if(tablero[7-(i-j)][7-j]==0){
						otF1=0; 
						//console.log('exito1');
						if(fichasV1.length>0 && movs.indexOf(((7-(i-j))*8)+ 7-j)==-1){
							movs.push(((7-(i-j))*8)+ 7-j);
							resul_mov.push([((7-(i-j))*8)+ 7-j,fichasV1]);
						}
					}	
				}
			}
		}
    }
    return movs;   
}
function diagonal4(tablero, id){
	var movs=[];
	var fichasV=[];
	var fichasV1=[];
	for(var i=0; i<tablero.length;i++){
		var myF=0; 
		var otF=0;
		var myF1=0; 
		var otF1=0;  
		for(var j=tablero.length-1;j>=0;j--){
			if(j-i>=0){
				//console.log(j, j-i);
				if(myF){
					if(tablero[j][j-i]==inverse(id)){
						otF=1; 
						fichasV.push((j*8)+j+i);
						//console.log("ficha contraria1");
					}else{
						myF=0; 
					}
				}
				if(tablero[j][j-i]==id){
					//console.log('ficha mia encontrada1');
					myF=1; 
					fichasV=[];
				} 
			 	if(otF){
					if(tablero[j][j-i]==0){
						otF=0; 
						//console.log('exito1')
						if(fichasV.length>0 && movs.indexOf((j*8)+j+i)==-1){
							movs.push((j*8)+j+i);
							resul_mov.push([(j*8)+j+i,fichasV]);
						}
					}	
				}

				//----------------------------------------------------------------------
				if(myF1){
					if(tablero[j-i][j]==inverse(id)){
						otF1=1;
						fichasV1.push(((j-i)*8)+j);
						//console.log("ficha contraria1");
					}else{
						myF1=0; 
					}
				}
				if(tablero[j-i][j]==id){
					//console.log('ficha mia encontrada1');
					myF1=1;
					fichasV1=[];
				} 
			 	if(otF1){
					if(tablero[j-i][j]==0){
						otF1=0; 
						//console.log('exito1')
						if(fichasV1.length>0 && movs.indexOf(((j-i)*8)+j)==-1){
							movs.push(((j-i)*8)+j);
							resul_mov.push([((j-i)*8)+j,fichasV1]);
						}

					}	
				}
			}
		}
    }
    return movs;  
}

function evaluation(estado){
	//Heuristica
	return coinParity(estado) +mobility(estado)+corners(estado)+stability(estado);

}
function coinParity(estado){
	var myCoins=0; 
	var otherCoins=0; 
	for(var i=0; i<estado.length;i++){
		for(var j=0;j<estado.length;j++){
			if(estado[i][j]!=0){
				if(estado[i][j]==myID){
					myCoins++;
				}else{
					otherCoins++;
				}
			}
		}
	}
	return 100.0*(myCoins-otherCoins)/(myCoins + otherCoins);
}
function mobility(estado){
	//My moves
	var Mmovs=getMoves(estado,myID);
	//Other
	var Omovs=getMoves(estado,otherID);
	if(Mmovs.length + Omovs.length!=0){
		return 100.0* (Mmovs.length- Omovs.length)/(Mmovs.length + Omovs.length);
	}else{
		return 0;
	}
}
function corners(estado){
	var Mcornes=0; 
	var Ocornes=0; 
	if(estado[0][0]==myID){
		Mcornes++;
	}
	if(estado[7][0]==myID){
		Mcornes++;
	}
	if(estado[7][7]==myID){
		Mcornes++;
	}
	if(estado[0][7]==myID){
		Mcornes++;
	}
	if(estado[0][0]==otherID){
		Ocornes++;
	}
	if(estado[7][0]==otherID){
		Ocornes++;
	}
	if(estado[7][7]==otherID){
		Ocornes++;
	}
	if(estado[0][7]==otherID){
		Ocornes++;
	}
	if(Mcornes+Ocornes!=0){
		return 100.0*(Mcornes - Ocornes)/(Mcornes+Ocornes);
	}else{
		return 0; 
	}
}
function stability(estado){
	var Msta=0; 
	var Osta=0; 
	for(var i=0; i<estado.length;i++){
		for(var j=0;j<estado.length;j++){
			if(estado[i][j]==myID){
				Msta=Msta+pesos[i][j];				
			}
			if(estado[i][j]==otherID){
				Osta=Osta+pesos[i][j];
			}
		}
	}
	return 100.0*(Msta-Osta)/(Msta + Osta);
}
function apliMove(mov,estado,playerID){
	//movimiento cambia el estado
	var fichasCambiar=[];
	estado[Math.floor(mov/8)][mov%8]=playerID;
	for(var i=0;i<resul_mov.length;i++){
		if(resul_mov[i][0]==mov){
			fichasCambiar=fichasCambiar.concat(resul_mov[i][1]);
		}
	}
	for(var i=0; i<fichasCambiar.length;i++){
		estado[Math.floor(fichasCambiar[i]/8)][fichasCambiar[i]%8]=playerID;
	}
	return estado;

}

function alfaBeta(estado,alpha,betha){
	var val=valorMax(estado,0,alpha,betha)[0];
	//console.log(val);
	return val;
}

function valorMax(estado,depth,alpha,betha){
	//console.log("calculando")
	if(depth==9){
		return evaluation(estado);
	}
	var mayor_val=-10000; 
	var mejor_accion; 
	var resultado; 
	var utilidad; 
	var movimientos=getMoves(estado,myID);
	for(var i=0;i<movimientos.length;i++){
		resultado=apliMove(movimientos[i],estado,myID);
		utilidad=valorMin(resultado,depth+1,alpha,betha)[1];
		if(utilidad>mayor_val){
			mayor_val=utilidad;
			mejor_accion=movimientos[i];
		}
		if(mayor_val>=betha){
			return [mejor_accion, mayor_val];
		}
		if(mayor_val> alpha){
			alpha=mayor_val;
		}
	}
	return [mejor_accion, mayor_val];
}

function valorMin(estado,depth,alpha,betha){
	if(depth==9){
		return evaluation(estado);
	}
	var menor_val=10000; 
	var mejor_accion; 
	var resultado; 
	var utilidad; 
	var movimientos=getMoves(estado,otherID);
	for(var i=0;i<movimientos.length;i++){
		resultado=apliMove(movimientos[i],estado,otherID);
		utilidad=valorMax(resultado,depth+1,alpha,betha)[1];
		if(utilidad<menor_val){
			menor_val=utilidad;
			mejor_accion=movimientos[i];
		}
		if(menor_val<=alpha){
			return [mejor_accion, menor_val];
		}
		if(menor_val> betha){
			betha=menor_val;
		}
	}
	return [mejor_accion, menor_val];
	
}
/**
function minmax(estado,alpha,betha){
	var mejor_mov;
	var max=-100000;
	var max_actual;
	var movimientos=getMoves(estado,myID);
	for(var i=0;i<movimientos.length;i++){
		max_actual=valorMin(apliMove(movimientos[i],estado,myID),1,alpha,betha);
		if(max_actual>max){
			max=max_actual;
			mejor_mov=movimientos[i];
		}
	}
	return mejor_mov; 
}
function valorMax(estado,depth,alpha,betha){
	var v=-100000;
	if(depth==5){
		return evaluation(estado);
	}else{
		var movimientos=getMoves(estado,myID);
		for(var i=0;i<movimientos.length;i++){
			alpha=Math.max(alpha,valorMin(apliMove(movimientos[i],estado,myID),depth+1,alpha,betha));
			if(alpha>=betha){
				return betha; 
			}
		}
		return alpha; 
	}
}

function valorMin(estado,depth,alpha, betha){
	if(depth==5){
		return evaluation(estado);
	}else{
		var movimientos=getMoves(estado,otherID);
		for(var i=0;i<movimientos.length;i++){
			betha=Math.min(betha,valorMax(apliMove(movimientos[i],estado,otherID),depth+1,alpha,betha));
			if(alpha>=betha){
				return alpha; 
			}
		}
		return betha; 
	}
}**/