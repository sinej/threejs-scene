import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {DoubleSide} from "three";

const canvas = document.querySelector('#three-canvas');
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true, // 그래픽을 부드럽게 처리함.
});

renderer.setSize(window.innerWidth, window.innerHeight); // renderer 사이즈를 window 사이즈로.
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1); // 고해상도 디스플레이에서는 이미지가 선명하게 해줌. (맥 해상도)
renderer.shadowMap.enabled = true;


// scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('white');

// camera
const camera = new THREE.PerspectiveCamera(
  75, // fov
  window.innerWidth / window.innerHeight, // aspect
  0.1, // near
  1000 // far
);

camera.position.set(-7, 3, 7);

scene.add(camera); // camera 세팅

// controls
const controls = new OrbitControls(camera, renderer.domElement);

// light
const ambientLight = new THREE.AmbientLight('white', 1);

scene.add(ambientLight);

const directionLight = new THREE.DirectionalLight('white', 3);
directionLight.position.set(-3, 5, 1);
directionLight.castShadow = true;

scene.add(directionLight);

// mesh
const boxMesh = new THREE.Mesh(
  new THREE.BoxGeometry(2,2,2), // geometry 모양
  // new THREE.MeshBasicMaterial({color: 'firebrick'})// material 재질
  new THREE.MeshLambertMaterial({
    color: "firebrick",
    side: THREE.DoubleSide
  })
);

boxMesh.position.set(0, 1, 0);
boxMesh.castShadow = true
scene.add(boxMesh); // boxMesh 세팅

const groundMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),// geometry
  // new THREE.MeshBasicMaterial({color : "#092e66"})
  new THREE.MeshLambertMaterial({
    color: "#092e66",
    side: THREE.DoubleSide
  })
);

// groundMesh.rotation.x = THREE.MathUtils.degToRad(-90);
// or
groundMesh.rotation.x = -Math.PI / 2;
groundMesh.receiveShadow = true;
scene.add(groundMesh);

camera.lookAt(boxMesh.position);

// draw

let boxMeshY = 1;

const clock = new THREE.Clock();

function draw () {

  const delta = clock.getDelta();
  boxMesh.position.y += delta * 3;
  if(boxMesh.position.y > 10) {
    boxMesh.position.y = 1;
  }

  // boxMesh.position.y += 0.01;
  controls.update();
  renderer.render(scene, camera);
  // 반복 호출
  // window.requestAnimationFrame(draw);
  renderer.setAnimationLoop(draw);
}

draw();

