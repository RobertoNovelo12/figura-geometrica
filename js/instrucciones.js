document.addEventListener("DOMContentLoaded", function () {
    const iconoPC = document.getElementById('icono-pc');
    const iconoMovil = document.getElementById('icono-movil');
    const instruccionesPC = document.getElementById('instrucciones-pc');
    const instruccionesMovil = document.getElementById('instrucciones-movil');

    if (iconoPC && iconoMovil && instruccionesPC && instruccionesMovil) {
        
        iconoPC.classList.add('activo');
        instruccionesPC.classList.add('activo');

        
        iconoPC.addEventListener('click', () => {
            iconoPC.classList.add('activo');
            iconoMovil.classList.remove('activo');

            instruccionesPC.classList.add('activo');
            instruccionesMovil.classList.remove('activo');
        });

        
        iconoMovil.addEventListener('click', () => {
            iconoMovil.classList.add('activo');
            iconoPC.classList.remove('activo');

            instruccionesMovil.classList.add('activo');
            instruccionesPC.classList.remove('activo');
        });
    }
});