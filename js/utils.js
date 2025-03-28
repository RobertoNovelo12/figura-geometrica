function getStoredValues() {
    
    let base = parseFloat(localStorage.getItem("base"));
    let altura = parseFloat(localStorage.getItem("altura"));
    
    
    if (isNaN(base)) base = 1;
    if (isNaN(altura)) altura = 1;
    
    return { base, altura };
}

function setStoredValues(base, altura) {
    localStorage.setItem("base", base);
    localStorage.setItem("altura", altura);
}

function validateInputs(base, altura) {
    if (base >= 1000 || altura >= 1000) {
        alert("No se puede generar la figura 3D si la base o altura son mayores o iguales a 1000.");
        return false;
    }
    if (isNaN(base) || isNaN(altura)) {
        alert("Por favor, ingrese valores válidos.");
        return false;
    }
    return true;
}