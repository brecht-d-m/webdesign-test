var resized = false;
window.addEventListener('resize', function(){
	resized = true;
}, true);

var zooming=false;
$(document).bind('DOMMouseScroll mousewheel',function(e) {
	if(zooming){
  		alterContentAfterScroll();
	}
});

$(document ).on( "keydown", function( event ) {
  if(event.which == 17){
  	zooming = true;
  }
});

$(document ).on( "keyup", function( event ) {
  if(event.which == 17){
  	zooming = false;
  }
});



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


var polygon;
var numberOfMenuElements = 6;
var points = [];
var pointFollowSpeed = 1.5;
var surroundingFieldPoint = 70;
var indexLockedPoint = -1;
var menuAnimationColors = ['#7ACEEB','#7AEBC1','#EBD07A','#EB857A','#7A89EB','#9AC274'];
var menuAnimation = false;
var endAnimation = false;
var indexPointClicked = 0;
var changeCursor = false;
var query;
var smallPolygon;
var boolFillPolygon = false;
var boolFillSmallPolygon = false;

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
	this.makePoints = function(size){
		this.points = [];
		var posX = this.Xcenter +  this.size * Math.cos(0),
			posY = this.Ycenter +  this.size *  Math.sin(0);
		var point = new Point(posX,posY);
		if(size > 0){
			point.rad = size;
		}
		this.points.push(point);
		for (var i = 1; i < this.sides;i++) {
			var toX = this.Xcenter + this.size * Math.cos(i * 2 * Math.PI / this.sides),
				toY = this.Ycenter + this.size * Math.sin(i * 2 * Math.PI / this.sides);
			point = new Point(toX,toY);
			if(size > 0){
				point.rad = size;
			}
    		this.points.push(point);
		}
	}
	this.draw = function(){
		this.ctx.beginPath();
		this.ctx.moveTo (this.points[0].x,this.points[0].y);

		for (var i = 1; i < this.points.length;i++) {
    		this.ctx.lineTo (this.points[i].x,this.points[i].y);
		}
		this.ctx.lineTo(this.points[0].x, this.points[0].y);

		this.ctx.strokeStyle = this.col;
		this.ctx.lineWidth = 5;
		this.ctx.stroke();
		this.ctx.closePath();
		if(boolFillPolygon){
			if(!boolFillSmallPolygon){
				this.ctx.fillStyle = menuAnimationColors[indexPointClicked];
			} else{
				this.ctx.fillStyle = "rgb(70,70,70)";
			}
			this.ctx.fill();
		}

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
	// create the polygon
	polygon = new Polygon(ctx, numberOfMenuElements, height/4, width/2, height/2, '#ffffff');
	customShape = new Polygon(ctx,0,0,0,0,'#ffffff');
	polygon.makePoints();
	$("#menu h1").css({"position":"fixed", "top":height/2-10, "left":width/2-height/4, "width":height/2, "text-align":"center","color": "#fff", "font-size": "2em","visibility":"hidden"});
	$("#main div").css({"visibility" : "hidden"});
	$( "#main div" ).each(function( index ) {
  		$(this).css({"visibility" : "hidden"});
  		var heightEl = $(this).height();
  		if(height > heightEl){
  			$(this).css({"position":"fixed", "top":height/2 -heightEl/2});
  		} else{
  			$(this).css({"margin-bottom":200});
  		}
  		var diffHeight = height - heightEl;
  		if(diffHeight < 400 && diffHeight > 0){
  			$(this).css({"margin-bottom":200-diffHeight/2,"position":"static"});
  		}
	});
}

