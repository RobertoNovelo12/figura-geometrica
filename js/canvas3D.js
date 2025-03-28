import { getStoredValues, calculateArea, calculatePerimeter, displayFormula } from './ui.js';

let scene, camera, renderer, prism, controls;
let base, altura;
let colorTriangulo = "#ff0000"; 

function iniciarEscena3D() {
    const values = getStoredValues();
    base = values.base;
    altura = values.altura;
    
    update3DUI(base, altura);
    displayFormula(base, altura, '3d');

    if (!scene) {
        setupThreeJSEnvironment();
        prism = createPrismGeometry(); 
        setupLights();
        
        const prismCenter = new THREE.Vector3(
            base / 2,          
            altura / 3,         
            -base / 4           
        );
        
        setupControls(prismCenter);
        startAnimationLoop();
    } else {
        
        if (prism) {
            prism.material.color.set(colorTriangulo);
            prism.material.needsUpdate = true;  
        }
    }
}

function setupThreeJSEnvironment() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xd0dce9);

    const gridSize = base * 2;
    const gridDivisions = base * 2;
    const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, 0x000000, 0x808080);
    gridHelper.position.set(base / 2, -0.01, 0);
    scene.add(gridHelper);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    const initialDistance = Math.max(base, altura) * 1.5;
    camera.position.set(initialDistance, initialDistance * 0.5, initialDistance);
    
    renderer = new THREE.WebGLRenderer({ antialias: true });
    const container = document.getElementById("container-3d");
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
}

function createPrismGeometry() {
    const depth = base / 2;
    const offsetX = base / 2;

    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
        offsetX, 0, 0,          
        offsetX + base, 0, 0,     
        offsetX + base / 2, altura, 0, 
        offsetX, 0, -depth,       
        offsetX + base, 0, -depth, 
        offsetX + base / 2, altura, -depth  
    ]);

    const indices = new Uint16Array([
        0, 1, 2,  
        3, 5, 4,  
        0, 1, 4, 0, 4, 3, 
        1, 2, 5, 1, 5, 4, 
        2, 0, 3, 2, 3, 5  
    ]);

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    geometry.computeVertexNormals();

    const material = new THREE.MeshPhongMaterial({
        color: colorTriangulo,  
        side: THREE.DoubleSide,
        shininess: 30,
        specular: 0x111111
    });

    prism = new THREE.Mesh(geometry, material);
    scene.add(prism);
    
    return prism;
}

function setupLights() {
    const mainLight = new THREE.DirectionalLight(0xffffff, 1);
    mainLight.position.set(5, 10, 7).normalize();
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
    fillLight.position.set(-5, 3, -5).normalize();
    scene.add(fillLight);

    scene.add(new THREE.AmbientLight(0x404040, 0.8));
}

function setupControls(prismCenter) {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    
    controls.target.copy(prismCenter);
    camera.lookAt(prismCenter);
    
    const size = Math.max(base, altura);
    controls.minDistance = size * 0.5;
    controls.maxDistance = size * 3;
    
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = true;
    
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI;
    
    controls.update();
}

function startAnimationLoop() {
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
}

function update3DUI(base, altura) {
    const area = calculateArea(base, altura);
    const perimeter = calculatePerimeter(base, altura);
}


function cambiarColor3D(color) {
    
    if (color.startsWith('hsl')) {
        const hslValues = color.match(/hsl\((\d+), (\d+)%, (\d+)%\)/);
        const h = parseInt(hslValues[1]);
        const s = parseInt(hslValues[2]);
        const l = parseInt(hslValues[3]);
        color = hslToHex(h, s, l);
    }
    
    
    colorTriangulo = new THREE.Color(color);

    console.log("Nuevo color 3D:", colorTriangulo);

    if (prism) {
        prism.material.color.copy(colorTriangulo);
        prism.material.needsUpdate = true;
    }
}


function actualizarColorDesdeTabla() {
    const colorPicker = document.getElementById("color-picker-input"); 
    colorTriangulo = colorPicker.value; 

    
    const colorDisplay3d = document.getElementById("selectedColor");
    colorDisplay3d.style.backgroundColor = colorTriangulo; 

    
    if (prism) {
        prism.material.color.set(colorTriangulo);
        prism.material.needsUpdate = true;
    }
}

function ajustarCanvas3D() {
    const container = document.getElementById('container-3d');
    if (container && renderer && camera) {
        const width = container.clientWidth;
        const height = container.clientHeight;

        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
}

window.addEventListener('resize', ajustarCanvas3D);

document.addEventListener("DOMContentLoaded", () => {
    iniciarEscena3D();
    ajustarCanvas3D();

    
    const colorPicker = document.getElementById("color-picker-input");
    if (colorPicker) {
        colorPicker.addEventListener("input", actualizarColorDesdeTabla); 
    }

    
    const colorDisplay3d = document.getElementById("selectedColor");
    if (colorDisplay3d) {
        colorDisplay3d.addEventListener("click", cambiarColor3D); 
    }
});


export { iniciarEscena3D, cambiarColor3D, ajustarCanvas3D };