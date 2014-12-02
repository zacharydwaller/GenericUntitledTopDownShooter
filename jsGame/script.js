//cs135
//project1
var canvas	= document.getElementById('myCanvas');
var context	= canvas.getContext('2d');
var map = new Map();

//tick = 1000 divided by frames per second
var tick		= 1000 / 60;
var tickCount	= 0;

//Player vars
var playerAccel		= 2;
var playerMaxSpeed	= 2;
var invincibleTime = 30;
var score = 0;

//Bullet vars
var bulletSpeed		= 15;
var fireDelay		= 10;
var delayScore		= 0
var timesShot		= 0;
var shot			= [];

//Enemy vars
var spawnInterval = 120;
var numEnemies = 0;
var enemy = [];
var enemyBaseSpeed = 3;
var enemyBaseAccel = 0.25;

//PowerUp vars
var powerUpActive = false;
var freezeActive = false;
var damageActive = false;
var powerUp = [];
var numPowerUps = 0;
var powerUpSpawnInterval = 10 * 60; //5 seconds * 60 frames

//Control key codes
var W = 87;
var A = 65;
var S = 83;
var D = 68;

//Color codes
var BLACK = "#000000";
var RED = "#FF0000";
var GREEN = "#33CC33";
var ORANGE = "#FF9933";
var BLUE = "#0000FF"
var WHITE = "#FFFFFF";

//Control flags
var mousePos	= [2];
var keyPressed	= [ ];
var mouseDown;
var mouseTick;

//Player initialization
var player	= new Player();
player.x	= map.w  / 2;
player.y	= map.h / 2;

//Game Update
setInterval (function () {update ()}, tick);
function update() {	
	//Frame initialization
	map.draw();
	map.drawHUD();
	
	
	//End game when player dies
	if (player.isDead) {
		endGame();
		return;
	}
	
	//Increment tick
	tickCount++;
	
	//Increase score
	if (tickCount % 60 == 0) {
		score += 50;
	}
	console.log(fireDelay);
	//Increase fire rate
	if (tickCount % 1200 == 0) {
		console.log("memee");
		fireDelay--;
	}
	if (fireDelay <= 1) {
		fireDelay = 1;
	}
	
	//Shoot on mouseDown
	if (!player.isDead) {
		if (mouseDown) {
			//Fire rate limiter
			if (mouseTick % fireDelay == 0) {
					player.shoot();
			}
			mouseTick++;
		}
	}
	
	//Update player
	if (!player.isDead) {
		player.input();
		player.hitTest();
		player.move();
		player.decelerate();
		player.draw();
	}
	
	//Update enemies
	for (var i = 1; i <= numEnemies; i++) {
		if (!enemy[i].isDead) {
			if(!freezeActive) {
				enemy[i].findPlayer();
				enemy[i].move();
			}
			enemy[i].draw();
		}
	}
	
	//Update powerups
	for (var i = 1; i <= numPowerUps; i++) {
		if (!powerUp[i].destroyed) {
			powerUp[i].draw();
		}
		if (powerUp[i].active) {
			powerUp[i].timer < powerUp[i].duration ?
			powerUp[i].timer++ : powerUp[i].deactivate();
		}
	}
	
	//Update bullets
	for (var i = 1; i <= timesShot; i++) {
		if (!shot[i].destroyed){
			shot[i].move();
			shot[i].draw();
			shot[i].hitTest();
		}
	}
	
	//Spawn enemies
	if (tickCount % spawnInterval == 0 && !freezeActive) {
		numEnemies++;
		spawnInterval--;
		if (spawnInterval < 10) 
			spawnInterval = 10;
		enemy[numEnemies] = new Enemy();
	}
	
	//Spawn powerups
	if (tickCount % powerUpSpawnInterval == 0 && !freezeActive) {
		numPowerUps++;
		powerUp[numPowerUps] = new PowerUp();
	}
}

