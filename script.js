import * as THREE from "https://esm.sh/three";
import { OrbitControls } from "https://esm.sh/three/addons/controls/OrbitControls.js";
import { FontLoader } from "https://esm.sh/three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "https://esm.sh/three/examples/jsm/geometries/TextGeometry.js";

/**
*  Textures
**/
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load("https://res.cloudinary.com/dcr0ilwho/image/upload/v1732073566/black-and-white-line-pattern-abstract-background-texture-vector_zeirzx.jpg")
const matcapTexture = textureLoader.load("https://res.cloudinary.com/dcr0ilwho/image/upload/v1732094973/323C4D_B79039_7C6A44_605C48_irrsmx.png");





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
const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })

fontLoader.load(
    'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
    (font) => {
        const textGeometry = new TextGeometry(
            'Hello Three.js',
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            }
        );
        const text = new THREE.Mesh(textGeometry, material);
        textGeometry.center();
        scene.add(text);
    }
);


/**
*  Add Objects
**/

const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)

for(let i = 0; i < 100; i++)
{
  const donut = new THREE.Mesh(donutGeometry, material)
  scene.add(donut)
  donut.position.x = (Math.random() - 0.5) * 10
  donut.position.y = (Math.random() - 0.5) * 10
  donut.position.z = (Math.random() - 0.5) * 10
  donut.rotation.x = Math.random() * Math.PI
  donut.rotation.y = Math.random() * Math.PI
  const scale = Math.random()
  donut.scale.set(scale, scale, scale)
}

/**
 * Controls
 **/
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 1.5, 1.5);
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
    // renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Animation
 **/
function animate() {
    requestAnimationFrame(animate);

    // Update controls
    controls.update();

    // Render the scene
    renderer.render(scene, camera);
}

animate();
