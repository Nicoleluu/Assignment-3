console.log("EXPLORE LOADED");

const container = document.getElementById("chair-canvas");

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf7f4ee);

// Camera
const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / 500,
    0.1,
    100
);

camera.position.set(0,1.2,2.8);

// Renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(container.clientWidth, 500);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

container.innerHTML = "";
container.appendChild(renderer.domElement);

// Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;
controls.enablePan = false;
controls.autoRotate = false;

// Lights
const ambient = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambient);

const light1 = new THREE.DirectionalLight(0xffffff, 1.2);
light1.position.set(5, 6, 5);
light1.castShadow = true;
scene.add(light1);

const light2 = new THREE.DirectionalLight(0xffffff, 0.6);
light2.position.set(-5, 3, -5);
scene.add(light2);

// Ground
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20,20),
    new THREE.ShadowMaterial({
        opacity:0.15
    })
);

floor.rotation.x = -Math.PI/2;
floor.position.y = -1;

floor.receiveShadow = true;

scene.add(floor);

// Loader
const loader = new THREE.GLTFLoader();

loader.load(

    "models/eames_dcm_chair.glb",

    function(gltf){

        const chair = gltf.scene;
const box = new THREE.Box3().setFromObject(chair);
console.log(box.getSize(new THREE.Vector3()));
        chair.traverse(function(child){

            if(child.isMesh){

                child.castShadow = true;
                child.receiveShadow = true;

            }

        });

       chair.scale.set(8,8,8);
        chair.position.set(0,0,0);

        scene.add(chair);

    },

    undefined,

    function(error){

        console.error(error);

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

    camera.aspect = container.clientWidth/500;

    camera.updateProjectionMatrix();

    renderer.setSize(container.clientWidth,500);

});