/*
	Enemy object
	Three types: Normal, Strong, Fast
		1 - Normal
			Normal speed
			3 hp
		2 - Strong
			Slower speed
			5 hp
		3 - Fast
			Very fast
			1 hp
*/
function Enemy() {
	//Position declarations
	this.x;
	this.y;
	this.xvel = 0;
	this.yvel = 0;
	//Stat declarations
	this.type = randomInt(0,100);
	this.health;
	this.maxSpd;
	this.accel;
	this.isDead = false;
	this.audio = new Audio('sounds/hitsound.wav');
	this.score;
	//Declared at beginning of file
	//var enemyBaseSpeed = 3;
	//var enemyBaseAccel = 0.25;
	
	//Picks a random Enemy
	//60% Normal
	//20% Strong or Fast
	if (this.type < 60)
		this.type = 1;
	else if (this.type < 80)
		this.type = 2;
	else if (this.type < 100)
		this.type = 3;
	
	
	//Change stats according to enemy type
	//Normal
	if (this.type == 1) {
		this.maxSpd = enemyBaseSpeed;
		this.health = 3;
		this.accel = enemyBaseAccel;
		this.score = 100;
	//Strong
	} else if (this.type == 2) {
		this.maxSpd = enemyBaseSpeed / 1.5;
		this.health = 10;
		this.accel = enemyBaseAccel / 4;
		this.score = 300;
	//Fast
	} else {
		this.maxSpd = enemyBaseSpeed * 2;
		this.health = 1;
		this.accel = enemyBaseAccel * 2;
		this.score = 150;
	}
	
	//Spawn enemy at random location away from player
 	if (Math.random() > .5) {
 		this.x = player.x + randomInt(400,800);
 	} else {
 		this.x = player.x - randomInt(400,800);
 	}
 	if (Math.random() > .5) {
 		this.y = player.y + randomInt(400,800);
 	} else {
 		this.y = player.y - randomInt(400,800);
 	}
	
	//Draws enemy
	this.draw = function() {
		context.beginPath();
		if (this.type == 1) {
			context.fillStyle = ORANGE;
			context.rect(this.x - 5, this.y, 10, 15);
			context.arc(this.x, this.y, 5, 0, 2 * Math.PI);
		} else if (this.type == 2){
			context.fillStyle = RED;
			context.rect(this.x - 7.5, this.y, 15, 20);
			context.arc(this.x, this.y, 7.5, 0, 2 * Math.PI);
		} else {
			context.fillStyle = GREEN;
			context.rect(this.x - 5, this.y, 10, 15);
			context.arc(this.x, this.y, 5, 0, 2 * Math.PI);
		}
		context.closePath();
		context.fill();
	};
	
	//Find and move to player
	this.findPlayer = function() {
	
		if (this.y > player.y) {
			if (this.yvel >= -this.maxSpd) {
				this.yvel -= this.accel;
			}
		}
		if (this.y < player.y) {
			if (this.yvel <= this.maxSpd) {
				this.yvel += this.accel;
			}
		}
		if (this.x > player.x) {
			if (this.xvel >= -this.maxSpd) {
				this.xvel -= this.accel;
			}
		}
		if (this.x < player.x) {
			if (this.xvel <= this.maxSpd) {
				this.xvel += this.accel;
			}
		}
	};
	
	//Take damage, if health == 0, kill
	this.takeDamage = function() {
		this.health--;
		this.audio.play();
		if (this.health <= 0) {
			this.x = -1000;
			this.y = -1000
			this.isDead = true;
			score += this.score;
		}
	};
	
	//Move based on final velocity
	this.move = function() {
		if (!this.isDead) {
			this.x += this.xvel;
			this.y += this.yvel;
		}
	};
}

/*
	player object
*/

