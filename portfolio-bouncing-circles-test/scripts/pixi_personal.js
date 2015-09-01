$(function(){
    init();
});

function init() {
    // create an new instance of a pixi stage
    stage = new PIXI.Stage(0xFFFFFF);

    var rendererOptions = {
        antialiasing: true,
        transparent: true,
        resolution: 1
    };


    // Determine viewport width & height
    var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth,
        y = w.innerHeight || e.clientHeight || g.clientHeight;
        if ( x < 800 || y < 600){
            directlyToHome();
            page = "home";
            return;
        }

    // create a renderer passing in the options
    renderer = new PIXI.CanvasRenderer(x, y, rendererOptions);

    // add the renderer view element to the DOM
    document.body.appendChild(renderer.view);

    requestAnimFrame(animate);

    // create the home button
    var texture = PIXI.Texture.fromImage("images/home.png");
    // create a new Sprite using the texture
    var home = new PIXI.Sprite(texture);

    // center the sprites anchor point
    home.anchor.x = 0.5;
    home.anchor.y = 0.5;
    home.position.x = 60*x / 100;
    home.position.y = 70*y / 100;
    home.interactive = true;
    home.buttonMode = true;
    home.defaultCursor = "pointer";
    home.alpha=0.6;
    home.mouseover= function(interactionData){
            homeBoolean = true;
            home.alpha=1;
    };
    home.mouseout = function(interactionData){
        homeBoolean = false;
        home.alpha=0.6;
    };
    home.mousedown = function(interactionData){
        initHome();
        home.mouseover = 0;
        home.mouseout = 0;
        page = "home";
    };

    stage.addChild(home);



    // create the balls , the balls are the images.
    createBalls();

    // create the circles
    createCircles();




    function animate() {
        requestAnimFrame(animate);
        pageAnimations();
        renderer.render(stage);

    }

    function pageAnimations(){
        if(page == "index"){
            updateCircles();
            updateBalls();
        }
        if(page == "home"){

        }
    }

};

var stage = 0,
    renderer =0,
    circles = [],
    balls = [],
    gravity = 0.1,
    slowDown = 0.999,
    bumpPower = 1,
    wallPower = 0.95,
    numCircles = Math.random()*5+5,
    mouseDown = false,
    homeBoolean = false,
    page = "index";


function collide(a , b){
    var dx = b.x - a.x,
        dy = b.y - a.y,
        d = Math.sqrt(dx*dx + dy*dy),
        ux = dx/d, // cos
        uy = dy/d; // sin

    if(d < a.radius + b.radius){
        a.vx -= ux * bumpPower;
        a.vy -= uy * bumpPower;
        b.vx += ux * bumpPower;
        b.vy += uy * bumpPower;
    }
}


function createCircles() {
    var i;
    for (i = 0; i < numCircles; i++) {
        var circle = new PIXI.Circle(Math.random() * renderer.view.width, -10, 30);
        circle.vx = Math.random()*1;
        circle.vy = Math.random()*1;
        circles.push(circle);
    }
}

function createBalls() {
    var i;
    for (i = 0; i < numCircles; i++) {
        // create a texture from an image path
        var texture = PIXI.Texture.fromImage("images/ball_60x60.png");
        // create a new Sprite using the texture
        var ball = new PIXI.Sprite(texture);

        // center the sprites anchor point
        ball.anchor.x = 0.5;
        ball.anchor.y = 0.5;
        ball.alpha = 1;
        ball.rotation = Math.random();
        ball.interactive=true;
        ball.mousedown  = function(mouseData){
            gravity *= -1;
        }
        balls.push(ball);

        stage.addChild(ball);

    }
}

function updateCircles() {
    var i;
    for( i=0; i < circles.length ; i++ ){
        if(homeBoolean){
            return;
        }
        var circle = circles[i];
        circle.x += circle.vx;
        circle.y += circle.vy;
        circle.vy += gravity;

        for( var j = i+1; j < circles.length; j++){
            collide(circle, circles[j]);
        }

        // slowing it down, else they keep moving
        circle.vx *= slowDown;
        circle.vy *= slowDown;

        //bottom bounce
        if (circle.y + circle.radius >= renderer.height) {
            circle.y = renderer.height - circle.radius;
            circle.vy = -Math.abs(wallPower*circle.vy);
        }

        //right bounce
        if (circle.x + circle.radius >= renderer.width) {
            circle.x = renderer.width - circle.radius;
            circle.vx = -Math.abs(wallPower*circle.vx);
        }

        //left bounce
        if (circle.x - circle.radius <= 0) {
            circle.x = circle.radius;
            circle.vx = Math.abs(wallPower*circle.vx);
        }

        //up bounce
        if (circle.y - circle.radius <= 0) {
            circle.y = circle.radius;
            circle.vy = Math.abs(wallPower*circle.vy);
        }

    }
}

function updateBalls(){
    var i;
    for( i=0; i < numCircles ; i++ ){
        balls[i].x = circles[i].x;
        balls[i].y = circles[i].y;
        balls[i].radius = circles[i].radius;
        if( ! homeBoolean ){
            balls[i].alpha = 1;
            balls[i].rotation += (circles[i].vx * circles[i].vy) / 100;
        } else{
            if ( balls[i].alpha >= 0.02){
                balls[i].alpha -= 0.02;
            } else{
                balls[i].alpha = 0;
            }
        }
    }
}

function initHome(){
    for (var i = stage.children.length - 1; i >= 0; i--) {
        stage.removeChild(stage.children[i]);
    };
    circles = 0;
    balls = 0;
    changeAppearance();
}

function changeAppearance(){
    var home = { home: true};
    window.history.pushState(home, "Home", "home.html");
    $("div#background-box").animate({"margin-top": 0}, 2000);
    $("canvas").css({"z-index": -1000});
    $("div#main").css({"display":"block"});
    $("canvas").remove();
    startRocketAnim();
}

function directlyToHome(){
    $("div#background-box").css({"margin-top": 0});
    $("canvas").css({"z-index": -1000});
    $("div#main").css({"display":"block"});
}

window.onpopstate = function(event) {
    window.location.reload();
};


//SVG Animations

function startRocketAnim(){
$("#rocket").velocity(
    { 
      translateY:"100px", rotateZ:"45deg"
    },
    {
      duration:2000
    });
$("#orangeflames").velocity(
    {
        opacity:0.6, 
    },
    {
        duration:2000,
        loop:true
    });
$("#yellow").velocity(
    {
        opacity:0.4, 
    },
    {
        duration:1300,
        loop:true
    });

}