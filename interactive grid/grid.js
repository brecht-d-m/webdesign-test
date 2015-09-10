var resized = false;
window.addEventListener('resize', function(){
	resized = true;
}, true);


var width = window.innerWidth;
var height = window.innerHeight;

var canvas = document.getElementById('c');
var ctx = canvas.getContext('2d');

canvas.width = width;
canvas.height = height;


var dots = [];
var SEPARATION = 150;
var GRAVITYFIELD = 150;
var MOVEDISTANCE = 1;
var MAXPULLS = 500;

document.onmousemove = handleMouseMove;
var clientX = -1000, clientY =-1000;
function handleMouseMove(e){
	 var evt = e || event || window.event;
	 clientX = evt.clientX;
	 clientY = evt.clientY;
}

var Dot = function(ctx, x, y){
	this.ctx = ctx;
	// random location on the canvas
	this.x = x;
	this.y = y;
	// we'll use this to give a direction and speed.
	this.vx = 0;
	this.vy = 0;
	this.pulled = false;
	this.pulledX = 0;
	this.pulledY = 0;
	this.timesPulled = 0;
}

Dot.prototype = {
	rad: 2,
	col: '#fff',

	draw : function(){
		this.ctx.fillStyle = this.bcolor;
		this.ctx.beginPath();
		this.ctx.arc( this.x, this.y, this.rad, 0, 2*Math.PI,false);
		this.ctx.fill();
		this.ctx.closePath();
	}
};

init();
loop();

function init(){
	//make dots
	for(var i = 0; i < width+SEPARATION ; i+=SEPARATION){
		for(var j = 0; j < height+SEPARATION; j+=SEPARATION){
			var dot = new Dot(ctx,i,j);
			dots.push(dot);
		}
	}
	ctx.fillStyle = 'rgb(70,70,70)';
	ctx.fillRect(0,0,width,height);
}

function loop(){
	if(resized){
		width = window.innerWidth;
		height = window.innerHeight;
		canvas.width = width;
		canvas.height = height;
		dots=[];
		init();
		resized=false;
	}
	ctx.clearRect(0,0,width,height);

	for(var i = 0;i < dots.length;i++){
		var dotA = dots[i];
		var dx = dotA.x - clientX;
		var dy = dotA.y - clientY;
		var distanceWithMouse = Math.sqrt(dx*dx + dy*dy);
		if(distanceWithMouse <= GRAVITYFIELD){
			if(! dotA.pulled){
				dotA.timesPulled += 1;
				dotA.col = '#FFF';
				if(dx > 0){
					dotA.x = dotA.x - MOVEDISTANCE;
					dotA.pulledX -= MOVEDISTANCE;
				} else {
					dotA.x = dotA.x + MOVEDISTANCE;
					dotA.pulledX += MOVEDISTANCE;
				}
				if(dy > 0){
					dotA.y = dotA.y - MOVEDISTANCE;
					dotA.pulledY -= MOVEDISTANCE;
				} else {
					dotA.y = dotA.y + MOVEDISTANCE;
					dotA.pulledY += MOVEDISTANCE;
				}
				if(dotA.timesPulled >= MAXPULLS){
					dotA.pulled = true;
				}
			}
		} 
		if(distanceWithMouse > GRAVITYFIELD || dotA.pulled == true) {
				dotA.col = '#FFF'
				if(dotA.pulledX > 0){
					dotA.x -= MOVEDISTANCE;
					dotA.pulledX -= MOVEDISTANCE;
				} else{
					dotA.x += MOVEDISTANCE;
					dotA.pulledX += MOVEDISTANCE;
				}
				if(dotA.pulledY > 0){
					dotA.y -= MOVEDISTANCE;
					dotA.pulledY -= MOVEDISTANCE;
				} else{
					dotA.y += MOVEDISTANCE;
					dotA.pulledY += MOVEDISTANCE;
				}
				if(dotA.pulledX == 0 && dotA.pulledY == 0){
					dotA.pulled = false;
					dotA.timesPulled = 0;
				}
		}
		ctx.beginPath();
		ctx.fillStyle = dotA.col;
		ctx.arc(dotA.x,dotA.y,dotA.rad,0,2*Math.PI);
		ctx.fill();
		ctx.closePath();
		// draw some lines between dots
		for ( var j = i; j < dots.length ; j++){
			var dotB = dots[j];
			var dx = dotA.x - dotB.x;
			var dy = dotA.y - dotB.y;
			var distanceDots = Math.sqrt(dx*dx + dy*dy);
			var maxDistanceMoved = Math.sqrt(MOVEDISTANCE*MOVEDISTANCE + MOVEDISTANCE*MOVEDISTANCE);
			if(distanceDots <= SEPARATION+maxDistanceMoved){
				ctx.beginPath();
				ctx.strokeStyle = 'rgba(255,255,255,0.1)';
				ctx.moveTo(dotA.x,dotA.y);
				ctx.lineTo(dotB.x,dotB.y);
				ctx.stroke();
				ctx.closePath();
			}
		}
	}

	requestAnimationFrame(loop);
}


window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
