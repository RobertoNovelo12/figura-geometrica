import { dibujarTriangulo } from './canvas2D.js';
import { triangulo3D } from './canvas3D.js';

window.triangulo3D = triangulo3D; 

const colorPalette = document.querySelector('.color-table');
const saturationSlider = document.getElementById('saturation-slider');
const hueSlider = document.getElementById('hue-slider');
const colorDisplay = document.getElementById('selectedColor');
const colorHexInput = document.getElementById('colorHexInput');
const colorPickerInput = document.getElementById('color-picker-input');

// Variable para trackear si estamos usando un gradiente
let currentGradient = null;

colorDisplay.addEventListener('click', () => colorPickerInput.click());

colorPickerInput.addEventListener('input', () => {
    const selectedColor = colorPickerInput.value;
    currentGradient = null; // Reset gradiente cuando se usa color picker
    updateColor(selectedColor);
});

colorPickerInput.addEventListener('blur', () => {
    colorPickerInput.style.display = 'none';
});

const colors = [
    ["#000000", "#2B2B2B", "#555555", "#808080", "#AAAAAA", "#D5D5D5", "#FFFFFF"], 
    ["#FF0000", "#E00000", "#C00000", "#A00000", "#800000", "#600000", "#400000"], 
    ["#FF8000", "#E06F00", "#C05E00", "#A04D00", "#803C00", "#602B00", "#401A00"], 
    ["#FFFF00", "#E0E000", "#C0C000", "#A0A000", "#808000", "#606000", "#404000"], 
    ["#00FF00", "#00E000", "#00C000", "#00A000", "#008000", "#006000", "#004000"], 
    ["#00FFFF", "#00E0E0", "#00C0C0", "#00A0A0", "#008080", "#006060", "#004040"], 
    ["#0000FF", "#0000E0", "#0000C0", "#0000A0", "#000080", "#000060", "#000040"], 
    ["#8000FF", "#7000E0", "#6000C0", "#5000A0", "#400080", "#300060", "#200040"], 
    ["#FF0080", "#E00070", "#C00060", "#A00050", "#800040", "#600030", "#400020"]  
];

// Definir 7 gradientes atractivos
const gradients = [
    {
        name: "Sunset",
        gradient: "linear-gradient(45deg, #FF6B6B, #FFE66D, #FF8E53)",
        dominantColor: "#FF8E53"
    },
    {
        name: "Ocean",
        gradient: "linear-gradient(45deg, #667eea, #764ba2, #f093fb)",
        dominantColor: "#667eea"
    },
    {
        name: "Forest",
        gradient: "linear-gradient(45deg, #11998e, #38ef7d, #a8edea)",
        dominantColor: "#11998e"
    },
    {
        name: "Purple Haze",
        gradient: "linear-gradient(45deg, #8E2DE2, #4A00E0, #C471ED)",
        dominantColor: "#8E2DE2"
    },
    {
        name: "Fire",
        gradient: "linear-gradient(45deg, #FF416C, #FF4B2B, #FFB347)",
        dominantColor: "#FF416C"
    },
    {
        name: "Cool Blues",
        gradient: "linear-gradient(45deg, #2196F3, #21CBF3, #00BCD4)",
        dominantColor: "#2196F3"
    },
    {
        name: "Warm Earth",
        gradient: "linear-gradient(45deg, #8B4513, #D2691E, #F4A460)",
        dominantColor: "#8B4513"
    }
];

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

function hexToHsl(hex) {
    const r = parseInt(hex.substr(1, 2), 16) / 255;
    const g = parseInt(hex.substr(3, 2), 16) / 255;
    const b = parseInt(hex.substr(5, 2), 16) / 255;

    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) h = s = 0;
    else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
            case g: h = ((b - r) / d + 2); break;
            case b: h = ((r - g) / d + 4); break;
        }
        h /= 6;
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

