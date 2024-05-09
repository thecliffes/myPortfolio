import './style.css'
//import all from three.js library
import * as THREE from 'three';
//imports function to be able to use mouse on website
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


//instantiate a scene
const scene = new THREE.Scene();

//instantiate a perspective camera (which micks what human eyes see)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000 );

//instantiate a renderer to render graphics
const renderer = new THREE.WebGLRenderer({
  //uses canvas with id as bg to render
  canvas: document.querySelector('#bg')
})

//sets pixel ratio to window device ratio. Sets canvas to a full screen canvas as well.
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
//sets camera along the z axis
camera.position.setZ(30);





//creates one of the inbuilt geometrys, in this case a 'Torus' and adds material.
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({color: 0xFF6347});
//creates thing we will add to the scene
const torus = new THREE.Mesh(geometry, material);
scene.add(torus)

//creates lighting that points in all directions
const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(5,5,5)

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight)

//adds a light helper to help with light positioning and also adds a grid
const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200, 50);
//scene.add(lightHelper, gridHelper)

//adds functionality to be able to use mouse
const controls = new OrbitControls(camera, renderer.domElement);

//populate map with random objects
function addStar(){
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshStandardMaterial({color:0xFFFFFF})
    const star = new THREE.Mesh(geometry, material);

    //randomly distributes stars. This is done by filling an array with  3 random values
    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
    star.position.set(x, y, z);
    scene.add(star)
}

//choose how many stars to add
Array(200).fill().forEach(addStar)

//avatar
const jeffTexture = new THREE.TextureLoader().load('bald.jpg');

const jeff = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial({map: jeffTexture})
)

scene.add(jeff);

//moon
const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture //adds depth to the moon to create a realistic feel (but it doesnt work for some reason)
  })
);
moon.position.z = 30;
moon.position.setX(-10);
scene.add(moon);


function moveCamera(){
  //gets current scroll position of the user
  const t = document.body.getBoundingClientRect().top;

  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  jeff.rotation.y += 0.01;
  jeff.rotation.z += 0.01;

  camera.position.z = t*-0.01;
  camera.position.x = t*-0.0002;
  camera.position.y = t*-0.0002;
}

//uses function every time user scrolls
document.body.onscroll = moveCamera

//load a background into the scene
const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;

//constants runs a function
function animate(){
  requestAnimationFrame(animate);
  //rotates the torus
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;


  controls.update();
  renderer.render(scene, camera);
}

animate();
