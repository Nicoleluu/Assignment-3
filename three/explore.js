console.log("EXPLORE JS LOADED");

let scene, camera, renderer, controls;

const container = document.getElementById("chair-canvas");

// Scene
scene = new THREE.Scene();
scene.background = new THREE.Color(0xf7f4ee);
scene.fog = new THREE.Fog(0xf7f4ee, 6, 18);

// Camera
camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / 500,
    0.1,
    100
);

camera.position.set(2.5, 2, 4);

// Renderer
renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(container.clientWidth, 500);

container.innerHTML = "";
container.appendChild(renderer.domElement);

// Orbit Controls
controls = new THREE.OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 1;

// Lighting
const ambient = new THREE.AmbientLight(0xffffff, 1.8);
scene.add(ambient);

const light = new THREE.DirectionalLight(0xffffff, 2);

light.position.set(5, 8, 5);

scene.add(light);

// Load model
const loader = new THREE.GLTFLoader();

loader.load(

    "models/eames_dcm_chair.glb",

    function(gltf){

        const chair = gltf.scene;

        chair.scale.set(1,1,1);

        chair.position.set(0,-1,0);

        scene.add(chair);

    },

    undefined,

    function(error){

        console.log(error);

    }

);

// Animation
function animate(){

    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene,camera);

}

animate();

// Resize
window.addEventListener("resize",function(){

    camera.aspect = container.clientWidth / 500;

    camera.updateProjectionMatrix();

    renderer.setSize(container.clientWidth,500);

});
