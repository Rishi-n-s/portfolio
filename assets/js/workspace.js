import * as THREE from 'three';

// ---- CONFIG & DATA ----
const projects = [
    { 
        title: "Fleet Flow", 
        category: "Logistics Hub", 
        desc: "A massive industrial planet coordinating the flow of digital trade across the star system.", 
        link: "https://fleet-flow.netlify.app/", 
        img: "../images/fleet.jpg",
        color: 0x00f2ff,
        pos: { x: 120, y: 0, z: -150 },
        size: 18
    },
    { 
        title: "Tarika Lippan Art", 
        category: "Cultural Nebula", 
        desc: "A vibrant world of mirrors and clay, preserving traditional artistry in the infinite void.", 
        link: "https://tarika-lippan-art-rishi.vercel.app/", 
        img: "../images/tarika.jpg",
        color: 0xffa200,
        pos: { x: -180, y: 40, z: -80 },
        size: 25
    },
    { 
        title: "Certifications", 
        category: "Achievement Core", 
        desc: "A crystalline world housing the verified data of professional milestones and technical mastery.", 
        link: "certifications.html", 
        img: "../images/certifications.png",
        color: 0x7000ff,
        pos: { x: 50, y: -80, z: 220 },
        size: 20
    }
];

// ---- SCENE SETUP ----
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.001);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 20000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// ---- LIGHTING ----
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const sunLight = new THREE.PointLight(0xffffff, 5, 2000);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

// ---- STARFIELD ----
const starCount = 30000;
const starGeo = new THREE.BufferGeometry();
const starPos = new Float32Array(starCount * 3);
for (let i = 0; i < starCount * 3; i++) {
    starPos[i] = (Math.random() - 0.5) * 6000;
}
starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 1.2, sizeAttenuation: true });
scene.add(new THREE.Points(starGeo, starMat));

// ---- CENTRAL STAR ----
const sunGeo = new THREE.SphereGeometry(40, 64, 64);
const sunMat = new THREE.MeshStandardMaterial({ 
    emissive: 0xffffff, emissiveIntensity: 3, roughness: 0 
});
scene.add(new THREE.Mesh(sunGeo, sunMat));

// ---- REALISTIC SPACESHIP ----
const shipGroup = new THREE.Group();
scene.add(shipGroup);

// Main Fuselage (Tapered Cylinder)
const fuseGeo = new THREE.CylinderGeometry(0.3, 0.7, 4, 16);
const shipMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.2 });
const fuse = new THREE.Mesh(fuseGeo, shipMat);
fuse.rotation.x = Math.PI / 2;
shipGroup.add(fuse);

// Cockpit (Glass Dome)
const cockGeo = new THREE.SphereGeometry(0.5, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
const cockMat = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 1, roughness: 0, transparent: true, opacity: 0.7 });
const cockpit = new THREE.Mesh(cockGeo, cockMat);
cockpit.position.set(0, 0.4, 0.5);
shipGroup.add(cockpit);

// Wings (Detailed X-Wing style)
const createWing = (yScale) => {
    const wing = new THREE.Group();
    const wingPart = new THREE.Mesh(new THREE.BoxGeometry(4, 0.1, 1.5), shipMat);
    wingPart.position.x = 2.5;
    wing.add(wingPart);
    
    // Engine Pod on wing
    const pod = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 2, 16), shipMat);
    pod.rotation.x = Math.PI / 2;
    pod.position.set(1.5, 0, -0.5);
    wing.add(pod);

    wing.scale.y = yScale;
    return wing;
};

const wingFL = createWing(1); wingFL.rotation.z = 0.3; shipGroup.add(wingFL);
const wingFR = createWing(1); wingFR.rotation.z = -0.3; wingFR.scale.x = -1; shipGroup.add(wingFR);
const wingBL = createWing(-1); wingBL.rotation.z = 0.3; shipGroup.add(wingBL);
const wingBR = createWing(-1); wingBR.rotation.z = -0.3; wingBR.scale.x = -1; shipGroup.add(wingBR);