function Player() {
	//Position declaration
	this.x;
	this.y;
	this.xvel = 0;
	this.yvel = 0;
	//Stat declarations
	this.isDead = false;
	this.health = 3;
	this.damageTick = 0;
	
	
	//Key processing for movement
	this.input = function() {
		if (keyPressed[W]) {
			if (this.yvel >= -playerMaxSpeed) {
				this.yvel -= playerAccel;
			}
		}
		if (keyPressed[S]) {
			if (this.yvel <= playerMaxSpeed) {
				this.yvel += playerAccel;
			}
		}
		if (keyPressed[A]) {
			if (this.xvel >= -playerMaxSpeed) {
				this.xvel -= playerAccel;
			}
		}
		if (keyPressed[D]) {
			if (this.xvel <= playerMaxSpeed) {
				this.xvel += playerAccel;
			}
		}
	};
	
	//Take damage, if health == 0, kill
	this.takeDamage = function() {
		if (tickCount > this.damageTick + invincibleTime) {
			this.damageTick = tickCount;
			this.health--;
			if (this.health <= 0) {
				this.isDead = true;
			}
			
		}
	};
	
	//Checks for collisions between boundary and enemies
	this.hitTest = function() {
		this.hitTop		= this.y - 5;
		this.hitBot		= this.y + 15;
		this.hitLeft	= this.x - 10;
		this.hitRight	= this.x + 10;
		
		//wall hittest
		if (this.hitLeft <= 0) {
			this.xvel += 2;
			this.x = 10;
		}
		if (this.hitRight >= map.w) {
			this.xvel -= 2;
			this.x = map.w - 10;
		}
		if (this.hitTop <= 0) {
			this.yvel += 2;
			this.y = 10;
		}
		if (this.hitBot >= map.h) {
			this.yvel -= 2;
			this.y = map.h -20;
		}
		
		//Enemy hittest
		for (var i = 1; i <= numEnemies; i++) {
			if (
				this.hitLeft <= enemy[i].x + 10
				&& this.hitRight >= enemy[i].x - 10
				&& this.hitTop <= enemy[i].y + 15
				&& this.hitBot >= enemy[i].y -5
				&& !freezeActive
				)
			{
				this.takeDamage();
			}
		}
		
		//powerups hittest
		for (var i = 1; i <= numPowerUps; i++) {
			if (
				this.hitLeft <= powerUp[i].x + 5
				&& this.hitRight >= powerUp[i].x - 5
				&& this.hitTop <= powerUp[i].y + 5
				&& this.hitBot >= powerUp[i].y - 5
				)
			{
				if (
					!powerUpActive
					&& powerUp[i].type != 1
					&& powerUp[i].type != 3
					)
				{
					powerUp[i].activate();
				}
				if (powerUp[i].type == 1 || powerUp[i].type == 3) {
					powerUp[i].activate();
				}
			}
		}
	};
	
	//move player according to final velocity 
	this.move = function() {
		this.x += this.xvel;
		this.y += this.yvel;
	};
	
	//Slow movement	
	this.decelerate = function() {
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
	};
	
	//Creates a new Bullet instance, increments number of bullets fired.
	this.shoot = function() {
		timesShot++;
		shot[timesShot] = new Bullet();
	};
	
	//Draw player
	this.draw = function() {
		context.beginPath();
		context.rect(this.x - 5, this.y, 10, 15);
		context.arc(this.x, this.y, 5, 0, 2 * Math.PI);
		context.closePath();
		context.fillStyle = BLACK;
		context.fill();
	};

}