function updateColor(color, isGradient = false) {
    let displayColor, hexColor;
    
    if (isGradient) {
        // Si es un gradiente, usar el color dominante para display pero guardar el nombre del gradiente
        const gradientObj = gradients.find(g => g.name === color);
        displayColor = gradientObj.dominantColor;
        hexColor = gradientObj.dominantColor;
        currentGradient = color; // Guardar el nombre del gradiente
    } else {
        currentGradient = null; // Reset gradiente
        if (color.startsWith("#")) {
            displayColor = color;
            hexColor = color;
        } else {
            const [_, hVal, sVal, lVal] = color.match(/hsl\((\d+),\s*(\d+)%?,\s*(\d+)%?\)/);
            const h = parseInt(hVal), s = parseInt(sVal), l = parseInt(lVal);
            displayColor = `hsl(${h}, ${s}%, ${l}%)`;
            hexColor = hslToHex(h, s, l);
        }
    }

    // Actualizar displays
    colorDisplay.style.backgroundColor = displayColor;
    colorHexInput.value = hexColor;
    colorPickerInput.value = hexColor;

    // Aplicar a canvas 2D
    const canvas = document.getElementById("canvas2D");
    const ctx = canvas?.getContext("2d");
    const base = parseFloat(localStorage.getItem("base"));
    const altura = parseFloat(localStorage.getItem("altura"));

    if (ctx && !isNaN(base) && !isNaN(altura)) {
        // Pasar el gradiente o color según corresponda
        const colorToApply = currentGradient || hexColor;
        dibujarTriangulo(colorToApply, base, altura, ctx);
    }

    // Aplicar a 3D (siempre usa el color dominante)
    if (window.triangulo3D && typeof window.triangulo3D.cambiarColor === 'function') {
        window.triangulo3D.cambiarColor(hexColor);
    } else {
        console.warn("triangulo3D no está definido o no tiene el método cambiarColor.");
    }
}

function updateFromSliders() {
    const hue = hueSlider.value;
    const saturation = saturationSlider.value;
    const lightness = 50;
    updateColor(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
}

function generateColorPalette() {
    colorPalette.innerHTML = "";
    
    // Generar paleta de colores sólidos
    colors.forEach(row => {
        const rowDiv = document.createElement("div");
        rowDiv.style.display = "flex";
        row.forEach(color => {
            const box = document.createElement("div");
            box.classList.add('color-box');
            box.style.backgroundColor = color;
            box.dataset.color = color;
            box.addEventListener("click", () => updateColor(color));
            rowDiv.appendChild(box);
        });
        colorPalette.appendChild(rowDiv);
    });

    // Agregar separador
    const separator = document.createElement("div");
    separator.style.cssText = `
        height: 15px;
        width: 100%;
        margin: 10px 0;
        border-bottom: 2px solid #ddd;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: #666;
        font-weight: bold;
    `;
    separator.textContent = "GRADIENTES";
    colorPalette.appendChild(separator);

    // Generar gradientes
    const gradientsContainer = document.createElement("div");
    gradientsContainer.style.cssText = `
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 5px;
        margin-top: 10px;
    `;

    gradients.forEach(gradientObj => {
        const gradientBox = document.createElement("div");
        gradientBox.classList.add('gradient-box');
        gradientBox.style.cssText = `
            width: 100%;
            height: 40px;
            background: ${gradientObj.gradient};
            border: 2px solid #ccc;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        `;

        // Agregar tooltip con el nombre del gradiente
        gradientBox.title = gradientObj.name;

        // Efecto hover
        gradientBox.addEventListener('mouseenter', () => {
            gradientBox.style.transform = 'scale(1.05)';
            gradientBox.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
            gradientBox.style.borderColor = '#999';
        });

        gradientBox.addEventListener('mouseleave', () => {
            gradientBox.style.transform = 'scale(1)';
            gradientBox.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            gradientBox.style.borderColor = '#ccc';
        });

        // Click event para seleccionar el gradiente
        gradientBox.addEventListener("click", () => {
            updateColor(gradientObj.name, true); // Pasar true para indicar que es gradiente
            
            // Efecto visual de selección
            gradientBox.style.borderColor = '#007bff';
            gradientBox.style.borderWidth = '3px';
            
            setTimeout(() => {
                gradientBox.style.borderColor = '#ccc';
                gradientBox.style.borderWidth = '2px';
            }, 500);
        });

        gradientsContainer.appendChild(gradientBox);
    });

    colorPalette.appendChild(gradientsContainer);
}

saturationSlider.addEventListener('input', updateFromSliders);
hueSlider.addEventListener('input', updateFromSliders);

generateColorPalette();
updateColor("#FF0000");