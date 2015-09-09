var resized = false;
window.addEventListener('resize', function(){
	resized = true;
}, true);

var width = window.innerWidth;
var height = window.innerHeight;

var canvas = document.getElementById('boidscanvas');
var ctx = canvas.getContext('2d');

canvas.width = width;
canvas.height = height;

var Boid = function(ctx){
	this.ctx = ctx;
	// random location on the canvas
	this.x = width * Math.random();
	this.y = height * Math.random();
	// we'll use this to give a direction and speed.
	this.vx = 0;
	this.vy = 0;
}

Boid.prototype = {
	rad: 2,
	bcolor: '#fff',

	draw : function(){
		this.ctx.fillStyle = this.bcolor;
		this.ctx.beginPath();
		this.ctx.arc( this.x, this.y, this.rad, 0, 2*Math.PI,false);
		this.ctx.fill();
		this.ctx.closePath();
	}
};

var boids = [];
var randomVelocityX = [];
var randomVelocityY = [];

var NUM_BOIDS = width*height/7000;
var MAX_SPEED = 5;
var MAX_DISTANCE = 100;

init();
loop();

function init(){
	//make boids
	for(var i = 0; i < NUM_BOIDS ; i++){
		var boid = new Boid(ctx);
		boids[i] = boid;
	}

	// make random velocities
	for(var i = 0; i < NUM_BOIDS; i++){
		var velX, velY;

		if(Math.random() < 0.5){
			velX = 10 * ( Math.random() - 0.5 );
			velY = 10 * ( Math.random() - 0.5 );
		} else {
			velX = velY = 0;
		}
		randomVelocityX[i] = velX;
		randomVelocityY[i] = velY;
	}

	ctx.fillStyle = 'rgb(255,255,255)';
	ctx.fillRect(0,0,width,height);
	ctx.fillStyle = 'rgba(70,70,70,0.1)';
	for(var i=0;i<10;i++) {
		ctx.fillRect(0,0,width,height);
	}

}

function loop(){
	if(resized){
		width = window.innerWidth;
		height = window.innerHeight;
		canvas.width = width;
		canvas.height = height;
		NUM_BOIDS = width*height/7000;
		boids=[];
		randomVelocityX = [];
		randomVelocityY = [];
		init();
		resized=false;
	}
	ctx.fillStyle = 'rgba(70,70,70,0.1)';
	ctx.fillRect(0,0,width,height);

	for(var i = 0; i < boids.length; i++){
		var b = boids[i];
		b.vx += randomVelocityX[i];
		b.vy += randomVelocityY[i];

		var speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy );
		if (speed >= MAX_SPEED){
			var slow = MAX_SPEED / speed;
			b.vx *= slow;
			b.vy *= slow;
		}

		b.x += b.vx;
		b.y +=b.vy;

		// check bounds
		if(b.x < 0){
			b.x += width;
		}
		if (b.x > width){
			b.x -= width;
		}
		if(b.y < 0){
			b.y += height;
		}
		if(b.y > height){
			b.y -= height;
		}
	}

	for(var i = 0;i < boids.length;i++){
		var b = boids[i];
		ctx.beginPath();
		ctx.fillStyle = '#fff';
		ctx.arc(b.x,b.y,b.rad,0,2*Math.PI);
		ctx.fill();
		ctx.closePath();

		// draw some lines between boids
		for ( var j = i; j < boids.length ; j++){
			var b2 = boids[j];
			var dx = b.x - b2.x;
			var dy = b.y - b2.y;
			// Pyhagoras! woehoe
			var distance = Math.sqrt(dx*dx + dy*dy);

			if(distance < MAX_DISTANCE){
				var alpha = (MAX_DISTANCE - distance) / MAX_DISTANCE;
				ctx.beginPath();
				ctx.strokeStyle = 'rgba(255,255,255,'+alpha+')';
				ctx.moveTo(b.x,b.y);
				ctx.lineTo(b2.x,b2.y);
				ctx.stroke();
				ctx.closePath();
			}
		}
	}

	requestAnimationFrame(loop);
}


window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

