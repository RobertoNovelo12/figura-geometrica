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
    }

    iniciarEscena() {
        const values = this.getStoredValues();
        this.base = values.base;
        this.altura = values.altura;
        
        if (!this.scene) {
            this.setupThreeJSEnvironment();
            this.prism = this.createPrismGeometry();
            this.setupLights();
            
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
        this.scene.background = new THREE.Color(0xd0dce9);

        const gridSize = this.base * 2;
        const gridDivisions = this.base * 2;
        const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, 0x000000, 0x808080);
        gridHelper.position.set(this.base / 2, -0.01, 0);
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

    // Añadir a la escena
    this.scene.add(this.prism);

    this.prism.position.set(0, 2.5, 0);

    return this.prism;
}


    setupLights() {
        const mainLight = new THREE.DirectionalLight(0xffffff, 1);
        mainLight.position.set(5, 10, 7).normalize();
        this.scene.add(mainLight);

        const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
        fillLight.position.set(-5, 3, -5).normalize();
        this.scene.add(fillLight);

        this.scene.add(new THREE.AmbientLight(0x404040, 0.8));
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