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

document.onmousemove = handleMouseMove;
var clientX = -1000, clientY =-1000;
function handleMouseMove(e){
	 var evt = e || event || window.event;
	 clientX = evt.clientX;
	 clientY = evt.clientY;
}

document.onclick = handleClick;
var clicked = false;
function handleClick(e){
	clicked = true;
}


var hexagon;
var customShape;
var points = [];
var changeCursor = false;

init();
loop();


function Polygon(ctx, sides, size, Xcenter, Ycenter, col){
	this.ctx = ctx;
	this.sides = sides;
	this.size = size;
	this.Xcenter = Xcenter;
	this.Ycenter = Ycenter;
	this.col = col;
	this.points = [];
	this.makePoints = function(){
		var posX = this.Xcenter +  this.size * Math.cos(0),
			posY = this.Ycenter +  this.size *  Math.sin(0);
		this.points.push(new Point(posX,posY));
		for (var i = 1; i <= this.sides+1;i += 1) {
			var toX = this.Xcenter + this.size * Math.cos(i * 2 * Math.PI / this.sides),
				toY = this.Ycenter + this.size * Math.sin(i * 2 * Math.PI / this.sides);
    		this.points.push(new Point(toX,toY));
		}
	}
	this.draw = function(){
		this.ctx.beginPath();
		this.ctx.moveTo (this.points[0].x,this.points[0].y);

		for (var i = 1; i < this.points.length;i++) {
    		this.ctx.lineTo (this.points[i].x,this.points[i].y);
		}

		this.ctx.strokeStyle = this.col;
		this.ctx.lineWidth = 5;
		this.ctx.stroke();
		this.ctx.closePath();
		//this.ctx.fillStyle = '#fff';
		//this.ctx.fill();

		// drawing the dots for menu
		for(var i =0; i < this.points.length; i++){
			var point = this.points[i];
			this.ctx.beginPath();
			this.ctx.arc(point.x,point.y,point.rad,0,2*Math.PI,false);
			this.ctx.fillStyle="#fff";
			this.ctx.fill();
			this.ctx.closePath();
		}
	}
}

function Point(x,y){
	this.x = x;
	this.y = y;
	this.originalX = x;
	this.originalY = y;
	this.maxMoveDistance = 30;
	this.rad = 10;
}

function init(){
	// create the hexagon
	hexagon = new Polygon(ctx, 6, height/4, width/2, height/2, '#ffffff');
	customShape = new Polygon(ctx,0,0,0,0,'#ffffff');
	hexagon.makePoints();

	// set menu items on right spot
	$("#menu h1").css({"position":"fixed", "top":height/2-10, "left":width/2-height/4, "width":height/2, "text-align":"center","color": "#fff", "font-size": "2em","visibility":"hidden"});
	console.log('hello');
	console.log($('#menu h1').css("position"));
}

function loop(){
	if(resized){
		width = window.innerWidth;
		height = window.innerHeight;
		canvas.width = width;
		canvas.height = height;
		init();
		resized=false;
	}
	ctx.fillStyle = 'rgb(70,70,70)';
	ctx.fillRect(0,0,width,height);

	if(clicked){
		customShape.points.push(new Point(clientX, clientY));
		clicked = false;
	}
	for(var i = 0; i < hexagon.points.length; i++){
		var query = "#menu h1:nth-child("+(i+1)+")";
		alterPointPosition( hexagon.points[i], $(query));
	}
	hexagon.draw();
	if(changeCursor){
		$("body").css({"cursor":"pointer"});
		changeCursor = false;
	} else{
		$("body").css({"cursor":"default"});
	}
	requestAnimationFrame(loop);
}

function distance(x1,y1,x2,y2){
	var dx = x1-x2;
	var dy = y1-y2;
	return Math.sqrt(dx*dx+dy*dy);
}

function alterPointPosition(point, menuItem){
	var dPointClient = distance(point.x,point.y,clientX,clientY);
	var dPointOriginal = distance(point.x,point.y,point.originalX,point.originalY);
	var dOriginalClient = distance(clientX,clientY,point.originalX,point.originalY);
	if(dPointClient < 50){
		menuItem.css({"visibility":"visible"});
		changeCursor = true;
		if(dPointOriginal <= point.maxMoveDistance || dOriginalClient < dPointOriginal){
			if(point.x <= clientX){
				point.x += 1;
			} else{
				point.x -= 1;
			}
			if(point.y <= clientY){
				point.y += 1;
			} else{
				point.y -= 1;
			}
		}
	} else{
			menuItem.css({"visibility":"hidden"});
			point.rad = 10;
			if(point.x < point.originalX){
				point.x += 1;
			} 
			if(point.x > point.originalX){
				point.x -=1;
			}
			if(point.y < point.originalY){
				point.y += 1;
			} 
			if(point.y > point.originalY){
				point.y -=1;
			}
	}
}


window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;