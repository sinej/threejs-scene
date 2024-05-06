import * as THREE from "three";
// import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { MeshObject } from "./meshObject";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as CANNON from "cannon-es";

// renderer
const canvas = document.querySelector('#three-canvas');
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.innerWidth / window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('white');

// camera
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, 3, 7);
scene.add(camera);


// light
const ambientLight = new THREE.AmbientLight('white', 1);
const pointLight = new THREE.PointLight('white', 100, 100);

pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 2048;
pointLight.shadow.mapSize.height = 2048;
pointLight.position.y = 10;

scene.add(ambientLight, pointLight);

// cannon
const cannonWorld = new CANNON.World();
cannonWorld.gravity.set(0, -10, 0);

const defaultCannonMaterial = new CANNON.Material('default');
const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultCannonMaterial,
  defaultCannonMaterial, {
    friction: 1,
    restitution: 0.2,
  }
);

cannonWorld.defaultContactMaterial = defaultContactMaterial;

const cannonObjects = [];


// mesh
const ground = new MeshObject({
  scene,
  cannonWorld,
  cannonMaterial: defaultCannonMaterial,
  name: 'ground',
  width: 50,
  height: 0.1,
  depth: 50,
  color: '#092e66',
  y: -0.05,
  differenceY: "0",
});

const floor = new MeshObject({
  scene,
  cannonWorld,
  cannonMaterial: defaultCannonMaterial,
  name: 'floor',
  width: 5,
  height: 0.4,
  depth: 5,
  differenceY: "0"
});

const wall1 = new MeshObject({
  scene,
  cannonWorld,
  cannonMaterial: defaultCannonMaterial,
  name: 'wall1',
  width: 5,
  height: 3,
  depth: 0.2,
  z: -2.4,
});

const wall2 = new MeshObject({
  scene,
  cannonWorld,
  cannonMaterial: defaultCannonMaterial,
  name: 'wall2',
  width: 0.2,
  height: 3,
  depth: 4.8,
  x: 2.4,
  z: 0.1,
});

// const controls = new OrbitControls(camera, renderer.domElement);
const gltLoader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader()


const desk = new MeshObject({
  scene,
  cannonWorld,
  cannonMaterial: defaultCannonMaterial,
  mass: 20,
  loader: gltLoader,
  name: 'desk',
  width: 1.8,
  height: 0.8,
  depth: 0.75,
  x: 1.2,
  z: -1.9,
  modelSrc: '/models/desk.glb',
});

const lamp = new MeshObject({
  scene,
  cannonWorld,
  cannonMaterial: defaultCannonMaterial,
  mass: 10,
  loader: gltLoader,
  name: 'lamp',
  width: 0.5,
  height: 1.8,
  depth: 0.5,
  z: -1.7,
  modelSrc: '/models/lamp.glb',
});

const roboticVaccum = new MeshObject({
  scene,
  cannonWorld,
  cannonMaterial: defaultCannonMaterial,
  mass: 10,
  loader: gltLoader,
  name: 'roboticVaccum',
  width: 0.5,
  height: 0.1,
  depth: 0.5,
  x: -1,
  modelSrc: '/models/vaccum.glb',
});

const magazine = new MeshObject({
  scene,
  cannonWorld,
  cannonMaterial: defaultCannonMaterial,
  mass: 0.5,
  loader: textureLoader,
  name: 'magazine',
  width: 0.2,
  height: 0.02,
  depth: 0.29,
  x: 0.7,
  y: 1.32,
  z: -2.2,
  rotationX: THREE.MathUtils.degToRad(52),
  mapSrc: '/models/magazine.jpg'
});

cannonObjects.push(ground, floor, wall1, wall2, desk, lamp, roboticVaccum, magazine);

function setLayout() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

let movementX = 0;
let movementY = 0;
function updateMovementValue(event) {
  movementX = event.movementX * delta;
  movementY = event.movementY * delta;
}

const euler = new THREE.Euler(0,0,0, 'YXZ');
const minPolarAngle = 0;
const maxPolarAngle = Math.PI; // 180도
function rotateCamera() {
  euler.setFromQuaternion(camera.quaternion);
  euler.y -= movementX;
  euler.x -= movementY;
  euler.x = Math.max(Math.PI/2 - maxPolarAngle, Math.min(Math.PI/2 - minPolarAngle, euler.x));

  movementX -= movementX * 0.2;
  movementY -= movementY * 0.2;

  if(Math.abs(movementX) < 0.1) movementX = 0;
  if(Math.abs(movementY) < 0.1) movementY = 0;

  camera.quaternion.setFromEuler(euler);
}

function setMode(mode) {
  document.body.dataset.mode = mode;

  if(mode === "game") {
    document.addEventListener('mousemove', updateMovementValue)
  } else if(mode === 'website') {
    document.removeEventListener('mousemove', updateMovementValue)
  }
}

// draw
const clock = new THREE.Clock();
let delta;
function draw() {
  delta = clock.getDelta();
  
  let cannonStepTime = 1/60;
  if(delta < 0.01) cannonStepTime = 1/120;
  cannonWorld.step(cannonStepTime, delta, 3);
  
  for(const object of cannonObjects) {
    if(object.cannonBody) {
      object.mesh.position.copy(object.cannonBody.position);
      object.mesh.quaternion.copy(object.cannonBody.quaternion);
    }
  }

  rotateCamera();
  renderer.render(scene, camera);
  renderer.setAnimationLoop(draw);
}

draw();

// events
window.addEventListener('resize', setLayout);

// click events

document.addEventListener('click', () => {
  canvas.requestPointerLock();
})

document.addEventListener('pointerlockchange', () => {

  if(document.pointerLockElement === canvas) {
    setMode('game');
  } else {
    setMode('website');
  }
})