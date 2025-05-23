export function dibujarTrianguloEstatico() {
    const canvas = document.getElementById("canvasStatic");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    clearCanvas(ctx, canvas);

    const points = { x1: 30, y1: 120, x2: 120, y2: 120, x3: 75, y3: 30 };
    const triangle = new Triangle2D(ctx, points.x1, points.y1, points.x2, points.y2, points.x3, points.y3, "#ffffff", "#000000");
    triangle.draw();
}

function clearCanvas(ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Definir gradientes para canvas
const canvasGradients = {
    "Sunset": ["#FF6B6B", "#FFE66D", "#FF8E53"],
    "Ocean": ["#667eea", "#764ba2", "#f093fb"],
    "Forest": ["#11998e", "#38ef7d", "#a8edea"],
    "Purple Haze": ["#8E2DE2", "#4A00E0", "#C471ED"],
    "Fire": ["#FF416C", "#FF4B2B", "#FFB347"],
    "Cool Blues": ["#2196F3", "#21CBF3", "#00BCD4"],
    "Warm Earth": ["#8B4513", "#D2691E", "#F4A460"]
};

function createCanvasGradient(ctx, gradientName, x1, y1, x2, y2, x3, y3) {
    if (!canvasGradients[gradientName]) {
        return gradientName; // Si no es un gradiente conocido, devolver el color
    }

    // Calcular bounds del triángulo
    const minX = Math.min(x1, x2, x3);
    const maxX = Math.max(x1, x2, x3);
    const minY = Math.min(y1, y2, y3);
    const maxY = Math.max(y1, y2, y3);

    // Crear gradiente lineal
    const gradient = ctx.createLinearGradient(minX, minY, maxX, maxY);
    const colors = canvasGradients[gradientName];
    
    // Añadir colores al gradiente
    colors.forEach((color, index) => {
        gradient.addColorStop(index / (colors.length - 1), color);
    });

    return gradient;
}

class Triangle2D {
    constructor(ctx, x1, y1, x2, y2, x3, y3, fillColor, strokeColor = "#000000") {
        this.ctx = ctx;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.x3 = x3;
        this.y3 = y3;
        this.fillColor = fillColor;
        this.strokeColor = strokeColor;
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.moveTo(this.x1, this.y1);
        this.ctx.lineTo(this.x2, this.y2);
        this.ctx.lineTo(this.x3, this.y3);
        this.ctx.closePath();
        
        // Verificar si es un gradiente
        const gradientFill = createCanvasGradient(
            this.ctx, 
            this.fillColor, 
            this.x1, this.y1, 
            this.x2, this.y2, 
            this.x3, this.y3
        );
        
        this.ctx.fillStyle = gradientFill;
        this.ctx.fill();
        this.ctx.strokeStyle = this.strokeColor;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("canvas2D");
    if (!canvas) {
        return;
    }

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    const ctx = canvas.getContext("2d");

    const base = parseFloat(localStorage.getItem("base"));
    const altura = parseFloat(localStorage.getItem("altura"));

    if (isNaN(base) || isNaN(altura)) {
        alert("No se encontraron valores válidos de base y altura.");
        return;
    }

    dibujarTriangulo("#ff0000", base, altura, ctx);

    const colorPicker = document.getElementById("color-picker-input");
    const selectedColor = document.getElementById("selectedColor");
    const colorHexInput = document.getElementById("colorHexInput");

    colorPicker.addEventListener("input", (event) => {
        const color = event.target.value;
        selectedColor.style.backgroundColor = color;
        colorHexInput.value = rgbToHex(color);
        dibujarTriangulo(color, base, altura, ctx);
    });

    const hueSlider = document.getElementById("hue-slider");
    const saturationSlider = document.getElementById("saturation-slider");

    hueSlider.addEventListener("input", actualizarColorDesdeSliders);
    saturationSlider.addEventListener("input", actualizarColorDesdeSliders);

    function actualizarColorDesdeSliders() {
        const hue = hueSlider.value;
        const saturation = saturationSlider.value;
        const colorHSL = `hsl(${hue}, ${saturation}%, 50%)`;

        selectedColor.style.backgroundColor = colorHSL;
        colorHexInput.value = hslToHex(hue, saturation, 50);
        dibujarTriangulo(colorHSL, base, altura, ctx);
    }

    const colorTable = document.getElementById("colorTable");
    colorTable.addEventListener("click", (event) => {
        const color = event.target.style.backgroundColor;
        if (color) {
            selectedColor.style.backgroundColor = color;
            colorHexInput.value = rgbToHex(color);
            dibujarTriangulo(color, base, altura, ctx);
        }
    });
});

function rgbToHex(rgb) {
    const result = rgb.match(/\d+/g);
    return `#${((1 << 24) + (parseInt(result[0]) << 16) + (parseInt(result[1]) << 8) + parseInt(result[2])).toString(16).slice(1).toUpperCase()}`;
}

function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;
    
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;

    let r, g, b;
    if (h < 60) [r, g, b] = [c, x, 0];
    else if (h < 120) [r, g, b] = [x, c, 0];
    else if (h < 180) [r, g, b] = [0, c, x];
    else if (h < 240) [r, g, b] = [0, x, c];
    else if (h < 300) [r, g, b] = [x, 0, c];
    else [r, g, b] = [c, 0, x];

    const rHex = Math.round((r + m) * 255).toString(16).padStart(2, '0');
    const gHex = Math.round((g + m) * 255).toString(16).padStart(2, '0');
    const bHex = Math.round((b + m) * 255).toString(16).padStart(2, '0');
    
    return `#${rHex}${gHex}${bHex}`.toUpperCase();
}

export function dibujarTriangulo(color, base, altura, ctx, escala = 1, rotacion = 0) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Escala base para que quepa en el canvas
    const escalaBase = Math.min(ctx.canvas.width / base, ctx.canvas.height / altura) * 0.8;
    const scale = escalaBase * escala;

    // Centro del canvas para hacer la rotación alrededor del centro del triángulo
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;

    // Calcula los puntos sin rotar relativos al centro
    const x1 = - (base * scale) / 2;
    const y1 = (altura * scale) / 2;
    const x2 = (base * scale) / 2;
    const y2 = (altura * scale) / 2;
    const x3 = 0;
    const y3 = - (altura * scale) / 2;

    ctx.save();

    // Mueve el origen al centro del canvas
    ctx.translate(centerX, centerY);

    // Aplica rotación en radianes
    ctx.rotate((rotacion * Math.PI) / 180);

    // Dibuja el triángulo con puntos rotados
    const triangle = new Triangle2D(
        ctx,
        x1, y1,
        x2, y2,
        x3, y3,
        color,
        "#000000"
    );
    triangle.draw();

    ctx.restore();
}