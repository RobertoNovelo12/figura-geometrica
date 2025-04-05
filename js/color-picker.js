import { dibujarTriangulo } from './canvas2D.js';
import { triangulo3D } from './canvas3D.js';

window.triangulo3D = triangulo3D; 

const colorPalette = document.querySelector('.color-table');
const saturationSlider = document.getElementById('saturation-slider');
const hueSlider = document.getElementById('hue-slider');
const colorDisplay = document.getElementById('selectedColor');
const colorHexInput = document.getElementById('colorHexInput');
const colorPickerInput = document.getElementById('color-picker-input');

colorDisplay.addEventListener('click', () => colorPickerInput.click());

colorPickerInput.addEventListener('input', () => {
    const selectedColor = colorPickerInput.value;
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

function updateColor(color) {
    let h, s, l;

    if (color.startsWith("#")) {
        ({ h, s, l } = hexToHsl(color));
    } else {
        const [_, hVal, sVal, lVal] = color.match(/hsl\((\d+),\s*(\d+)%?,\s*(\d+)%?\)/);
        h = parseInt(hVal); s = parseInt(sVal); l = parseInt(lVal);
    }

    const colorHsl = `hsl(${h}, ${s}%, ${l}%)`;
    colorDisplay.style.backgroundColor = colorHsl;

    const hexColor = hslToHex(h, s, l);
    colorHexInput.value = hexColor;
    colorPickerInput.value = hexColor;

    const canvas = document.getElementById("canvas2D");
    const ctx = canvas?.getContext("2d");
    const base = parseFloat(localStorage.getItem("base"));
    const altura = parseFloat(localStorage.getItem("altura"));

    if (ctx && !isNaN(base) && !isNaN(altura)) {
        dibujarTriangulo(hexColor, base, altura, ctx);
    }

    
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
}


saturationSlider.addEventListener('input', updateFromSliders);
hueSlider.addEventListener('input', updateFromSliders);

generateColorPalette();
updateColor("#FF0000"); 
