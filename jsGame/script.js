/*TODO:
 * 	Add bounds so player can't leave the canvas
 * 	Start implementing enemies, swarms?
 */

var canvas	= document.getElementById('myCanvas');
var context	= canvas.getContext('2d');
//tick = 1000 divided by frames per second
var tick		= 1000 / 60;
var tickCount	= 0;

//Player vars
var playerAccel		= 3;
var playerMaxSpeed	= 6;

//Bullet vars
var bulletSpeed		= 15;
var fireDelay		= 10;
var timesShot		= 0;
var shot			= [];

//Control key codes
var W = 87;
var A = 65;
var S = 83;
var D = 68;

//Control flags
var mousePos	= [2];
var keyPressed	= [ ];
var mouseDown;

//Player initialization
var player	= new Player();
player.x	= canvas.width  / 2;
player.y	= canvas.height / 2;

//Game Update
setInterval (function () {update ()}, tick);
function update() {
	//Frame initialization
	tickCount++;
	context.clearRect(0, 0, canvas.width, canvas.height);
	
	//write mouse position
	var message = "Mouse Position: " + mousePos.x + " , " + mousePos.y;
	writeMessage (canvas, message);
	
	//Fire bullet if mouse is pressed
	if (mouseDown == true) {
		if (tickCount % fireDelay == 0) {
			shoot();
		}
	}
	
	//Player control
	movePlayer();
	player.decelerate();
	player.move();
	player.draw();
	
	//Bullet control. For each bullet i
	for (var i = 1; i <= timesShot; i++) {
		shot[i].move();
		shot[i].draw();
	}
}

/*
	player object
*/

function Player() {
	this.x;
	this.y;
	this.xvel = 0;
	this.yvel = 0;
	
	this.move = function() {
		this.x += this.xvel;
 		this.y += this.yvel;
	};
	
	this.decelerate = function () {
		if (this.xvel < 0) {
			this.xvel += 1;
		} else if (this.xvel > 0) {
			this.xvel -= 1;
		}
		if (this.yvel < 0) {
			this.yvel += 1;
		} else if (this.yvel > 0) {
			this.yvel -= 1;
		}
	}
	
	this.draw = function() {
		context.beginPath();
		context.rect(this.x - 5, this.y, 10, 15);
		context.arc(this.x, this.y, 5, 0, 2 * Math.PI);
		context.closePath();
		context.fill();
	};
}

/*
	bullet struct
*/
function Bullet() {
	/*Maths for bullet, trig based
	 * Sets a vector for the bullet to travel
	 * on based on where the mouse is relative
	 * to the player.
	*/
	this.adj = mousePos.x - player.x;
	this.opp = mousePos.y - player.y;
	this.hyp = Math.sqrt(this.adj * this.adj + this.opp * this.opp);
	//Bullet vector x (cos) component multiplied by bulletSpeed
	this.xvel = this.adj / this.hyp * bulletSpeed;
	//Bullet vector y (sin) component multiplied by bulletSpeed
	this.yvel = this.opp / this.hyp * bulletSpeed;
	//Sets starting coords to the player's coords
	this.x = player.x;
	this.y = player.y;
	
	this.draw = function() {
		context.beginPath();
		context.arc(this.x, this.y, 3, 0, 2 * Math.PI);
		context.closePath();
		context.stroke();
	};

	this.move = function() {
		this.x += this.xvel;
 		this.y += this.yvel;
	};
}

//Moves Player based on keypresses
function movePlayer() {
	if (keyPressed[W]) {
		if (player.yvel >= -playerMaxSpeed) {
			player.yvel -= playerAccel;
		}
	}
	if (keyPressed[S]) {
		if (player.yvel <= playerMaxSpeed) {
			player.yvel += playerAccel;
		}
	}
	if (keyPressed[A]) {
		if (player.xvel >= -playerMaxSpeed) {
			player.xvel -= playerAccel;
		}
	}
	if (keyPressed[D]) {
		if (player.xvel <= playerMaxSpeed) {
			player.xvel += playerAccel;
		}
	}
}

//Creates a new Bullet instance, increments number of bullets fired.
function shoot() {
	timesShot++;
	shot[timesShot] = new Bullet();
}

/*
	writeMessage:
		writes a message in black text to a spot below the tic-tac-toe board
		note: clears out previous text		
	
	args:s
		canvas: which canvas to draw on (should always be: canvas)
		message: a string which will be drawn in canvas
*/
function writeMessage (canvas, message) {
	context.clearRect(0, canvas.height - 50, canvas.width, canvas.height);
	context.font = '18pt Calibri';
	context.fillStyle = 'black';
	context.fillText(message, 10, canvas.height - 10);
	}
	
/*
	writeError:
		writes a message in black text to a spot below the tic-tac-toe board
		note: clears out previous text		

	args:
		canvas: which canvas to draw on (should always be: canvas)
		message: a string which will be drawn in canvas
*/
function writeError (canvas, message) {
	context.font = '18pt Calibri';
	context.fillStyle = 'red';
	context.fillText(message, 10, 500);
}

//Simply gets the mouse's position
function getMousePos (canvas, evt) {
	var rect = canvas.getBoundingClientRect();
		return {
			x: evt.clientX - rect.left,
			y: evt.clientY - rect.top
		};
}

//Input event listeners.
window.addEventListener ('keydown', function(evt) {
	keyPressed[evt.keyCode] = true;
}, false);
window.addEventListener ('keyup', function(evt) {
	keyPressed[evt.keyCode] = false;
}, false);
window.addEventListener ('mousemove', function(evt) {
	mousePos = getMousePos(canvas, evt);
}, false);
/*
 * Mouse press listeners:
 * 	if mouse is clicked, it will fire one bullet
 * 	if mouse is held, it will fire a bullet after a delay 
 * 	if mouse is spammed, it will treat the action as holding and clicking
 * 		bullets will fire very quickly
 * 		rewards the player for proactively clicking repeatedly
*/
window.addEventListener ('mousedown', function(evt) {
	mouseDown = true;
}, false);
window.addEventListener ('mouseup', function(evt) {
	mouseDown = false;
}, false);
window.addEventListener ('click', function(evt) {
	shoot();
}, false);