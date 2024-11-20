import * as THREE from "https://esm.sh/three";
import { OrbitControls } from "https://esm.sh/three/addons/controls/OrbitControls.js";
import { FontLoader } from "https://esm.sh/three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "https://esm.sh/three/examples/jsm/geometries/TextGeometry.js";
import * as dat from "https://esm.sh/lil-gui"

/**
        *  Textures
        **/
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load("https://res.cloudinary.com/dcr0ilwho/image/upload/v1732110128/360_F_708162658_vNEL72LePHZ1HBA0UusYAESIhnwHUqkG_zwj2jq.jpg")
const envMap = textureLoader.load([
  'https://threejs.org/examples/textures/cube/skybox/posx.jpg',
  'https://threejs.org/examples/textures/cube/skybox/negx.jpg',
  'https://threejs.org/examples/textures/cube/skybox/posy.jpg',
  'https://threejs.org/examples/textures/cube/skybox/negy.jpg',
  'https://threejs.org/examples/textures/cube/skybox/posz.jpg',
  'https://threejs.org/examples/textures/cube/skybox/negz.jpg'
]);

/**
* Instantiation
**/
// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

const canvas = document.querySelector('canvas.webgl');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 1, 10000);
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
* Fonts
**/

const fontLoader = new FontLoader();

// Create a metallic material
const material = new THREE.MeshStandardMaterial({
  color: 0xAAAAAA,  // Base color (light gray)
  metalness: 1,   // Metallic (1)
  roughness: 0.1,   // Smooth surface
  envMap: envMap    // Environment map for reflections
});

const lightstrength = 250

fontLoader.load(
  'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
  (font) => {
    const textGeometry = new TextGeometry(
      'SpotLight',
      {
        font: font,
        size: 1,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5
      }
    );
    const materialfortext = new THREE.MeshStandardMaterial({map : texture});
    materialfortext.roughness = 1;
    materialfortext.metalness = 0.1;
    const text = new THREE.Mesh(textGeometry,   materialfortext);
    textGeometry.center();
    scene.add(text);
  }
);

/**
* Add Objects
**/

const evenGroup = new THREE.Group()
const oddGroup = new THREE.Group()

const planeGeometry = new THREE.PlaneGeometry(1, 1);

for (let i = 0; i < 500; i++) {
  const plane = new THREE.Mesh(planeGeometry, material);
  // scene.add(plane);
  plane.position.x = (Math.random() - 0.5) * 30;
  plane.position.y = (Math.random() - 0.5) * 30;
  plane.position.z = (Math.random() - 0.5) * 30;
  
  // Make the plane look at the origin (0, 0, 0)
  plane.lookAt(0, 0, 0);

  // Optional: Randomize rotation around its axis after facing the origin
  const randomRotation = Math.random() * Math.PI;
  plane.rotation.x += (randomRotation * 0.5);
  plane.rotation.y += (randomRotation * 0.5);
  const scale = Math.random();
  plane.scale.set(scale, scale , scale); 
  if(i % 2 == 0){
    evenGroup.add(plane)
  }else{
    oddGroup.add(plane)
  }  
}

scene.add(evenGroup)
scene.add(oddGroup)

/**
* Lights
**/

const ambientLight = new THREE.AmbientLight(0xFBFBB9, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xFBFBB9 , lightstrength);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 5;
scene.add(pointLight);

const pointLightOrigin = new THREE.PointLight(0xFBfBB9 , 1); //contrast color
scene.add(pointLightOrigin);


// Array of positions for the directional lights
const lightPositions = [
    { x: 10, y: 10, z: 10 },
    { x: -10, y: 10, z: -10 },
    { x: 10, y: -10, z: 10 },
    { x: -10, y: -10, z: -10 },
    { x: 5, y: 15, z: -5 },
    { x: -5, y: 15, z: -5 },
    { x: -5, y: -15, z: -5 },
    { x: 15, y: 15, z: -5 },
    { x: -15, y: 15, z: -5 },
    { x: -15, y: -15, z: -5 },
    { x: 25, y: 25, z: -25 },
    { x: -25, y: 25, z: -25 },
    { x: -25, y: -15, z: -25 }
];

// Loop through each position and create a directional light
lightPositions.forEach((pos) => {
    
    let color = 0xFBFBB9
  
    if(pos.z < 0) {
        color = 0xFBAAB9
    }
    const directionalLight = new THREE.DirectionalLight(color, 1);
    directionalLight.position.set(pos.x, pos.y, pos.z); // Set the light's position
    directionalLight.lookAt(0, 0, 0); // Make the light point towards the origin
    scene.add(directionalLight); // Add the light to the scene
});

// Define the distance from the origin (100px)
const distance = 100;

// Create the point lights
const pointLight1 = new THREE.PointLight(0xFBFBB9, 1, 0);  // White light, intensity 1
pointLight1.position.set(distance, 0, 0);  // 100px along the X-axis
pointLight1.lookAt(0, 0, 0);

const pointLight2 = new THREE.PointLight(0xFBFBB9, 1, 0);
pointLight2.position.set(-distance, 0, 0);  // 100px along the negative X-axis

const pointLight3 = new THREE.PointLight(0xFBFBB9, 1, 0);
pointLight3.position.set(0, distance, 0);  // 100px along the Y-axis

const pointLight4 = new THREE.PointLight(0xFBFBB9, 1, 0);
pointLight4.position.set(0, -distance, 0);  // 100px along the negative Y-axis


// Add the lights to the scene
scene.add(pointLight1);
scene.add(pointLight2);
scene.add(pointLight3);
scene.add(pointLight4);

/**
* Controls
**/

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(10, 5, 25);  // Moved camera further back for better view
controls.update();
controls.enableDamping = true;

/**
* Event Listeners
**/
window.addEventListener('dblclick', () => {
  const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
});

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
});

/**
* Animation
**/
const tick = () => {
  renderer.render(scene, camera)
  evenGroup.rotation.y += 0.002;
  oddGroup.rotation.y -= 0.002;
  
  
  
  evenGroup.children.forEach(child => {
  if (child instanceof THREE.Mesh) {
    // You can modify the properties of the child here, for example:
    child.rotation.x += 0.002;  // Move all objects inside the group along the x-axis
    child.rotation.z += 0.002;
    }
  });
  
  oddGroup.children.forEach(child => {
  if (child instanceof THREE.Mesh) {
    // You can modify the properties of the child here, for example:
    child.rotation.y += 0.002;  // Move all objects inside the group along the x-axis
    child.rotation.z -= 0.002;
    }
  });
  
  // Add AxesHelper to the scene
// const axesHelper = new THREE.AxesHelper(5); // 5 is the length of the axes
// scene.add(axesHelper);
  
  window.requestAnimationFrame(tick)
}
tick()

function animate() {
  requestAnimationFrame(animate);
  
  // Update controls
  controls.update();

  // Render the scene
  renderer.render(scene, camera);
}

animate();