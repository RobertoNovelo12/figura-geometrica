import { guardarValores, ver2D, ver3D } from './ui.js';
import { dibujarTrianguloEstatico, dibujarTriangulo } from './canvas2D.js';
import { triangulo3D } from './canvas3D.js';
import { displayFormula } from './ui.js'; 

document.addEventListener("DOMContentLoaded", () => {
    
    const reiniciarBtn = document.getElementById("reiniciarBtn");
    if (reiniciarBtn) {
        reiniciarBtn.addEventListener("click", () => {
            
            document.getElementById("base").value = '';
            document.getElementById("altura").value = '';
            localStorage.removeItem("base");
            localStorage.removeItem("altura");
            document.getElementById("resultado").textContent = '';
            document.getElementById("perimetro2d").textContent = '';
        });
    }

    
    if (document.getElementById("canvasStatic")) {
        dibujarTrianguloEstatico();

        const calcularBtn = document.getElementById("calcularBtn");
        const ver2DBtn = document.getElementById("ver2DBtn");
        const ver3DBtn = document.getElementById("ver3DBtn");

        if (calcularBtn) calcularBtn.addEventListener("click", guardarValores);
        if (ver2DBtn) ver2DBtn.addEventListener("click", ver2D);
        if (ver3DBtn) ver3DBtn.addEventListener("click", ver3D);
    }

    
    if (document.getElementById("canvas2D")) {
        const DEFAULT_COLOR = "#ff0000"; 
        dibujarTriangulo(DEFAULT_COLOR);
        
        const colorInput2d = document.getElementById("color-picker-input"); 
        const colorDisplay = document.getElementById("selectedColor"); 
        const colorHexInput = document.getElementById("colorHexInput"); 

        
        const actualizarColorTriangulo = (color) => {
            dibujarTriangulo(color);
            colorDisplay.style.backgroundColor = color;
            colorHexInput.value = color;
        };

        
        if (colorInput2d) {
            colorInput2d.addEventListener("input", (e) => {
                const colorSeleccionado = e.target.value;
                actualizarColorTriangulo(colorSeleccionado);
            });
        }

        
        if (colorDisplay) {
            colorDisplay.addEventListener("click", () => {
                colorInput2d.click();
            });
        }
    }

    
    const procedimientoBtn = document.getElementById("procedimientoBtn");
    if (procedimientoBtn) {
        procedimientoBtn.addEventListener("click", () => {
            const base = document.getElementById("base").value;
            const altura = document.getElementById("altura").value;
            
            
            const url = `procedimiento.html?base=${base}&altura=${altura}`;
            window.location.href = url;
        });
    }

    
    if (document.getElementById("container-3d")) {
        triangulo3D.iniciarEscena(); 

        
        const colorDisplay3d = document.getElementById("selectedColor");
        if (colorDisplay3d) {
            colorDisplay3d.addEventListener("click", () => {
                const colorSeleccionado = colorDisplay3d.style.backgroundColor;
                triangulo3D.cambiarColor(colorSeleccionado); 
            });
        }
    }
});
