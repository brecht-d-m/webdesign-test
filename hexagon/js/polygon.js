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

var clientX = -1000, clientY =-1000;
$("body").mousemove(function(e){
	 var evt = e || event || window.event;
	 clientX = evt.clientX;
	 clientY = evt.clientY;
});

document.onclick = handleClick;
var clicked = false;
function handleClick(e){
	e.stopPropagation()
	clicked = true;
}


var polygon;
var polygonSize = height/4;
var numberOfMenuElements = 6;
var points = [];
var pointFollowSpeed = 1.5;
var surroundingFieldPoint = width/25;
var indexLockedPoint = -1;
var menuAnimationColors = ['#7ACEEB','#7AEBC1','#EBD07A','#EB857A','#7A89EB','#9AC274'];
var menuIcons = ['\uf201', '\uf0e0', '\uf135', '\uf0eb', '\uf007', '\uf121']; 
var menuAnimation = false;
var endAnimation = false;
var indexPointClicked = 0;
var changeCursor = false;
var query;
var smallPolygon;
var boolFillPolygon = false;
var boolFillSmallPolygon = false;
var boolBackToMain = false;
var bgcolor = "rgb(70,70,70)";
var h1Visible = true;

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
				bgcolor = menuAnimationColors[indexPointClicked];
				this.ctx.fillStyle = bgcolor;
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
			this.ctx.fillStyle="#FFF";
			this.ctx.fill();
			if(!menuAnimation) {
				ctx.fillStyle = "#7C7C7C";
				ctx.font = "18pt FontAwesome";
				ctx.fillText(menuIcons[i], point.x-ctx.measureText(menuIcons[i]).width/2, point.y+parseInt(ctx.font)/2/*ctx.measureText(menuIcons[i]).width/2*/);
			}
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
	this.rad = 20;
}

function init(){
	// create the polygon
	polygon = new Polygon(ctx, numberOfMenuElements, polygonSize, width/2, height/2, '#ffffff');
	if(width <= 2*polygon.size || height <= 2*polygon.size){
		(width<height)?polygon.size = width/2:polygon.size = height/2;
	}
	customShape = new Polygon(ctx,0,0,0,0,'#ffffff');
	polygon.makePoints();
	$("#title h1").css({"position":"fixed", "top":height/2-10, "left":width/2-height/4, "width":height/2, "text-align":"center","color": "#fff", "font-size": "2em"});
	$("#menu h2").css({"position":"fixed", "top":height/2-10, "left":width/2-height/4, "width":height/2, "text-align":"center","color": "#fff", "font-size": "2em","visibility":"hidden"});
	$("#main div").css({"visibility" : "hidden"});
	$( "#main div" ).each(function( index ) {
  		$(this).css({"visibility" : "hidden"});
  		var heightEl = $(this).height();
  		if(height > heightEl){
  			if(height-400 > heightEl){
  				$(this).css({"position":"fixed", "top":height/2 -heightEl/2});
  			} else{
  				$(this).css({"position":"fixed","top":30,"height":height-200,"width":900,"overflow":"auto"});
  				$(this).niceScroll().hide();
  			}
  		} else{
  			$(this).css({"position":"fixed", "top":30,"height":height-200,"width":900,"overflow":"auto"});
  			$(this).niceScroll().hide();
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
			query = "#menu h2:nth-child("+(i+1)+")";
			alterPointPosition( polygon.points[i], $(query), i);
			if(menuAnimation){
				boolFillPolygon = true;
				fillPolygon();
				indexPointClicked = i;
				break;
			}
		}
		if(h1Visible) {
			$("#title h1").css({"visibility":"visible"});	
		} else {
			$("#title h1").css({"visibility":"hidden"});
			h1Visible = true;
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
	clicked = false;
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
		h1Visible = false;
	} else{
			if(indexLockedPoint == indexPoint){
				indexLockedPoint = -1;
			}
			menuItem.css({"visibility":"hidden"});
			point.rad = 20;
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
	$("#menu h2").css({"color":"#222222"});
	for(var i = 0; i < polygon.points.length; i++){
		var point = polygon.points[i];
		point.x = point.originalX;
		point.y = point.originalY;
	}
}

function animateAfterClick(){
	clicked = false;
	$("#title h1").css({"visibility":"hidden"});
	$("body").css({"cursor":"default"});
	if(polygon.size <= 2*height || polygon.size <= 2*width){
		polygon.size += 50;
		polygon.makePoints();
	} else {
		$("#menu h2").animate({opacity:0},1000);
		endAnimation = true;
	}
	polygon.draw();
}

function displayPage(menuElement){
	$(query).getNiceScroll().show();
	var query = '#' + menuElement.text().replace(/ /g,'_');
	$(query).css({"visibility":"visible"});
	$(query).animate({opacity:1},1000);
	smallPolygon = new Polygon(ctx, numberOfMenuElements, 50, width/2, height-100, '#ffffff');
	smallPolygon.makePoints(5);
	boolFillSmallPolygon = true;
	smallPolygon.draw();
	smallPolygonInteraction();
}

function smallPolygonInteraction(){
	var dClientCenter = distance(clientX,clientY,smallPolygon.Xcenter,smallPolygon.Ycenter);
	if(dClientCenter <= smallPolygon.size){
		if(clicked){
			clicked = false;
			$("body").css({"cursor":"default"});
			$("#menu h2").animate({opacity:1},1000);
			goToMainMenu();
			return;
		}
		$("body").css({"cursor":"pointer"});
		for(var i = 0 ; i < smallPolygon.points.length; i++){
			var point = smallPolygon.points[i];
			var angle = Math.atan2(point.y - smallPolygon.Ycenter , point.x - smallPolygon.Xcenter);
			angle += 0.01;
			point.x = smallPolygon.Xcenter + smallPolygon.size * Math.cos(angle);
			point.y = smallPolygon.Ycenter + smallPolygon.size * Math.sin(angle);
		}
		ctx.fillStyle = bgcolor;
		ctx.fillRect(0,0,canvas.width,canvas.height);
		smallPolygon.draw();
	} else{
		clicked = false;
		$("body").css({"cursor":"default"});
	}
	if(!clicked){
		requestAnimationFrame(smallPolygonInteraction);
	}
}

function goToMainMenu(){
	ctx.fillStyle = "rgb(70,70,70)";
	ctx.fillRect(0,0,canvas.width,canvas.height);
	$("#main div").css({"visibility":"hidden"});
	if(polygon.size >= polygonSize){
		polygon.size -= 50;
	}
	if(polygon.size <= polygonSize){
		polygon.size = polygonSize;
	}
	polygon.makePoints();
	boolFillSmallPolygon = false;
	boolFillPolygon = true;
	polygon.draw();
	if(polygon.size == polygonSize){
		menuAnimation = false;
		endAnimation = false;
		indexLockedpoint = -1;
		boolFillPolygon = false;
		$("#menu h2").css({"color":"#fff","visibility":"hidden","opacity":1});
		loop();
		return;
	}
	requestAnimationFrame(goToMainMenu);
}

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
