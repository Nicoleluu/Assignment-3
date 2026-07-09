console.log("NEW BUILD JS");

(function(){

console.log("BUILD JS LOADED");

let scene, camera, renderer, controls;

const container = document.getElementById("build-canvas");

// ---------------- Scene ----------------

scene = new THREE.Scene();
scene.background = new THREE.Color(0xf7f4ee);
scene.fog = new THREE.Fog(0xf7f4ee, 6, 18);

// ---------------- Camera ----------------

camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / 500,
    0.1,
    100
);

camera.position.set(0, 6, 20);

// ---------------- Renderer ----------------

renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(container.clientWidth, 500);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

container.innerHTML = "";
container.appendChild(renderer.domElement);

// ---------------- Controls ----------------

controls = new THREE.OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;
controls.autoRotate = false;

// ---------------- Lighting ----------------

const ambient = new THREE.AmbientLight(0xffffff, 0.35);
scene.add(ambient);

const keyLight = new THREE.DirectionalLight(0xfff5ea, 2.2);
keyLight.position.set(5,6,2);
keyLight.castShadow = true;
keyLight.shadow.mapSize.width = 2048;
keyLight.shadow.mapSize.height = 2048;
scene.add(keyLight);

const rimLight = new THREE.DirectionalLight(0xdfefff,1.0);
rimLight.position.set(-6,3,-6);
scene.add(rimLight);

const fillLight = new THREE.PointLight(0xffffff,0.5);
fillLight.position.set(0,3,2);
scene.add(fillLight);

// ---------------- Ground ----------------

const floor = new THREE.Mesh(

    new THREE.PlaneGeometry(20,20),

    new THREE.ShadowMaterial({
        opacity:0.18
    })

);

floor.rotation.x = -Math.PI/2;
floor.position.y = -1;

floor.receiveShadow = true;

scene.add(floor);

// ---------------- Loader ----------------

const loader = new THREE.GLTFLoader();


// =====================
// Drill
// =====================

loader.load(

    "models/electric_drill.glb",

    function(gltf){

        const drill = gltf.scene;

        drill.traverse(function(child){

            if(child.isMesh){

                child.castShadow = true;
                child.receiveShadow = true;

            }

        });

        drill.scale.set(0.05,0.05,0.05);
        drill.position.set(-5,0,0);

        console.log(drill);
scene.add(drill);

    },

    undefined,

    function(error){

        console.log(error);

    }

);


// =====================
// Table Saw
// =====================

loader.load(

    "models/table_saw_-_fbx.glb",

    function(gltf){

        const saw = gltf.scene;

        saw.traverse(function(child){

            if(child.isMesh){

                child.castShadow = true;
                child.receiveShadow = true;

            }

        });

        saw.scale.set(0.05,0.05,0.05);
        saw.position.set(5,0,0);

        scene.add(saw);

    },

    undefined,

    function(error){

        console.log(error);

    }

);


// ---------------- Animation ----------------

function animate(){

    requestAnimationFrame(animate);

    // controls.update();

    renderer.render(scene,camera);

}

animate();

// ---------------- Resize ----------------

window.addEventListener("resize",function(){

    camera.aspect = container.clientWidth/500;

    camera.updateProjectionMatrix();

    renderer.setSize(container.clientWidth,500);

});

 })();
