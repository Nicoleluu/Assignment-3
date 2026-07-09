console.log("BUILD LOADED");

const container = document.getElementById("build-canvas");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf7f4ee);

const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / 500,
    0.1,
    100
);

camera.position.set(0, 3.5, 8);

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(container.clientWidth, 500);
renderer.setPixelRatio(window.devicePixelRatio);

container.innerHTML = "";
container.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;
controls.autoRotate = false;

// ---------------- LIGHTS ----------------

scene.add(new THREE.AmbientLight(0xffffff, 1));

const light = new THREE.DirectionalLight(0xffffff, 1.5);
light.position.set(5,8,5);
scene.add(light);

// ---------------- MATERIAL ----------------

const wood = new THREE.MeshStandardMaterial({
    color:0x8B5A2B,
    roughness:0.65
});

// ---------------- PIECES ----------------

const pieces = [];

// Legs

const legs = new THREE.Group();

function leg(x,z){

    const l = new THREE.Mesh(

        new THREE.BoxGeometry(.12,2,.12),

        wood

    );

    l.position.set(x,-1,z);

    legs.add(l);

}

leg(-1,-.7);
leg(1,-.7);
leg(-1,.7);
leg(1,.7);

legs.position.y = -6;

scene.add(legs);

pieces.push({
    object:legs,
    target:0
});

// Seat

const seat = new THREE.Mesh(

    new THREE.BoxGeometry(2.6,.18,2),

    wood

);

seat.position.set(0,-6,0);

scene.add(seat);

pieces.push({
    object:seat,
    target:1
});

// Back support

const support = new THREE.Mesh(

    new THREE.BoxGeometry(.18,1.5,.18),

    wood

);

support.position.set(0,-6,-0.8);

scene.add(support);

pieces.push({
    object:support,
    target:2
});

// Backrest

const back = new THREE.Mesh(

    new THREE.BoxGeometry(2.4,1.2,.18),

    wood

);

back.position.set(0,-6,-0.8);

scene.add(back);

pieces.push({
    object:back,
    target:3
});

// ---------------- BUILD BUTTON ----------------

const button = document.createElement("button");

button.innerHTML = "Add Next Piece";

button.style.marginTop = "20px";
button.style.padding = "12px 24px";
button.style.border = "none";
button.style.background = "#222";
button.style.color = "white";
button.style.cursor = "pointer";
button.style.fontFamily = "Inter";
button.style.fontSize = "15px";

container.parentElement.appendChild(button);

// ---------------- COMPLETE TEXT ----------------

const complete = document.createElement("div");

complete.innerHTML = "✓ Chair Complete";

complete.style.marginTop = "18px";
complete.style.fontSize = "18px";
complete.style.fontWeight = "600";
complete.style.opacity = "0";
complete.style.transition = ".4s";

container.parentElement.appendChild(complete);

// ---------------- BUILD ----------------

let step = 0;

button.onclick = function(){

    if(step>=pieces.length) return;

    const part = pieces[step].object;

    if(step==0){

        part.position.y = 0;

    }

    if(step==1){

        part.position.y = .1;

    }

    if(step==2){

        part.position.set(0,1,-0.8);

    }

    if(step==3){

        part.position.set(0,2.2,-0.8);

    }

    step++;

    if(step===pieces.length){

        complete.style.opacity = "1";
        button.innerHTML = "Completed";

    }

};

// ---------------- ANIMATION ----------------

function animate(){

    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene,camera);

}

animate();

window.addEventListener("resize",()=>{

    camera.aspect = container.clientWidth/500;

    camera.updateProjectionMatrix();

    renderer.setSize(container.clientWidth,500);

});
