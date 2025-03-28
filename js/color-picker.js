import { dibujarTriangulo } from './canvas2D.js';
import { cambiarColor3D } from './canvas3D.js';

const colorPalette = document.querySelector('.color-table');
const saturationSlider = document.getElementById('saturation-slider');
const hueSlider = document.getElementById('hue-slider');
const colorDisplay = document.getElementById('selectedColor');
const colorHexInput = document.getElementById('colorHexInput');
const colorPickerInput = document.getElementById('color-picker-input');


colorDisplay.addEventListener('click', () => {
    colorPickerInput.click(); 
});


colorPickerInput.addEventListener('input', () => {
    const selectedColor = colorPickerInput.value; 
    console.log("Color seleccionado: ", selectedColor);
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
    let c = (1 - Math.abs(2 * l - 1)) * s;
    let x = c * (1 - Math.abs((h / 60) % 2 - 1));
    let m = l - c / 2;
    let r, g, b;

    if (h < 60) { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()}`;
}

function hexToHsl(hex) {
    let r = parseInt(hex.substring(1, 3), 16) / 255;
    let g = parseInt(hex.substring(3, 5), 16) / 255;
    let b = parseInt(hex.substring(5, 7), 16) / 255;

    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; 
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}


function generateColorPalette() {
    colorPalette.innerHTML = ""; 

    colors.forEach(row => {
        const rowDiv = document.createElement("div");
        rowDiv.style.display = "flex";

        row.forEach(color => {
            const colorBox = document.createElement("div");
            colorBox.classList.add('color-box');
            colorBox.style.backgroundColor = color;
            colorBox.dataset.color = color;

            colorBox.addEventListener('click', () => updateColor(color));

            rowDiv.appendChild(colorBox);
        });

        colorPalette.appendChild(rowDiv);
    });
}



function updateColor(color) {
    let h, s, l;

    
    if (color.startsWith("#")) {
        const hsl = hexToHsl(color);
        h = hsl.h;
        s = hsl.s;
        l = hsl.l;
    } else {  
        const hslValues = color.match(/hsl\((\d+), (\d+)%, (\d+)%\)/);
        h = parseInt(hslValues[1]);
        s = parseInt(hslValues[2]);
        l = parseInt(hslValues[3]);
    }

    
    const colorHsl = `hsl(${h}, ${s}%, ${l}%)`;
    colorDisplay.style.backgroundColor = colorHsl;

    
    const hexColor = hslToHex(h, s, l);
    colorHexInput.value = hexColor.toUpperCase(); 

    
    dibujarTriangulo(hexColor);
    cambiarColor3D(hexColor);
}


function updateFromSliders() {
    const saturation = saturationSlider.value;
    const hue = hueSlider.value;
    const lightness = 50;  

    updateColor(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
}


saturationSlider.addEventListener('input', updateFromSliders);
hueSlider.addEventListener('input', updateFromSliders);


generateColorPalette();
updateColor("#FF0000"); 