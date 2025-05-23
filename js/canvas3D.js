export class Triangulo3D {
    constructor() {
        this.base = 0;
        this.altura = 0;
        this.colorTriangulo = "#ff0000";
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.prism = null;
        this.controls = null;
        this.sun = null;
        this.sunLight = null;
    }

    iniciarEscena() {
        const values = this.getStoredValues();
        this.base = values.base;
        this.altura = values.altura;
        
        if (!this.scene) {
            this.setupThreeJSEnvironment();
            this.prism = this.createPrismGeometry();
            this.setupLights();
            this.createSun(); // Añadimos el sol
            
            const prismCenter = new THREE.Vector3(
                this.base / 2,
                this.altura / 3,
                -this.base / 4
            );
            
            this.setupControls(prismCenter);
            this.startAnimationLoop();
        }
    }

    getStoredValues() {
        return {
            base: parseFloat(localStorage.getItem("base")) || 5,
            altura: parseFloat(localStorage.getItem("altura")) || 5
        };
    }

    setupThreeJSEnvironment() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Color cielo más realista

        // Crear un plano para recibir sombras
        const planeGeometry = new THREE.PlaneGeometry(this.base * 4, this.base * 4);
        const planeMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xffffff,
            transparent: true,
            opacity: 0.8 
        });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -Math.PI / 2;
        plane.position.y = -0.01;
        plane.receiveShadow = true; // Habilitar recepción de sombras
        this.scene.add(plane);

        const gridSize = this.base * 2;
        const gridDivisions = this.base * 2;
        const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, 0x000000, 0x808080);
        gridHelper.position.set(this.base / 2, 0, 0);
        this.scene.add(gridHelper);

        const container = document.getElementById("container-3d");
        this.camera = new THREE.PerspectiveCamera(
            60, 
            container.clientWidth / container.clientHeight, 
            0.1, 
            1000
        );
        
        const initialDistance = Math.max(this.base, this.altura) * 1.5;
        this.camera.position.set(initialDistance, initialDistance * 0.5, initialDistance);
        
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        
        // Habilitar sombras en el renderer
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        container.appendChild(this.renderer.domElement);
    }

