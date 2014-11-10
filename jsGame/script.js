
	var canvas = document.getElementById('myCanvas');
	var context = canvas.getContext('2d');
	var mousePos = [0,0];
	var playerPos = [100,100];
	
	/*
		bullet struct
		vars:
			x, y: player position on canvas
			xvel, yvel:
				x and y velocity (angle) of the bullet
				obtained by finding the angle between
					player and mouse position when clicked
	*/
	//TODO: Write getPlayerPos();
	function player() {
		playerPos = getPlayerPos();
	}
	
	function bullet () {
		this.x = 100;
		this.y = 100;
		this.xvel = mousePos.x;
		this.yvel = mousePos.y;
		
		
		
		context.beginPath();
		context.moveTo(x,y);
		context.lineTo(xvel,yvel);
		context.arc(xvel, yvel, 3, 0, 2 * Math.PI);
		context.stroke();
	}

	
	/*
		writeMessage:

			writes a message in black text to a spot below the tic-tac-toe board
			note: clears out previous text		
		
		args:s
			canvas: which canvas to draw on (should always be: canvas)
			message: a string which will be drawn in canvas
	*/
	function writeMessage(canvas, message) {

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
	function writeError(canvas, message) {


        context.font = '18pt Calibri';
        context.fillStyle = 'red';
        context.fillText(message, 10, 500);
	}

function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
		return {
			x: evt.clientX - rect.left,
			y: evt.clientY - rect.top
		};
}

canvas.addEventListener('mousemove', function(evt) {
	mousePos = getMousePos(canvas, evt);
}, false);

canvas.addEventListener('mousedown', function(evt) {
	bullet ();
}, false);

setInterval(function() {update()}, 1000 / 30);
function update() {
	var message = "Mouse Position: " + mousePos.x + " , " + mousePos.y;
	writeMessage (canvas, message);
}