// Engine Thrusters
const thrusterMat = new THREE.MeshBasicMaterial({ color: 0x00f2ff });
const engines = [];
const addEngine = (x, y, z) => {
    const e = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.4, 16), thrusterMat);
    e.position.set(x, y, z);
    e.rotation.x = Math.PI / 2;
    shipGroup.add(e);
    engines.push(e);
};
addEngine(1.5, 0.4, -1.5);
addEngine(-1.5, 0.4, -1.5);
addEngine(1.5, -0.4, -1.5);
addEngine(-1.5, -0.4, -1.5);

const shipLight = new THREE.PointLight(0x00f2ff, 5, 15);
shipLight.position.z = -2;
shipGroup.add(shipLight);

// ---- PLANETS ----
const textureLoader = new THREE.TextureLoader();
const planetMeshes = [];

projects.forEach(proj => {
    const planetGroup = new THREE.Group();
    planetGroup.position.set(proj.pos.x, proj.pos.y, proj.pos.z);
    
    const planetGeo = new THREE.SphereGeometry(proj.size, 64, 64);
    const planetMat = new THREE.MeshStandardMaterial({ roughness: 0.8 });
    const planet = new THREE.Mesh(planetGeo, planetMat);
    
    textureLoader.load(proj.img, (tex) => {
        planetMat.map = tex;
        planetMat.needsUpdate = true;
    });

    const glowGeo = new THREE.SphereGeometry(proj.size * 1.1, 64, 64);
    const glowMat = new THREE.MeshBasicMaterial({ color: proj.color, transparent: true, opacity: 0.1, side: THREE.BackSide });
    planet.add(new THREE.Mesh(glowGeo, glowMat));

    planet.userData = proj;
    planetGroup.add(planet);
    scene.add(planetGroup);
    planetMeshes.push(planet);
});

// ---- CONTROLS ----
const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    if (e.code === 'Enter' && nearbyPlanet) initiateLanding();
});
window.addEventListener('keyup', (e) => keys[e.code] = false);

let shipVelocity = new THREE.Vector3();
const speed = 0.4;
const rotationSpeed = 0.03;
const damping = 0.95;

const uiInfo = document.getElementById('planet-info');
const uiCategory = document.getElementById('info-category');
const uiTitle = document.getElementById('info-title');
const uiDesc = document.getElementById('info-desc');
const uiLink = document.getElementById('info-link');
let nearbyPlanet = null;
let isLanding = false;

function initiateLanding() {
    if (isLanding || !nearbyPlanet) return;
    window.location.href = nearbyPlanet.link;
}

window.addEventListener('dblclick', () => {
    if (nearbyPlanet) initiateLanding();
});

// ---- MOBILE CONTROLS ----
// Mobile Touch to Move
let isThrusting = false;
window.addEventListener('touchstart', (e) => {
    if (e.target === renderer.domElement) isThrusting = true;
});
window.addEventListener('touchend', () => isThrusting = false);

// ---- JOYSTICK LOGIC ----
const joystickContainer = document.getElementById('joystick-container');
const joystickHandle = document.getElementById('joystick-handle');
let joystickVector = { x: 0, y: 0 };
let isJoystickActive = false;

joystickContainer.addEventListener('touchstart', (e) => {
    isJoystickActive = true;
    handleJoystick(e);
});

window.addEventListener('touchmove', (e) => {
    if (isJoystickActive) handleJoystick(e);
});

window.addEventListener('touchend', () => {
    isJoystickActive = false;
    joystickVector = { x: 0, y: 0 };
    joystickHandle.style.left = '50%';
    joystickHandle.style.top = '50%';
});

