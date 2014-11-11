
	var canvas = document.getElementById('myCanvas');
	var context = canvas.getContext('2d');
	var playerPos = [canvas.width / 2, canvas.height / 2]
	
	/*
		player struct
		vars:
			x, y:
				player position on canvas
	*/

	function player() {
		this.x = playerPos[0];
		this.y = playerPos[1];
		
		context.beginPath();
		context.rect(x - 5, y, 10, 15);
		context.arc(x, y, 5, 0, Math.PI, true);
		context.closePath();
		context.fill();
	}
	
	/*
		bullet struct
		vars:
			px, py: player position on canvas
			xvel, yvel:
				x and y velocity (angle) of the bullet
				obtained by finding the angle between
					player and mouse position when clicked
	*/
	//TODO: make this function take args px, py
	function bullet () {
		//TODO: make this this.px = px, etc
		this.px = player.x;
		this.py = player.y;
		this.xvel = mousePos.x;
		this.yvel = mousePos.y;
		
		
		
		context.beginPath();
		context.arc(xvel, yvel, 2, 0, 2 * Math.PI);
		context.fill();
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



setInterval(function() {update()}, 1000 / 30);
function update() {
	player();

	canvas.addEventListener('mousemove', function(evt) {
		mousePos = getMousePos(canvas, evt);
	}, false);

	canvas.addEventListener('mousedown', function(evt) {
		//TODO: bullet (player.x, player.y)
		bullet ();
	}, false);
	
	var message = "Mouse Position: " + mousePos.x + " , " + mousePos.y;
	writeMessage (canvas, message);
}