createPrismGeometry() {
    const depth = this.base / 2;
    const offsetX = this.base / 2;

    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
        offsetX, 0, 0,
        offsetX + this.base, 0, 0,
        offsetX + this.base / 2, this.altura, 0,
        offsetX, 0, -depth,
        offsetX + this.base, 0, -depth,
        offsetX + this.base / 2, this.altura, -depth
    ]);

    const indices = new Uint16Array([
        0, 1, 2, 3, 5, 4,
        0, 1, 4, 0, 4, 3,
        1, 2, 5, 1, 5, 4,
        2, 0, 3, 2, 3, 5
    ]);

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    geometry.computeVertexNormals();

    // CENTRAR para que rote sobre su centro
    geometry.center();

    const material = new THREE.MeshPhongMaterial({
        color: this.colorTriangulo,
        side: THREE.DoubleSide,
        shininess: 30,
        specular: 0x111111
    });

    this.prism = new THREE.Mesh(geometry, material);
    
    // Habilitar proyección de sombras
    this.prism.castShadow = true;
    this.prism.receiveShadow = true;

    // Añadir a la escena
    this.scene.add(this.prism);

    // La altura del prisma dividida por 2 es lo que necesitamos subir
    this.prism.position.set(0, this.altura / 2, 0);

    return this.prism;
}

    createSun() {
        // Crear geometría del sol
        const sunGeometry = new THREE.SphereGeometry(1, 32, 32);
        const sunMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xFFD700,
            emissive: 0xFFD700,
            emissiveIntensity: 0.3
        });
        
        this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
        
        // Posicionar el sol
        const sunDistance = Math.max(this.base, this.altura) * 3;
        this.sun.position.set(sunDistance * 0.8, sunDistance * 0.6, sunDistance * 0.4);
        
        this.scene.add(this.sun);

        // Crear rayos del sol (líneas decorativas)
        this.createSunRays();
    }

    createSunRays() {
        const raysMaterial = new THREE.LineBasicMaterial({ 
            color: 0xFFD700,
            transparent: true,
            opacity: 0.6
        });

        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const rayGeometry = new THREE.BufferGeometry();
            
            const rayLength = 2;
            const startRadius = 1.2;
            const endRadius = startRadius + rayLength;
            
            const startX = Math.cos(angle) * startRadius;
            const startY = Math.sin(angle) * startRadius;
            const endX = Math.cos(angle) * endRadius;
            const endY = Math.sin(angle) * endRadius;
            
            rayGeometry.setAttribute('position', new THREE.Float32BufferAttribute([
                startX, startY, 0,
                endX, endY, 0
            ], 3));
            
            const ray = new THREE.Line(rayGeometry, raysMaterial);
            ray.position.copy(this.sun.position);
            this.scene.add(ray);
        }
    }

    setupLights() {
        // Luz principal (sol) con sombras
        this.sunLight = new THREE.DirectionalLight(0xFFFFAA, 2);
        const sunDistance = Math.max(this.base, this.altura) * 3;
        this.sunLight.position.set(sunDistance * 0.8, sunDistance * 0.6, sunDistance * 0.4);
        
        // Configurar sombras para la luz del sol
        this.sunLight.castShadow = true;
        this.sunLight.shadow.mapSize.width = 2048;
        this.sunLight.shadow.mapSize.height = 2048;
        this.sunLight.shadow.camera.near = 0.5;
        this.sunLight.shadow.camera.far = sunDistance * 2;
        this.sunLight.shadow.camera.left = -this.base * 2;
        this.sunLight.shadow.camera.right = this.base * 2;
        this.sunLight.shadow.camera.top = this.altura * 2;
        this.sunLight.shadow.camera.bottom = -this.altura * 2;
        
        this.scene.add(this.sunLight);

        // Luz de relleno suave
        const fillLight = new THREE.DirectionalLight(0xADD8E6, 0.3);
        fillLight.position.set(-5, 3, -5).normalize();
        this.scene.add(fillLight);

        // Luz ambiente más tenue para crear contraste
        this.scene.add(new THREE.AmbientLight(0x404040, 0.4));
    }

    setupControls(prismCenter) {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.copy(prismCenter);
        this.camera.lookAt(prismCenter);
        
        const size = Math.max(this.base, this.altura);
        this.controls.minDistance = size * 0.5;
        this.controls.maxDistance = size * 3;
        
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = true;
        
        this.controls.minPolarAngle = 0;
        this.controls.maxPolarAngle = Math.PI;
        
        this.controls.update();
    }

    startAnimationLoop() {
        const animate = () => {
            requestAnimationFrame(animate);
            
            // Animar el sol (rotación suave)
            if (this.sun) {
                this.sun.rotation.y += 0.01;
            }
            
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
        };
        animate();
    }

    cambiarColor(color) {
        this.colorTriangulo = new THREE.Color(color);
        
        if (this.prism) {
            this.prism.material.color.copy(this.colorTriangulo);
            this.prism.material.needsUpdate = true;
        }
    }

    actualizarEscala(escala) {
        this.base = (parseFloat(localStorage.getItem("base")) || 5) * escala;
        this.altura = (parseFloat(localStorage.getItem("altura")) || 5) * escala;

        // Elimina el prisma viejo
        if (this.prism) {
            this.scene.remove(this.prism);
            this.prism.geometry.dispose();
            this.prism.material.dispose();
            this.prism = null;
        }

        // Crea el prisma nuevo con la base y altura escaladas
        this.prism = this.createPrismGeometry();

        const prismCenter = new THREE.Vector3(
            this.base / 2,
            this.altura / 3,
            -this.base / 4
        );

        this.setupControls(prismCenter);

        // Ajusta cámara según nueva escala
        const distance = Math.max(this.base, this.altura) * 1.5;
        this.camera.position.set(distance, distance * 0.5, distance);
        this.camera.lookAt(prismCenter);

        // Actualizar posición del sol según la nueva escala
        if (this.sun && this.sunLight) {
            const sunDistance = Math.max(this.base, this.altura) * 3;
            const newSunPos = new THREE.Vector3(
                sunDistance * 0.8, 
                sunDistance * 0.6, 
                sunDistance * 0.4
            );
            this.sun.position.copy(newSunPos);
            this.sunLight.position.copy(newSunPos);
        }
    }

    ajustarCanvas3D() {
        const container = document.getElementById('container-3d');
        if (container && this.renderer && this.camera) {
            const width = container.clientWidth;
            const height = container.clientHeight;

            this.renderer.setSize(width, height);
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
        }
    }

    aplicarRotacion(grados) {
        if (!this.prism) return;

        const radianes = THREE.MathUtils.degToRad(grados);

        this.prism.rotation.set(0, 0, radianes);
    }
}

const triangulo3D = new Triangulo3D();

document.addEventListener("DOMContentLoaded", () => {
    triangulo3D.iniciarEscena();
    triangulo3D.ajustarCanvas3D();
});

export { triangulo3D };