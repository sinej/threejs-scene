import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

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

// light
const ambientLight = new THREE.AmbientLight('white', 1);
const pointLight = new THREE.PointLight('white', 100, 100);

pointLight.castShadow = true;
pointLight.position.y = 10;

scene.add(ambientLight, pointLight);

// mesh
const groundMesh = new THREE.Mesh(
  new THREE.BoxGeometry(50, 0.1, 50),
  new THREE.MeshLambertMaterial({
    color: 'red',
    side: THREE.DoubleSide
  })
);

groundMesh.receiveShadow = true;
groundMesh.position.y = -0.05

scene.add(groundMesh);

// 방 바닥 만들기
const floorMesh = new THREE.Mesh(
  new THREE.BoxGeometry(5, 0.4, 5),
  new THREE.MeshLambertMaterial()
);
floorMesh.castShadow = true;
floorMesh.position.y = 0.2;
scene.add(floorMesh);

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

