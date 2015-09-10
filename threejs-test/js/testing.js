var resized = false;
window.addEventListener('resize', function(){
	resized = true;
}, true);

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 100, window.innerWidth/window.innerHeight, 0.1, 2000 );
camera.position.z = 1000;
var renderer = new THREE.WebGLRenderer({alpha:true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement )

// making the cubes
var cubes = [];
var geometry = new THREE.BoxGeometry( 100, 100, 100 );
var material = new THREE.MeshLambertMaterial( { color:0xffffff, shading: THREE.FlatShading } );
for(var i = 0; i < 5 ; i++){
	var cube = new THREE.Mesh( geometry, material );
	cube.position.x = -700 + i*300;
	scene.add( cube );
	cubes.push(cube);
}

light = new THREE.DirectionalLight( 0xffffff );
light.position.set( 1, 1, 1 );
scene.add( light );

light = new THREE.DirectionalLight( 0x666666 );
light.position.set( -1, -1, -1 );
scene.add( light );

light = new THREE.AmbientLight( 0x555555 );
scene.add( light );

// render on the canvas
var render = function () {
	if(resized == true) reset();
	requestAnimationFrame( render );
	for(var i in cubes){
		cubes[i].rotation.x += 0.01;
		cubes[i].rotation.y += 0.01;
	}	
	renderer.render(scene, camera);
};

var reset = function () {
	camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

render();