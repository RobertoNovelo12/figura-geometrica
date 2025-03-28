export function calculateArea(base, altura) {
    const esEquilatero = checkIfEquilateral(base, altura);
    
    return esEquilatero 
        ? calculateEquilateralArea(base)
        : calculateStandardArea(base, altura);
}

export function calculatePerimeter(base, altura) {
    const esEquilatero = checkIfEquilateral(base, altura);
    
    return esEquilatero
        ? calculateEquilateralPerimeter(base)
        : calculateIsoscelesPerimeter(base, altura);
}



function checkIfEquilateral(base, altura) {
    const alturaTeoricaEquilatero = (Math.sqrt(3) / 2) * base;
    return Math.abs(altura - alturaTeoricaEquilatero) < 0.001;
}

function calculateEquilateralArea(base) {
    return (Math.sqrt(3) / 4) * Math.pow(base, 2);
}

function calculateStandardArea(base, altura) {
    return (base * altura) / 2;
}

function calculateEquilateralPerimeter(base) {
    return 3 * base;
}

function calculateIsoscelesPerimeter(base, altura) {
    const lado = Math.sqrt(Math.pow(base / 2, 2) + Math.pow(altura, 2));
    return 2 * lado + base;
}