import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

const gltfLoader = new GLTFLoader();

let container,
  camera,
  scene,
  renderer,
  brain,
  flash,
  rainGeo,
  rain,
  clicked = false;
const clouds = [];

let mouseX = 0,
  mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

const fast = document.querySelector("#fast");
const thunder = document.querySelector("#thunder");

document.addEventListener("mousemove", onDocumentMouseMove);
document.addEventListener("click", onDocumentClick);

init();
animate();

function init() {
  container = document.createElement("div");
  document.body.appendChild(container);

  // Camera
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1250);
  camera.position.z = 4;
  camera.focalLength = 3;
  //

  // Background
  scene = new THREE.Scene();

  const ambient = new THREE.AmbientLight(0x555555);
  scene.add(ambient);

  const directionalLight = new THREE.DirectionalLight(0xffeedd);
  directionalLight.position.set(0, 0, 1);
  scene.add(directionalLight);
  //

  // Clouds
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load("../static/textures/smoke.png", texture => {
    const cloudGeo = new THREE.PlaneBufferGeometry(500, 500);
    const cloudMaterial = new THREE.MeshLambertMaterial({
      map: texture,
      transparent: true,
    });

    for (let p = 0; p < 20; p++) {
      const cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
      cloud.position.set(Math.random() * 800 - 400, 400, Math.random() * 500 - 450);
      cloud.rotation.x = 1.16;
      cloud.rotation.y = -0.12;
      cloud.rotation.z = Math.random() * 360;
      cloud.material.opacity = 0.6;
      scene.add(cloud);
      clouds.push(cloud);
    }
  });
  //

  // Thunder
  flash = new THREE.PointLight(0x062d89, 30, 500, 1.7);
  flash.position.set(200, 300, 100);
  scene.add(flash);
  //

  // Rain
  rainGeo = new THREE.Geometry();
  for (let i = 0; i < 600; i++) {
    const rainDrop = new THREE.Vector3(Math.random() * 400 - 200, Math.random() * 500 - 250, Math.random() * 400 - 200);
    rainDrop.velocity = 0;
    rainGeo.vertices.push(rainDrop);
  }

  const rainMaterial = new THREE.PointsMaterial({
    color: 0xaaaaaa,
    size: 0.3,
    transparent: true,
  });
  rain = new THREE.Points(rainGeo, rainMaterial);
  scene.add(rain);
  //

  // Brain Reflection
  const lavaPath = "../static/textures/cube/lava/";
  const lavaUrls = [
    lavaPath + "px.png",
    lavaPath + "nx.png",
    lavaPath + "py.png",
    lavaPath + "ny.png",
    lavaPath + "pz.png",
    lavaPath + "nz.png",
  ];
  const lavaCube = new THREE.CubeTextureLoader().load(lavaUrls);
  const lavaMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, envMap: lavaCube });

  const waterPath = "../static/textures/cube/water/";
  const waterUrls = [
    waterPath + "px.png",
    waterPath + "nx.png",
    waterPath + "py.png",
    waterPath + "ny.png",
    waterPath + "pz.png",
    waterPath + "nz.png",
  ];
  const waterCube = new THREE.CubeTextureLoader().load(waterUrls);
  const waterMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, envMap: waterCube });

  // Brain
  gltfLoader.load("../static/objects/brain_areas/scene.gltf", obj => {
    obj.scene.scale.set(2, 2, 2);
    obj.scene.position.set(0, -1.2, 0);
    obj.scene.traverse(o => {
      if (o.isMesh) o.material = lavaMaterial;
    });

    scene.add(obj.scene);
    brain = obj.scene;

    brain.lava = lavaMaterial;
    brain.water = waterMaterial;
  });
  //

  // Renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  scene.fog = new THREE.FogExp2(0x11111f, 0.002);
  renderer.setClearColor(scene.fog.color);
  renderer.setSize(window.innerWidth, window.innerHeight);
  //

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(e) {
  mouseX = (e.clientX - windowHalfX) / 100;
  mouseY = (e.clientY - windowHalfY) / 100;
}

function onDocumentClick() {
  clicked = !clicked;
}

function animate() {
  requestAnimationFrame(animate);

  render();
}

function render() {
  const timer = 0.0001 * Date.now();

  camera.position.x += (mouseX - camera.position.x) * 0.05;
  camera.position.y += (-mouseY - camera.position.y) * 0.05;
  camera.lookAt(scene.position);

  // Animation
  if (!clicked) {
    thunder.pause();
    (async () => await fast.play())();

    brainAnimation(timer);
    calmCloudAnimation();
    noRainAnimation();
  }

  if (clicked) {
    fast.pause();
    (async () => await thunder.play())();

    brain.traverse(o => {
      if (o.isMesh) o.material = brain.water;
    });

    if (brain.scale.x >= 0.5) brain.scale.x -= 0.002;
    if (brain.scale.y >= 0.5) brain.scale.y -= 0.002;
    if (brain.scale.z >= 0.5) brain.scale.z -= 0.002;

    brain.rotation.set(0, 0, 0);

    // start rain and thunder hard
    rainAnimation();
    madCloudAnimation();

    // expand brain and bright white light
    // possibly brain explode?
  }
  //

  renderer.render(scene, camera); // or effect can render scene
}

function brainAnimation(timer) {
  brain.traverse(o => {
    if (o.isMesh) o.material = brain.lava;
  });

  brain.scale.x = brain.scale.y = brain.scale.z = 0.5 * Math.abs(Math.cos(40 * timer)) + 1;
  brain.rotation.set(0, 0, 0);

  if (Math.round(timer * 100) % 30 == Math.round(Math.random() * 10)) {
    brain.rotateY(Math.random() * 135);
    brain.scale.x = Math.random() * 24;
  } else if (Math.round(timer * 100) % 30 == Math.round(Math.random() * 10)) {
    brain.rotateX(Math.random() * 135);
    brain.scale.z = Math.random() * 13;
    brain.scale.y = Math.random() * 3;
  }
}

function calmCloudAnimation() {
  clouds.forEach(p => {
    p.rotation.z -= 0.00075;
  });
}

function madCloudAnimation() {
  clouds.forEach(p => {
    p.rotation.z -= 0.0025;
  });

  if (Math.random() > 0.93 || flash.power > 100) {
    if (flash.power < 100) flash.position.set(Math.random() * 400, 300 + Math.random() * 200, 100);
    flash.power = 50 + Math.random() * 500;
  }
}

function rainAnimation() {
  rain.traverse(child => {
    child.visible = true;
  });

  rainGeo.vertices.forEach(p => {
    p.velocity -= 0.1 + Math.random() * 0.1;
    p.y += p.velocity;
    if (p.y < -200) {
      p.y = 200;
      p.velocity = 0;
    }
  });
  rainGeo.verticesNeedUpdate = true;
  rain.rotateY(0.002);
}

function noRainAnimation() {
  rain.traverse(child => {
    child.visible = false;
  });
}