function handleJoystick(e) {
    const touch = e.touches[0];
    const rect = joystickContainer.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    let deltaX = touch.clientX - centerX;
    let deltaY = touch.clientY - centerY;
    
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDistance = rect.width / 2;
    
    if (distance > maxDistance) {
        deltaX = (deltaX / distance) * maxDistance;
        deltaY = (deltaY / distance) * maxDistance;
    }
    
    joystickVector.x = deltaX / maxDistance;
    joystickVector.y = deltaY / maxDistance;
    
    joystickHandle.style.left = `calc(50% + ${deltaX}px)`;
    joystickHandle.style.top = `calc(50% + ${deltaY}px)`;
}

function updateHUD() {
    if (isLanding) return;
    let found = false;
    planetMeshes.forEach(planet => {
        const dist = shipGroup.position.distanceTo(planet.getWorldPosition(new THREE.Vector3()));
        if (dist < planet.userData.size + 40) {
            nearbyPlanet = planet.userData;
            uiCategory.textContent = nearbyPlanet.category;
            uiTitle.textContent = nearbyPlanet.title;
            uiDesc.textContent = nearbyPlanet.desc;
            uiLink.href = nearbyPlanet.link;
            uiInfo.classList.add('active');
            found = true;
        }
    });
    if (!found) {
        uiInfo.classList.remove('active');
        nearbyPlanet = null;
    }
}

// ---- ANIMATION LOOP ----
function animate() {
    requestAnimationFrame(animate);
    if (isLanding) {
        // Warp flight effect
        shipGroup.translateZ(3);
        renderer.render(scene, camera);
        return;
    }

    // Rotations (Roll/Pitch/Yaw)
    if (keys['KeyQ']) shipGroup.rotation.z += rotationSpeed;
    if (keys['KeyE']) shipGroup.rotation.z -= rotationSpeed;
    if (keys['KeyA']) shipGroup.rotation.y += rotationSpeed;
    if (keys['KeyD']) shipGroup.rotation.y -= rotationSpeed;
    if (keys['ArrowUp']) shipGroup.rotation.x -= rotationSpeed;
    if (keys['ArrowDown']) shipGroup.rotation.x += rotationSpeed;

    // Apply Joystick Rotation
    if (isJoystickActive) {
        const joystickSens = 0.02; // Reduced from 0.04
        shipGroup.rotation.x -= joystickVector.y * joystickSens;
        shipGroup.rotation.y -= joystickVector.x * joystickSens;
    }

    // Translation (Forward/Backward/Vertical)
    const moveDir = new THREE.Vector3();
    // Slow speed for mobile (Joystick or Touch Thrust)
    const currentSpeed = (isJoystickActive || isThrusting) ? 0.04 : speed; 

    if (keys['KeyW'] || isThrusting) moveDir.z = currentSpeed;       // Forward
    if (keys['KeyS']) moveDir.z = -currentSpeed;      // Backward
    if (keys['Space']) moveDir.y = currentSpeed;      // Up
    if (keys['ControlLeft']) moveDir.y = -currentSpeed; // Down
    
    shipVelocity.add(moveDir.applyQuaternion(shipGroup.quaternion));
    shipVelocity.multiplyScalar(damping);
    shipGroup.position.add(shipVelocity);

    // Thruster Pulse
    engines.forEach(e => {
        const s = 1 + Math.sin(Date.now() * 0.05) * 0.3;
        e.scale.set(s, 1, s);
    });

    // Third Person Follow Camera
    const cameraOffset = new THREE.Vector3(0, 8, -25).applyQuaternion(shipGroup.quaternion);
    camera.position.lerp(shipGroup.position.clone().add(cameraOffset), 0.1);
    camera.lookAt(shipGroup.position);

    planetMeshes.forEach(p => p.rotation.y += 0.005);
    updateHUD();
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

window.onload = () => {
    setTimeout(() => {
        document.getElementById('loading').style.opacity = '0';
        setTimeout(() => document.getElementById('loading').style.display = 'none', 500);
    }, 500);
};
