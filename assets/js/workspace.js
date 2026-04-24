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
    },
    { 
        title: "Personal Info", 
        category: "Identity Sphere", 
        desc: "A bright, welcoming planet containing the biographical data and professional philosophy of the pilot.", 
        link: "info.html", 
        img: "../images/profile.jpeg",
        color: 0x00D2FF,
        pos: { x: -300, y: -20, z: -250 },
        size: 15
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

// ---- PROCEDURAL STAR WARS AUDIO ----
let audioCtx = null;
let masterGain = null;
let engineOsc = null;
let whirrOsc = null;
let noiseNode = null;

const soundManager = {
    init() {
        if (audioCtx) return;
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        masterGain = audioCtx.createGain();
        masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
        masterGain.connect(audioCtx.destination);

        // 1. Low Engine Hum (X-Wing Reactor)
        engineOsc = audioCtx.createOscillator();
        const engineGain = audioCtx.createGain();
        engineOsc.type = 'sawtooth';
        engineOsc.frequency.setValueAtTime(55, audioCtx.currentTime); // Low A
        engineGain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        engineOsc.connect(engineGain);
        engineGain.connect(masterGain);
        engineOsc.start();

        // 2. High Whirring (Turbo Sound)
        whirrOsc = audioCtx.createOscillator();
        const whirrGain = audioCtx.createGain();
        whirrOsc.type = 'sine';
        whirrOsc.frequency.setValueAtTime(880, audioCtx.currentTime); // High Whine
        whirrGain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        whirrOsc.connect(whirrGain);
        whirrGain.connect(masterGain);
        whirrOsc.start();

        // 3. Space Noise (Wind/Vacuum)
        const bufferSize = 2 * audioCtx.sampleRate;
        const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        noiseNode = audioCtx.createBufferSource();
        noiseNode.buffer = noiseBuffer;
        noiseNode.loop = true;
        const noiseFilter = audioCtx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.setValueAtTime(400, audioCtx.currentTime);
        const noiseGain = audioCtx.createGain();
        noiseGain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        noiseNode.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(masterGain);
        noiseNode.start();
    },

    start() {
        if (!audioCtx) this.init();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        
        const status = document.getElementById('audio-status');
        if (status) {
            status.innerHTML = '<i class="fas fa-volume-up"></i> Hyperdrive Online';
            status.style.color = '#00f2ff';
            status.style.opacity = '1';
            setTimeout(() => status.style.opacity = '0', 3000);
        }
    },

    update(moving) {
        if (!masterGain) return;
        const targetVol = moving ? 0.4 : 0.05;
        const targetFreq = moving ? 65 : 55;
        const targetWhirr = moving ? 950 : 880;

        masterGain.gain.setTargetAtTime(targetVol, audioCtx.currentTime, 0.1);
        engineOsc.frequency.setTargetAtTime(targetFreq, audioCtx.currentTime, 0.2);
        whirrOsc.frequency.setTargetAtTime(targetWhirr, audioCtx.currentTime, 0.2);
    }
};

window.addEventListener('click', () => soundManager.start());
window.addEventListener('keydown', () => soundManager.start());

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

// Main Fuselage
const fuseGeo = new THREE.CylinderGeometry(0.3, 0.7, 4, 16);
const shipMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.2 });
const fuse = new THREE.Mesh(fuseGeo, shipMat);
fuse.rotation.x = Math.PI / 2;
shipGroup.add(fuse);

// Cockpit
const cockGeo = new THREE.SphereGeometry(0.5, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
const cockMat = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 1, roughness: 0, transparent: true, opacity: 0.7 });
const cockpit = new THREE.Mesh(cockGeo, cockMat);
cockpit.position.set(0, 0.4, 0.5);
shipGroup.add(cockpit);

// Wings
const createWing = (yScale) => {
    const wing = new THREE.Group();
    const wingPart = new THREE.Mesh(new THREE.BoxGeometry(4, 0.1, 1.5), shipMat);
    wingPart.position.x = 2.5;
    wing.add(wingPart);
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
        shipGroup.translateZ(3);
        renderer.render(scene, camera);
        return;
    }

    if (keys['KeyQ']) shipGroup.rotation.z += rotationSpeed;
    if (keys['KeyE']) shipGroup.rotation.z -= rotationSpeed;
    if (keys['KeyA']) shipGroup.rotation.y += rotationSpeed;
    if (keys['KeyD']) shipGroup.rotation.y -= rotationSpeed;
    if (keys['ArrowUp']) shipGroup.rotation.x -= rotationSpeed;
    if (keys['ArrowDown']) shipGroup.rotation.x += rotationSpeed;

    if (isJoystickActive) {
        const joystickSens = 0.02;
        shipGroup.rotation.x -= joystickVector.y * joystickSens;
        shipGroup.rotation.y -= joystickVector.x * joystickSens;
    }

    const moveDir = new THREE.Vector3();
    const currentSpeed = (isJoystickActive || isThrusting) ? 0.04 : speed; 
    const thrusting = keys['KeyW'] || isThrusting || keys['KeyS'] || keys['KeyA'] || keys['KeyD'];

    if (keys['KeyW'] || isThrusting) moveDir.z = currentSpeed;
    if (keys['KeyS']) moveDir.z = -currentSpeed;
    if (keys['Space']) moveDir.y = currentSpeed;
    if (keys['ControlLeft']) moveDir.y = -currentSpeed;
    
    shipVelocity.add(moveDir.applyQuaternion(shipGroup.quaternion));
    shipVelocity.multiplyScalar(damping);
    shipGroup.position.add(shipVelocity);

    // Update Procedural Sound
    soundManager.update(thrusting || isJoystickActive);

    engines.forEach(e => {
        const s = 1 + Math.sin(Date.now() * 0.05) * 0.3;
        e.scale.set(s, 1, s);
    });

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
