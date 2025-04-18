class TriangleCalculator {
    constructor() {
        
        this.colorPickerElement = document.getElementById("color-picker-input");
        this.setupColorPicker();
        this.initialize();
    }

    
    setupColorPicker() {
        if (this.colorPickerElement) {
            this.colorPickerElement.addEventListener("input", (e) => {
                this.updateColorDisplay(e.target.value);
            });
        }
    }

    updateColorDisplay(color) {
        const colorDisplay = document.getElementById("selectedColor");
        if (colorDisplay) {
            colorDisplay.style.backgroundColor = color;
        }
    }

    
    calculateArea(base, altura) {
        const esEquilatero = this.isEquilateral(base, altura);
        return esEquilatero
            ? (Math.sqrt(3) / 4 * Math.pow(base, 2))
            : (base * altura) / 2;
    }

    calculatePerimeter(base, altura) {
        const esEquilatero = this.isEquilateral(base, altura);
        return esEquilatero
            ? 3 * base
            : 2 * Math.sqrt(Math.pow(base / 2, 2) + Math.pow(altura, 2)) + base;
    }

    isEquilateral(base, altura) {
        const alturaTeorica = (Math.sqrt(3) / 2) * base;
        const diferenciaAltura = Math.abs(altura - alturaTeorica);
        const margenError = alturaTeorica * 0.01;

        const lado1 = base;
        const lado2 = Math.sqrt(Math.pow(base / 2, 2) + Math.pow(altura, 2));
        const lado3 = lado2;

        const diferenciaLados = Math.abs(lado1 - lado2);

        return diferenciaAltura <= margenError && diferenciaLados <= margenError;
    }

    getStoredValues() {
        let base = parseFloat(localStorage.getItem("base")) ||
            parseFloat(document.getElementById("base")?.value) || 5;
        let altura = parseFloat(localStorage.getItem("altura")) ||
            parseFloat(document.getElementById("altura")?.value) || 5;

        return { base, altura };
    }

    setStoredValues(base, altura) {
        localStorage.setItem("base", base);
        localStorage.setItem("altura", altura);
    }

    validateInputs(base, altura) {
        if (base >= 1000 || altura >= 1000) {
            alert("Los valores no pueden ser mayores a 1000");
            return false;
        }
        if (isNaN(base) || isNaN(altura) || base <= 0 || altura <= 0) {
            alert("Ingrese valores numéricos válidos mayores a 0");
            return false;
        }
        return true;
    }

    updateUI(base, altura, area, perimeter, tipo = '') {
        const elements = {
            base: document.getElementById(`baseValor${tipo}`),
            altura: document.getElementById(`alturaValor${tipo}`),
            area: document.getElementById(`resultado${tipo}`),
            perimeter: document.getElementById(`perimetro2d`) 
        };

        if (elements.base) elements.base.textContent = base.toFixed(2);
        if (elements.altura) elements.altura.textContent = altura.toFixed(2);
        if (elements.area) elements.area.textContent = area.toFixed(2);
        if (elements.perimeter) elements.perimeter.textContent = perimeter.toFixed(2); 

        this.displayFormula(base, altura);  

        if (tipo === "equilatero") {
            const formulaHTML = this.getEquilateralFormulaHTML(base, altura, area, perimeter);
            document.getElementById('procedimiento').innerHTML = formulaHTML;
            if (window.renderMathInElement) renderMathInElement(document.getElementById('procedimiento')); 
        } else if (tipo === "isosceles") {
            const formulaHTML = this.getIsoscelesFormulaHTML(base, altura, area, perimeter);
            document.getElementById('procedimiento').innerHTML = formulaHTML;
            if (window.renderMathInElement) renderMathInElement(document.getElementById('procedimiento')); 
        }

        
        if (this.colorPickerElement) {
            this.updateColorDisplay(this.colorPickerElement.value);
        }
    }

    displayFormula(base, altura) {
        const esEquilatero = this.isEquilateral(base, altura);

        const formulaAreaContainer = document.getElementById('formulaArea');
        const formulaPerimetroContainer = document.getElementById('formulaPerimetro');
        const procedimientoContainer = document.getElementById('procedimiento');

        let formulaHTMLArea = '';
        let formulaHTMLPerimetro = '';
        let procedimientoHTML = '';

        if (esEquilatero) {
            formulaHTMLArea = `\\[ A = \\frac{\\sqrt{3}}{4}l^2 \\]`;
            formulaHTMLPerimetro = `\\[ P = 3l \\]`;

            procedimientoHTML = `
                <h2>Procedimiento: Triángulo Equilátero</h2>
                <p><strong>Área:</strong> \\[ A = \\frac{\\sqrt{3}}{4}l^2 = \\frac{\\sqrt{3}}{4}(${base.toFixed(2)})^2 = ${(Math.sqrt(3) / 4 * Math.pow(base, 2)).toFixed(2)} \\]</p>
                <p><strong>Perímetro:</strong> \\[ P = 3l = 3 \\times ${base.toFixed(2)} = ${(3 * base).toFixed(2)} \\]</p>
            `;
        } else {
            formulaHTMLArea = `\\[ A = \\frac{b \\times h}{2} \\]`;
            formulaHTMLPerimetro = `\\[ P = 2\\sqrt{(\\frac{b}{2})^2 + h^2} + b \\]`;

            const lado = Math.sqrt(Math.pow(base / 2, 2) + Math.pow(altura, 2));
            procedimientoHTML = `
                <h2>Procedimiento: Triángulo Isósceles</h2>
                <p><strong>Área:</strong> \\[ A = \\frac{b \\times h}{2} = \\frac{${base} \\times ${altura}}{2} = ${(base * altura / 2).toFixed(2)} \\]</p>
                <p><strong>Perímetro:</strong> \\[ P = 2\\sqrt{(\\frac{b}{2})^2 + h^2} + b = 2\\sqrt{${(base / 2).toFixed(2)}^2 + ${altura}^2} + ${base} = ${(2 * Math.sqrt(Math.pow(base / 2, 2) + Math.pow(altura, 2)) + base).toFixed(2)} \\]</p>
                <p><em>Donde cada lado igual mide: ${lado.toFixed(2)}</em></p>
            `;
        }

        if (formulaAreaContainer) {
            formulaAreaContainer.innerHTML = formulaHTMLArea;
            if (window.renderMathInElement) renderMathInElement(formulaAreaContainer); 
        }

        if (formulaPerimetroContainer) {
            formulaPerimetroContainer.innerHTML = formulaHTMLPerimetro;
            if (window.renderMathInElement) renderMathInElement(formulaPerimetroContainer); 
        }

        if (procedimientoContainer) {
            procedimientoContainer.innerHTML = procedimientoHTML;
            if (window.renderMathInElement) renderMathInElement(procedimientoContainer); 
        }
    }

    getEquilateralFormulaHTML(base, altura, area, perimeter) {
        const lado = base;
        return `
            <h2>Procedimiento</h2>
            <strong>Triángulo Equilátero</strong>
            <p><strong>Lados:</strong> ${lado.toFixed(2)} unidades cada uno</p>
            <p><strong>Área:</strong> \\[ A = \\frac{\\sqrt{3}}{4}l^2 = \\frac{\\sqrt{3}}{4}(${lado.toFixed(2)})^2 = ${area.toFixed(2)} \\]</p>
            <p><strong>Perímetro:</strong> \\[ P = 3l = 3 \\times ${lado.toFixed(2)} = ${perimeter.toFixed(2)} \\]</p>
        `;
    }

    getIsoscelesFormulaHTML(base, altura, area, perimeter) {
        const lado = Math.sqrt(Math.pow(base / 2, 2) + Math.pow(altura, 2));
        return `
            <h2>Procedimiento</h2>
            <strong>Triángulo Isósceles</strong>
            <p><strong>Área:</strong> \\[ A = \\frac{b \\times h}{2} = \\frac{${base} \\times ${altura}}{2} = ${area.toFixed(2)} \\]</p>
            <p><strong>Perímetro:</strong> \\[ P = 2\\sqrt{(\\frac{b}{2})^2 + h^2} + b = 2\\sqrt{${(base / 2).toFixed(2)}^2 + ${altura}^2} + ${base} = ${perimeter.toFixed(2)} \\]</p>
            <p><em>Donde cada lado igual mide: ${lado.toFixed(2)}</em></p>
        `;
    }

    guardarValores() {
        const base = parseFloat(document.getElementById("base").value);
        const altura = parseFloat(document.getElementById("altura").value);

        if (!this.validateInputs(base, altura)) return;

        this.setStoredValues(base, altura);
        this.updateUI(base, altura, this.calculateArea(base, altura), this.calculatePerimeter(base, altura));
    }

    ver2D() {
        this.guardarValores();
        window.location.href = 'triangle2d.html';
    }

    ver3D() {
        this.guardarValores();
        window.location.href = 'triangle3d.html';
    }

    volver() {
        window.history.back();
    }

    inicializarValores() {
        const { base, altura } = this.getStoredValues();

        const baseInput = document.getElementById("base");
        const alturaInput = document.getElementById("altura");
        if (baseInput) baseInput.value = base;
        if (alturaInput) alturaInput.value = altura;

        this.updateUI(base, altura, this.calculateArea(base, altura), this.calculatePerimeter(base, altura));
        this.displayFormula(base, altura);
    }

    initialize() {
        this.inicializarValores();
        document.querySelector("button[onclick='guardarValores()']")?.addEventListener("click", () => this.guardarValores());
        
        document.querySelectorAll('.back-button').forEach(button => {
            button.addEventListener('click', () => this.volver());
        });
    }
}


const triangleCalculator = new TriangleCalculator();


export default triangleCalculator;
export const calculateArea = (base, altura) => triangleCalculator.calculateArea(base, altura);
export const calculatePerimeter = (base, altura) => triangleCalculator.calculatePerimeter(base, altura);
export const getStoredValues = () => triangleCalculator.getStoredValues();
export const updateUI = (base, altura, area, perimeter, tipo = '') => 
    triangleCalculator.updateUI(base, altura, area, perimeter, tipo);
export const displayFormula = (base, altura) => triangleCalculator.displayFormula(base, altura);
export const guardarValores = () => triangleCalculator.guardarValores();
export const ver2D = () => triangleCalculator.ver2D();
export const ver3D = () => triangleCalculator.ver3D();
export const volver = () => triangleCalculator.volver();