/*
	bullet struct
*/
function Bullet() {
	/*Maths for bullet
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
	
	this.destroyed = false;
	
	//Draws bullet
	this.draw = function() {
		damageActive ? context.fillStyle = RED : context.fillStyle = BLACK;
		context.beginPath();
		context.arc(this.x, this.y, 3, 0, 2 * Math.PI);
		context.closePath();
		context.fill();
	};
	
	//Moves bullet
	this.move = function() {
		this.x += this.xvel;
 		this.y += this.yvel;
	};
	
	//checks for collision of boundary or enemy
	this.hitTest = function() {
		this.hitTop		= this.y - 12.5;
		this.hitBot		= this.y + 22.5;
		this.hitLeft	= this.x - 17.5;
		this.hitRight	= this.x + 17.5;
		
		for (var i = 1; i <= numEnemies; i++) {
			if (
				enemy[i].x >= this.hitLeft
				&& enemy[i].x <= this.hitRight
				&& enemy[i].y >= this.hitTop
				&& enemy[i].y <= this.hitBot
				&& !enemy[i].destroyed
				)
			{
				enemy[i].takeDamage();
				if (damageActive) {
					for (var j = 0; j < 3; j++) {
						enemy[i].takeDamage();
					}
				}
				this.x = -10;
				this.xvel= 0;
				this.destroyed = true;
			}
		}
		if (
			this.x <= 0
			|| this.x >= map.w
			|| this.y <= 0
			|| this.y >= map.h
			)
		{
			this.x = -10;
			this.xvel= 0;
			this.destroyed = true;
		}
	};
}

//Powerup Functions
//1 = Medkit, 2 = Freeze, 3 = Bomb, 4 = Damage Increase
function PowerUp() {
	this.x = randomInt(0 + 20,map.w - 20);
 	this.y = randomInt(0 + 20,map.h - 20);
	this.type = randomInt(1,5);
	this.timer = 0;
	this.active = false;
	this.destroyed = false;
	
	this.draw = function() {
		//Draw medkit
		if (this.type == 1) {
			context.strokeStyle = BLACK;
			context.beginPath();
			context.lineWidth = 2;
			context.arc(this.x, this.y, 10, 0, 2 * Math.PI);
			context.stroke();
			context.closePath();
			
			context.strokeStyle = RED;
			context.beginPath();
			context.moveTo(this.x + 7, this.y);
			context.lineTo(this.x - 7, this.y);
			context.moveTo(this.x, this.y + 7);
			context.lineTo(this.x, this.y - 7);
			context.stroke();
			context.closePath();
		}
		//Draw freeze
		if (this.type == 2) {
			context.fillStyle = BLUE;
			context.beginPath();
			context.arc(this.x, this.y, 10, 0, 2 * Math.PI);
			context.fill();
			context.closePath();
			
			context.beginPath();
			context.fillStyle = WHITE;
			context.arc(this.x, this.y, 5, 0, 2 * Math.PI);
			context.fill();
			context.closePath();
			
		}
		//Draw bomb
		if (this.type == 3) {
			context.beginPath();
			context.fillStyle = BLACK;
			context.arc(this.x, this.y, 10, 0, 2 * Math.PI);
			context.fillRect(this.x - 2.5, this.y - 13, 5, 5);
			context.fill();
			context.closePath();
		}
		//Draw damage
		if (this.type == 4) {
			context.beginPath();
			context.strokeStyle = BLACK;
			context.fillStyle = ORANGE;
			context.rect(this.x - 13, this.y - 5, 8, 10);
			context.arc(this.x - 9, this.y - 5, 4, 0, 2 * Math.PI);
			context.stroke();
			context.rect(this.x - 4, this.y - 5, 8, 10);
			context.arc(this.x, this.y - 5, 4, 0, 2 * Math.PI);
			context.stroke();
			context.rect(this.x + 5, this.y - 5, 8, 10);
			context.arc(this.x + 9, this.y - 5, 4, 0, 2 * Math.PI);
			context.stroke();
			context.fill();
			context.closePath();
		}
	};
	
	this.activate = function() {
		powerUpActive = true;
		this.active = true;
		this.destroyed = true;
		this.x = -10;
		//Medkit
		if (this.type == 1) {
			this.duration = 1;
			player.health++;
		}
		//Freeze
		if (this.type == 2) {
			this.duration = 4 * 60; // 4 seconds times 60 frames
			freezeActive = true;
		}
		//Bomb
		if (this.type == 3) {
			this.duration = 1;
			for (var i = 1; i <= numEnemies; i++) {
				for (var j = 0; j < 3; j++) {
					enemy[i].takeDamage();
				}
			}
		}
		//Damage
		if (this.type == 4) {
			this.duration = 10 * 60; // 10 seconds times 60 frames
			damageActive = true;
		}
	};
	
 	this.deactivate = function() {
		powerUpActive = false;
		this.active = false;
		//Freeze
		if (this.type == 2) {
			freezeActive = false;
		}
		if (this.type == 4) {
			damageActive = false;
		}
	}
}

//Map functions
function Map() {
	this.w = canvas.width;
	this.h = canvas.height;
	
	//Draws the box around the map
	this.draw = function() {
		context.clearRect(0, 0, this.w, this.h);
		context.beginPath()
		context.lineWidth = 1;
		context.strokeStyle = BLACK;
		context.moveTo(0,0);
		context.lineTo(this.w,0);
		context.lineTo(this.w,this.h);
		context.lineTo(0,this.h);
		context.lineTo(0,0);
		context.closePath();
		context.stroke();
	};
	
	//Draws the Heads Up Display
	this.drawHUD = function() {
		//Player's health
		context.font = "20px Georgia";
		context.fillStyle = BLACK;
		context.fillText("HP:", 10, 20);
		context.fillText(player.health, 50, 20);
		
		//Score
		context.fillText("Score:", 10, 40);
		context.fillText(score, 65, 40);
		
		//PowerUp
		if (freezeActive)
			context.fillText("Freeze Active", 10, 60);
		if (damageActive)
			context.fillText("Triple Damage!", 10, 60);
	};
}

function endGame() {
 	context.clearRect( 0,0,1000,1000);
 	context.font = "50px Georgia";
 	context.fillStyle = RED;
 	context.fillText("Game Over", 300, 200);
 	context.fillText("Your Score:", 250, 250);;
 	context.fillText(score, 500, 250);
}

// Returns a random integer between min (inclusive) and max (non-inclusive)
function randomInt(min, max) {
		return Math.floor(Math.random() * (max - min)) + min;
}

//Gets the mouse's position
//Borrowed from Dave/Sushil's tic-tac-toe code
function getMousePos (canvas, evt) {
	var rect = canvas.getBoundingClientRect();
		return {
			x: evt.clientX - rect.left,
			y: evt.clientY - rect.top
		};
}

//Input event listeners
window.addEventListener ('keydown', function(evt) {
	keyPressed[evt.keyCode] = true;
}, false);
window.addEventListener ('keyup', function(evt) {
	keyPressed[evt.keyCode] = false;
}, false);
window.addEventListener ('mousemove', function(evt) {
	mousePos = getMousePos(canvas, evt);
}, false);
window.addEventListener ('mousedown', function(evt) {
	mouseDown = true;
	mouseTick = 0;
}, false);
window.addEventListener ('mouseup', function(evt) {
	mouseDown = false;
}, false);
