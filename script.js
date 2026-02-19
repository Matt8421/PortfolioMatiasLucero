/**
 * LÓGICA DE NAVEGACIÓN Y FORMULARIO
 * Matias Lucero - Fullstack Portfolio
 */

let menuVisible = false;

// Muestra/Oculta el menú en móviles
function mostrarOcultarMenu() {
    const nav = document.getElementById("nav");
    if (menuVisible) {
        nav.classList = "";
        menuVisible = false;
    } else {
        nav.classList = "responsive";
        menuVisible = true;
    }
}

// Cierra el menú al elegir una opción
function seleccionar() {
    document.getElementById("nav").classList = "";
    menuVisible = false;
}

// Validación y envío del formulario vía Fetch


document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-contacto");

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            // 1. Captura de valores
            const nombre = form.querySelector('input[name="nombre"]').value.trim();
            const email = form.querySelector('input[name="email"]').value.trim();
            const mensaje = form.querySelector('textarea[name="mensaje"]').value.trim();
            const btn = document.getElementById("btn-enviar");

            // 2. Lógica de validación (Regex para solo letras en nombre)
            const nombreRegex = /^[a-zA-ZÀ-ÿ\s]{3,40}$/;
            
            if (!nombreRegex.test(nombre)) {
                alert("Por favor, poné un nombre válido (solo letras, mín. 3).");
                return;
            }

            if (mensaje.length < 10) {
                alert("El mensaje es muy corto, contame un poco más.");
                return;
            }

            // 3. Si pasa las validaciones, enviamos
            btn.innerHTML = 'Enviando... <i class="fa-solid fa-spinner fa-spin"></i>';
            btn.disabled = true;

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    alert("¡Perfecto! El mensaje fue enviado a mi correo.");
                    form.reset();
                } else {
                    alert("Uy, algo falló. Probá de nuevo.");
                }
            } catch (error) {
                alert("Parece que hay un problema de conexión.");
            } finally {
                btn.innerHTML = 'Enviar Mensaje <i class="fa-solid fa-paper-plane"></i>';
                btn.disabled = false;
            }
        });
    }
});


// Animación simple de entrada para las secciones al scrollear
window.addEventListener('scroll', () => {
    const secciones = document.querySelectorAll('.contenido-seccion');
    const triggerBottom = window.innerHeight / 5 * 4;

    secciones.forEach(seccion => {
        const sectionTop = seccion.getBoundingClientRect().top;
        if(sectionTop < triggerBottom) {
             seccion.classList.add('visible'); // <--- Cambiamos style por classList
        }
    });
});




