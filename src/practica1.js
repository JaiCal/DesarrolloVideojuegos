var message = {0:'Juego Memoria Spectrum', 1:'Inténtalo otra vez', 2:'¡Pareja encontrada!', 3:'¡Has ganado!'};
var positions = {0:'down', 1:'up', 2:'found'};
var names = {0:'perico', 1:'mortadelo', 2:'fernandomartin', 3:'sabotaje',
			4:'phantomas', 5:'poogaboo', 6:'sevilla', 7:'abadia'};


MemoryGame = function (gs) {

	this.gs = gs;
	this.msg = 0;
	this.boardSize = 16;
	//state = número de cartas boca arriba. 3 = juego finalizado.
	this.state = 0;
	this.board = [];
	this.pairs = 0;
	
	this.initGame = function() {
		var boardSetup = [0, 0, 0, 0, 0, 0, 0, 0];
		for(var i = 0; i < this.boardSize; i++) {
			//Generamos un número aleatorio que representará la carta que elegimos en la posición i.
			var x = Math.floor(Math.random() * 8);
			//Si la carta ya se ha colocado dos veces, elegimos la siguiente.
			var done = false;
			while(!done) {
				if(boardSetup[x] < 2) {
					this.board[i] = new MemoryGameCard(x);
					boardSetup[x]++;
					done = true;
				} else {
					if(x == (this.boardSize-1)) {
						x = 0;
					} else {
						x++;
					}
				};
			}
		}
		
		this.loop();
	}

	this.draw = function() {
		gs.drawMessage(message[this.msg]);
		for(var i = 0; i < this.boardSize; i++) {
			this.board[i].draw(this.gs, i);
		}
	}

	this.loop = function() {
		var that = this;
		setInterval(function(){that.draw()}, 16);
	}

	this.onClick = function(cardId) {
		if(cardId > -1) {
			if(this.state < 2) {
				var card = this.board[cardId];
				if(card.getPos() == 0) {
					card.flip();
					this.state++;
					if(this.state == 1) {
						flippedCard = card;
					}
					if(this.state == 2) {
						//Si se encuentra la pareja:
						if(card.compareTo(flippedCard)) {
							this.msg = 2;
							flippedCard = null;
							this.state = 0;
							this.pairs++;
							if(this.pairs == this.boardSize/2) {
								this.state = 3;
								this.msg = 3;
							}
						//Si NO se encuentra:
						} else {
							this.msg = 1;
							this.state = 0;
								
							setTimeout(function() {
								card.flip();
								flippedCard.flip();
								flippedCard = null;
							}, 1000);
						}
					}
					this.draw();
				}
			}
		}
	}

}

MemoryGameCard = function(sprite) {
	
	this.name = sprite;
	this.position = 0;
	
	this.flip = function() {
		if(this.position == 0) this.position = 1;
		else if(this.position == 1) this.position = 0;
		//Si no está en estado up o down, está encontrada. No la tocamos, por si acaso.
	}
	
	this.found = function() {
		this.position = 2
	}
	
	this.compareTo = function(otherCard) {
		if(this.name == otherCard.name) return true;
		else return false;
	}
	
	this.draw = function(gs, pos) {
		if(this.position == 0) {
			gs.draw("back", pos);
		}
		else {
			gs.draw(names[this.name], pos);
		}
	}
	
	this.getPos = function() {
		return this.position;
	}
}