import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { MeshObject } from "./meshObject";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
// renderer
const canvas = document.querySelector('#three-canvas');
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.innerWidth / window.innerHeight);
renderer.shadowMap.enabled = true;

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

const controls = new OrbitControls(camera, renderer.domElement);
const loader = new GLTFLoader();


const desk = new MeshObject({
  scene,
  loader: loader,
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
  loader: loader,
  name: 'lamp',
  width: 0.5,
  height: 1.8,
  depth: 0.5,
  z: -1.7,
  modelSrc: '/models/lamp.glb',
});

const roboticVaccum = new MeshObject({
  scene,
  loader: loader,
  name: 'roboticVaccum',
  width: 0.5,
  height: 0.1,
  depth: 0.5,
  x: -1,
  modelSrc: '/models/vaccum.glb',
});

// light
const ambientLight = new THREE.AmbientLight('white', 1);
const pointLight = new THREE.PointLight('white', 100, 100);

pointLight.castShadow = true;
pointLight.position.y = 10;

scene.add(ambientLight, pointLight);


// mesh
const ground = new MeshObject({
  scene,
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
  name: 'floor',
  width: 5,
  height: 0.4,
  depth: 5,
  differenceY: "0"
});

const wall1 = new MeshObject({
  scene,
  name: 'wall1',
  width: 5,
  height: 3,
  depth: 0.2,
  z: -2.4
});

const wall2 = new MeshObject({
  scene,
  name: 'wall2',
  width: 0.2,
  height: 3,
  depth: 4.8,
  x: 2.4,
  z: 0.1,
});

// 방 바닥 만들기
// const floorMesh = new THREE.Mesh(
//   new THREE.BoxGeometry(5, 0.4, 5),
//   new THREE.MeshLambertMaterial()
// );
// floorMesh.castShadow = true;
// floorMesh.position.y = 0.2;
// scene.add(floorMesh);

// draw
const clock = new THREE.Clock();
function draw() {
  renderer.render(scene, camera);
  renderer.setAnimationLoop(draw);
}

draw();

function setLayout() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// events
window.addEventListener('resize', setLayout);

