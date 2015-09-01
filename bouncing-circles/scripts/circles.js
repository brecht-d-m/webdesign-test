$(function() {
	init();
});

window.requestAnimFrame = (function() {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		function(callback) {
			window.setTimeout(callback, 1000 / 60);
	};
})();

var canv = 0,
	ctx = 0,
	gravity = 0.035,
	dampening = 0.95,
	pullStrength = 0.005,
	numCircles = 100,
	mouseDown = false,
	mouseX, mouseY,
	bumpPower = 3;
	circles = [];

function init() {
	canv = document.getElementById('myCanvas');
	ctx = canv.getContext('2d');
	ctx.font = "30px Arial";
	createCircles();
	addEventListeners();
	drawFrame();
}

function drawFrame() {
	var i, circle;
	interact();
	ctx.clearRect(0, 0, canv.width, canv.height);
	ctx.fillStyle = 'black';
	//ctx.fillText("Thomas Dhondt zijn persoonlijk ballenbad", 50, canv.height/4 );
	for (i = 0; i < numCircles; i++) {
		circle = circles[i];
		circle.x += circle.vx;
		circle.y += circle.vy;
		circle.vy += gravity;

		// Slow it down
		circle.vx *= dampening;
		circle.vy *= dampening;
		

		for( var j = i+1; j < numCircles; j++){
			collide(circle, circles[j]);
		}

		//bottom bounce
		if (circle.y + circle.rad >= canv.height) {
			circle.y = canv.height - circle.rad;
			circle.vy = -Math.abs(circle.vy);
		}

		//right bounce
		if (circle.x + circle.rad >= canv.width) {
			circle.x = canv.width - circle.rad;
			circle.vx = -Math.abs(circle.vx);
		}

		//left bounce
		if (circle.x - circle.rad <= 0) {
			circle.x = circle.rad;
			circle.vx = Math.abs(circle.vx);
		}

		//up bounce
		if (circle.y - circle.rad <= 0) {
			circle.y = circle.rad;
			circle.vy = Math.abs(circle.vy);
		}

		ctx.beginPath();
		ctx.arc(circle.x, circle.y, circle.rad, 0, 2 * Math.PI);
		ctx.closePath();
		ctx.fillStyle = circle.color;
		ctx.fill();
	}

	requestAnimFrame(drawFrame);
}

function addEventListeners() {
	canv.addEventListener('mousedown', function(e) {
		mouseDown = true;
		mouseX = e.pageX;
		mouseY = e.pageY;
	});

	canv.addEventListener('mouseup', function(e) {
		mouseDown = false;
	});

	canv.addEventListener('mousemove', function(e){
		mouseX = e.pageX;
		mouseY = e.pageY;
	});
}


function Circle(x, y, rad) {
	this.x = x;
	this.y = y;
	this.rad = rad;
	this.vx = 0;
	this.vy = 0;
	this.color = 'black';
}

function createCircles() {
	var i;
	for (i = 0; i < numCircles; i++) {
		var circle = new Circle(Math.random() * canv.width, Math.random() * canv.height, 20);
		circle.color = 'rgb(' + Math.round(Math.random()*255) + ',' + Math.round(Math.random()*255) + ',' + Math.round(Math.random()*255) + ')';
		circles.push(circle);
	}
}

function interact(){
	if (mouseDown) {
		for (var i = 0; i < numCircles; i++) {
			var circle = circles[i];

			var dx = mouseX - circle.x,
				dy = mouseY - circle.y;
			circle.vx += dx * pullStrength;
			circle.vy += dy * pullStrength;

		}
	}
}

function collide(a , b){
	var dx = b.x - a.x,
		dy = b.y - a.y,
		d = Math.sqrt(dx*dx + dy*dy),
		ux = dx/d, // cos
		uy = dy/d; // sin

	if(d < a.rad + b.rad){
		a.vx -= ux * bumpPower;
		a.vy -= uy * bumpPower;
		b.vx += ux * bumpPower;
		b.vy += uy * bumpPower;
	}
}