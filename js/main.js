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

    // Escala select — solo usado dentro del canvas 2D
    if (document.getElementById("canvas2D")) {
        const canvas = document.getElementById("canvas2D");
        const ctx = canvas.getContext("2d");
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        const base = parseFloat(localStorage.getItem("base"));
        const altura = parseFloat(localStorage.getItem("altura"));

        if (isNaN(base) || isNaN(altura)) {
            alert("No se encontraron valores válidos de base y altura.");
            return;
        }

        const colorDisplay = document.getElementById("selectedColor");
        const colorPicker = document.getElementById("color-picker-input");
        const colorHexInput = document.getElementById("colorHexInput");
        const escalaSelect = document.getElementById("scale-select");
        const rotacionSelect = document.getElementById("rotation-select");  // Asegúrate de usar este id en HTML

        let escala = parseFloat(escalaSelect.value);
        let rotacion = parseFloat(rotacionSelect.value);
        let colorActual = colorDisplay ? colorDisplay.style.backgroundColor : "#ff0000";

        // Dibuja por primera vez el triángulo con la escala inicial
        dibujarTriangulo(colorActual, base, altura, ctx, escala);

        // Cambiar escala y redibujar
        escalaSelect.addEventListener("change", () => {
        escala = parseFloat(escalaSelect.value);
        dibujarTriangulo(colorActual, base, altura, ctx, escala, rotacion);
    });
        rotacionSelect.addEventListener("change", () => {
        rotacion = parseFloat(rotacionSelect.value);
        dibujarTriangulo(colorActual, base, altura, ctx, escala, rotacion);
    });


        // Cambiar color desde color picker
        if (colorPicker) {
            colorPicker.addEventListener("input", (e) => {
                colorActual = e.target.value;
                colorDisplay.style.backgroundColor = colorActual;
                colorHexInput.value = colorActual;
                dibujarTriangulo(colorActual, base, altura, ctx, escala);
            });
        }

        // Permitir click en el recuadro de color para abrir picker
        if (colorDisplay) {
            colorDisplay.addEventListener("click", () => {
                colorPicker.click();
            });
        }

    }

    // Triángulo estático, botones, etc.
    if (document.getElementById("canvasStatic")) {
        dibujarTrianguloEstatico();

        const calcularBtn = document.getElementById("calcularBtn");
        const ver2DBtn = document.getElementById("ver2DBtn");
        const ver3DBtn = document.getElementById("ver3DBtn");

        if (calcularBtn) calcularBtn.addEventListener("click", guardarValores);
        if (ver2DBtn) ver2DBtn.addEventListener("click", ver2D);
        if (ver3DBtn) ver3DBtn.addEventListener("click", ver3D);
    }

    // Botón para ver procedimiento
    const procedimientoBtn = document.getElementById("procedimientoBtn");
    if (procedimientoBtn) {
        procedimientoBtn.addEventListener("click", () => {
            const base = document.getElementById("base").value;
            const altura = document.getElementById("altura").value;
            const url = `procedimiento.html?base=${base}&altura=${altura}`;
            window.location.href = url;
        });
    }
 const escalaSelect = document.getElementById("scale-select");

    if (escalaSelect && document.getElementById("container-3d")) {
        let escala = parseFloat(escalaSelect.value);

        // Escalar al iniciar
        triangulo3D.actualizarEscala(escala);

        // Cambiar escala al cambiar select
        escalaSelect.addEventListener("change", () => {
            escala = parseFloat(escalaSelect.value);
            triangulo3D.actualizarEscala(escala);
        });
    }


    // Escena 3D
if (document.getElementById("container-3d")) {
    triangulo3D.iniciarEscena();

    const escalaSelect = document.getElementById("scale-select");
    if (escalaSelect) {
        const escala = parseFloat(escalaSelect.value);
        triangulo3D.actualizarEscala(escala);

        escalaSelect.addEventListener("change", () => {
            const nuevaEscala = parseFloat(escalaSelect.value);
            triangulo3D.actualizarEscala(nuevaEscala);
        });
    }

    const rotacionSelect = document.getElementById("rotation-select");
    if (rotacionSelect) {
        // Rotación inicial
        const rotacion = parseFloat(rotacionSelect.value);
        triangulo3D.aplicarRotacion(rotacion);

        rotacionSelect.addEventListener("change", () => {
            const nuevaRotacion = parseFloat(rotacionSelect.value);
            triangulo3D.aplicarRotacion(nuevaRotacion);
        });
    }

    const colorDisplay3d = document.getElementById("selectedColor");
    if (colorDisplay3d) {
        colorDisplay3d.addEventListener("click", () => {
            const colorSeleccionado = colorDisplay3d.style.backgroundColor;
            triangulo3D.cambiarColor(colorSeleccionado);
        });
    }
}
});