function alterContentAfterScroll(){
	width = window.innerWidth;
	height = window.innerHeight;
	$( "#main div" ).each(function( index ) {
  		var heightEl = $(this).height();
  		if(height > heightEl){
  			$(this).css({"position":"fixed", "top":height/2 -heightEl/2});
  		} else{
  			$(this).css({"position":"static"});
  		}
	});
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
	if(!menuAnimation){
		for(var i = 0; i < polygon.points.length; i++){
			query = "#menu h1:nth-child("+(i+1)+")";
			alterPointPosition( polygon.points[i], $(query), i);
			if(menuAnimation){
				boolFillPolygon = true;
				fillPolygon();
				indexPointClicked = i;
				break;
			}
		}
		polygon.draw();
		if(changeCursor){
			$("body").css({"cursor":"pointer"});
			changeCursor = false;
		} else{
			$("body").css({"cursor":"default"});
		}
	} else {
		animateAfterClick();
	}
	if(!endAnimation){
		requestAnimationFrame(loop);
	} else{
		displayPage($(query));
	}
}

function distance(x1,y1,x2,y2){
	var dx = x1-x2;
	var dy = y1-y2;
	return Math.sqrt(dx*dx+dy*dy);
}

function alterPointPosition(point, menuItem, indexPoint){
	var dPointClient = distance(point.x,point.y,clientX,clientY);
	var dPointOriginal = distance(point.x,point.y,point.originalX,point.originalY);
	var dOriginalClient = distance(clientX,clientY,point.originalX,point.originalY);
	if(dPointClient < 70){
		if(indexLockedPoint == -1 || indexLockedPoint == indexPoint){
			menuItem.css({"visibility":"visible"});
			changeCursor = true;
			if(clicked){
				menuAnimation = true;
				return;
			}
			indexLockedPoint = indexPoint;
			var angle = Math.atan2(point.y - clientY , point.x - clientX);
			var oldX, oldY;
			oldX = point.x;
			oldY = point.y;
			point.x -= 3 *dPointClient/dOriginalClient*Math.cos(angle);
			point.y -= 3 *Math.sin(angle);
			if(oldX > point.x){
				if(point.x < clientX) point.x = clientX;
			} else {
				if(point.x > clientX) point.x = clientX;
			}
			if(oldY > point.y){
				if(point.y < clientY) point.y = clientY;
			} else {
				if(point.y > clientY) point.y = clientY;
			}
			if(distance(point.x, point.y,point.originalX, point.originalY)>surroundingFieldPoint){
				angle = Math.atan2(point.y - point.originalY , point.x - point.originalX);
				point.x = point.originalX + surroundingFieldPoint * Math.cos(angle);
				point.y = point.originalY + surroundingFieldPoint * Math.sin(angle);
			}
		}
	} else{
			if(indexLockedPoint == indexPoint){
				indexLockedPoint = -1;
			}
			menuItem.css({"visibility":"hidden"});
			point.rad = 10;
			if(point.x < point.originalX){
				point.x += pointFollowSpeed;
			} 
			if(point.x > point.originalX){
				point.x -=pointFollowSpeed;
			}
			if(point.y < point.originalY){
				point.y += pointFollowSpeed;
			} 
			if(point.y > point.originalY){
				point.y -=pointFollowSpeed;
			}
	}
}

function fillPolygon(){
	$("#menu h1").css({"color":"#222222"});
	for(var i = 0; i < polygon.points.length; i++){
		var point = polygon.points[i];
		point.x = point.originalX;
		point.y = point.originalY;
	}
}

function animateAfterClick(){
	$("body").css({"cursor":"default"});
	if(polygon.size <= 2*height && polygon.size <= 2*width){
		polygon.size += 50;
		polygon.makePoints();
	} else {
		$("#menu h1").animate({opacity:0},1000);
		endAnimation = true;
	}
	polygon.draw();
}

function displayPage(menuElement){
	var query = '#' + menuElement.text().replace(/ /g,'_');
	$(query).css({"visibility":"visible"});
	$(query).animate({opacity:1},1000);
	smallPolygon = new Polygon(ctx, numberOfMenuElements, 50, width/2, height-100, '#ffffff');
	smallPolygon.makePoints(5);
	boolFillSmallPolygon = true;
	smallPolygon.draw();
}

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
