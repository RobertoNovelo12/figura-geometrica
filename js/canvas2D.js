import { getStoredValues, calculateArea, calculatePerimeter, displayFormula } from './ui.js';

const DEFAULT_COLOR = "#ff0000"; 
const STATIC_TRIANGLE_COLOR = "#ffffff";
const STROKE_COLOR = "#000000";


export function dibujarTriangulo(color) {
    let canvas = document.getElementById("canvas2D");
    if (!canvas) return;

    
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height); 

    
    let base = 200;
    let altura = 200;

    
    const scale = Math.min(canvas.width / base, canvas.height / altura) * 0.8;

    let x1 = (canvas.width - base * scale) / 2;
    let y1 = canvas.height - (canvas.height - altura * scale) / 2;
    let x2 = x1 + base * scale;
    let y2 = y1;
    let x3 = x1 + (base * scale) / 2;
    let y3 = y1 - altura * scale;

    
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();

    
    ctx.fillStyle = color;
    ctx.fill();

    
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.stroke();
}



export function dibujarTrianguloEstatico() {
    const canvas = document.getElementById("canvasStatic");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    clearCanvas(ctx, canvas);

    const points = {
        x1: 30, y1: 120,
        x2: 120, y2: 120,
        x3: 75, y3: 30
    };

    drawTriangle(ctx, points.x1, points.y1, points.x2, points.y2, points.x3, points.y3, STATIC_TRIANGLE_COLOR, STROKE_COLOR);
}


function clearCanvas(ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}


function drawTriangle(ctx, x1, y1, x2, y2, x3, y3, fillColor, strokeColor = STROKE_COLOR) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();

    ctx.fillStyle = fillColor;
    ctx.fill();

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
    ctx.stroke();
}


function update2DUI(base, altura) {
    const area = calculateArea(base, altura);
    const perimeter = calculatePerimeter(base, altura);

    document.getElementById("baseValor").textContent = base.toFixed(2);
    document.getElementById("alturaValor").textContent = altura.toFixed(2);
    document.getElementById("resultado2d").textContent = area.toFixed(2);
    document.getElementById("perimetro2d").textContent = perimeter.toFixed(2);

    displayFormula(base, altura, "2d");
    renderMathFormulas();
}


function renderMathFormulas() {
    setTimeout(() => {
        if (typeof renderMathInElement !== 'undefined') {
            renderMathInElement(document.getElementById("procedimiento2d"), {
                delimiters: [
                    { left: '\\[', right: '\\]', display: true },
                    { left: '\\(', right: '\\)', display: false }
                ],
                throwOnError: false
            });
        }
    }, 100);
}

function llenarTablaColores() {
    const colorTable = document.getElementById("colorTable");
    const colores = [
        "#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff", "#000000", "#ffffff"
    ];
    
    
    colores.forEach(color => {
        const colorDiv = document.createElement("div");
        colorDiv.style.backgroundColor = color;
        colorDiv.classList.add("color-swatch");
        colorDiv.addEventListener("click", () => {
            
            dibujarTriangulo(color);

            
            document.getElementById("selectedColor").style.backgroundColor = color;

            
            document.getElementById("colorHexInput").value = color;
        });
        colorTable.appendChild(colorDiv);
    });
}



document.addEventListener("DOMContentLoaded", () => {
    
    if (document.getElementById("canvasStatic")) {
        dibujarTrianguloEstatico();
    }

    
    if (document.getElementById("canvas2D")) {
        
        const DEFAULT_COLOR = "#ff0000"; 
        dibujarTriangulo(DEFAULT_COLOR);

        
        const colorPickerInput = document.getElementById("color-picker-input");
        const colorDisplay = document.getElementById("selectedColor");
        const hexInput = document.getElementById("colorHexInput");

        
        colorPickerInput?.addEventListener("input", (e) => {
            const selectedColor = e.target.value;
            dibujarTriangulo(selectedColor);
            
            
            colorDisplay.style.backgroundColor = selectedColor;
            hexInput.value = selectedColor;
        });

        
        function actualizarColorDesdeSliders() {
            const saturation = document.getElementById("saturation-slider").value;
            const hue = document.getElementById("hue-slider").value;

            
            const color = `hsl(${hue}, ${saturation}%, 50%)`;

            
            colorDisplay.style.backgroundColor = color;

            
            hexInput.value = color;

            
            dibujarTriangulo(color);
        }

        
        const saturationSlider = document.getElementById("saturation-slider");
        const hueSlider = document.getElementById("hue-slider");

        if (saturationSlider && hueSlider) {
            saturationSlider.addEventListener("input", actualizarColorDesdeSliders);
            hueSlider.addEventListener("input", actualizarColorDesdeSliders);
        }
    }

    
    if (document.getElementById("colorTable")) {
        llenarTablaColores();
    }
});