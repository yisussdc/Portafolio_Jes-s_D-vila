// ============================================================
// 1) AÑO AUTOMÁTICO EN EL FOOTER
// ============================================================
document.getElementById('anio').textContent = new Date().getFullYear();

// ============================================================
// 2) MENÚ MÓVIL (hamburguesa)
// ============================================================
const navToggle = document.getElementById('navToggle');
const mainNav = document.querySelector('.main-nav');

navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

// Cierra el menú al hacer clic en un link (útil en móvil)
mainNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => mainNav.classList.remove('is-open'));
});

// ============================================================
// 3) FILTRADO DE PROYECTOS POR CATEGORÍA
// ------------------------------------------------------------
// LÓGICA (para que la entiendas paso a paso):
//
// a) Cada botón de filtro tiene un atributo data-filter, por ejemplo:
//      <button data-filter="web">Desarrollo Web</button>
//
// b) Cada tarjeta de proyecto tiene un atributo data-category, ej:
//      <article data-category="web"> ... </article>
//
// c) Cuando el usuario hace clic en un botón:
//      1. Leemos su data-filter (ej: "web")
//      2. Recorremos TODAS las tarjetas de proyecto
//      3. Si data-filter es "todos" -> mostramos todas
//         Si NO -> comparamos data-filter con data-category de cada tarjeta:
//            - coinciden  -> mostramos la tarjeta
//            - no coinciden -> la ocultamos (clase .is-hidden)
//      4. Marcamos el botón como activo (is-active) y quitamos
//         esa clase de los demás botones.
// ============================================================
const filtroBtns = document.querySelectorAll('.filtro-btn');
const proyectoCards = document.querySelectorAll('.proyecto-card');
const sinResultados = document.querySelector('.sin-resultados');

filtroBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const categoriaSeleccionada = btn.dataset.filter; // "todos", "diseno", "web", etc.

    // Actualiza qué botón se ve "activo"
    filtroBtns.forEach((b) => b.classList.remove('is-active'));
    btn.classList.add('is-active');

    let visibles = 0;

    proyectoCards.forEach((card) => {
      const coincide =
        categoriaSeleccionada === 'todos' ||
        card.dataset.category === categoriaSeleccionada;

      card.classList.toggle('is-hidden', !coincide);
      if (coincide) visibles++;
    });

    // Muestra un mensaje si el filtro no arroja ningún proyecto
    sinResultados.hidden = visibles !== 0;
  });
});

// ============================================================
// 4) FORMULARIO DE CONTACTO (placeholder)
// ------------------------------------------------------------
// Este formulario todavía no envía datos a ningún servidor.
// EDITA AQUÍ: conéctalo a un servicio como Formspree o EmailJS,
// o reemplaza este bloque por tu propia lógica de envío.
// ============================================================
const contactoForm = document.querySelector('.contacto-form');

contactoForm.addEventListener('submit', (evento) => {
  evento.preventDefault();
  alert('Gracias por tu mensaje. (Conecta este formulario a un servicio de envío real, ver comentario en script.js)');
  contactoForm.reset();
});
document.addEventListener('DOMContentLoaded', () => {
  const galeriaCards = document.querySelectorAll('.galeria-card');
  const modal = document.getElementById('lightbox-modal');
  const modalBody = document.getElementById('lightbox-body');
  const modalCaption = document.getElementById('lightbox-caption');

  galeriaCards.forEach(card => {
    card.addEventListener('click', () => {
      // 1. Obtener datos de la tarjeta clickeada
      const img = card.querySelector('img');
      const video = card.querySelector('video');
      const titulo = card.querySelector('.galeria-info h4')?.innerText || '';
      const desc = card.querySelector('.galeria-info p')?.innerText || '';

      // 2. Limpiar modal anterior
      modalBody.innerHTML = '';
      modalCaption.innerHTML = `<h4>${titulo}</h4><p>${desc}</p>`;

      // 3. Inyectar imagen o video según corresponda
      if (video) {
        const videoClon = video.cloneNode(true);
        videoClon.controls = true; // Activa controles de pausa/sonido en pantalla grande
        videoClon.autoplay = true;
        modalBody.appendChild(videoClon);
      } else if (img) {
        const imgClon = document.createElement('img');
        imgClon.src = img.src;
        imgClon.alt = img.alt;
        modalBody.appendChild(imgClon);
      }

      // 4. Mostrar modal
      modal.classList.add('is-active');
      document.body.style.overflow = 'hidden'; // Evita el scroll de fondo
    });
  });
});

// Aseguramos que el código corra cuando la página esté completamente cargada
window.addEventListener('DOMContentLoaded', () => {
  const galeriaCards = document.querySelectorAll('.galeria-card');
  const modal = document.getElementById('lightbox-modal');
  const modalBody = document.getElementById('lightbox-body');
  const modalCaption = document.getElementById('lightbox-caption');

  console.log("Tarjetas encontradas:", galeriaCards.length); // Revisa en la consola que marque más de 0

  if (!modal) {
    console.error("Error: No se encontró el elemento con id 'lightbox-modal'. Revisa el HTML.");
    return;
  }

  galeriaCards.forEach((card) => {
    // Añadimos evento de clic a cada tarjeta
    card.addEventListener('click', (e) => {
      e.stopPropagation(); // Evita interferencias con otros scripts
      
      const img = card.querySelector('img');
      const video = card.querySelector('video');
      const titulo = card.querySelector('.galeria-info h4')?.innerText || '';
      const desc = card.querySelector('.galeria-info p')?.innerText || '';

      // Limpiamos contenido previo
      modalBody.innerHTML = '';
      modalCaption.innerHTML = `<h4>${titulo}</h4><p>${desc}</p>`;

      // Si la tarjeta tiene un video
      if (video) {
        const videoClon = document.createElement('video');
        // Buscamos la fuente (.src) del video o de su etiqueta <source>
        const videoSrc = video.currentSrc || video.querySelector('source')?.src || video.src;
        
        videoClon.src = videoSrc;
        videoClon.controls = true;
        videoClon.autoplay = true;
        videoClon.playsInline = true;
        videoClon.style.maxWidth = '100%';
        videoClon.style.maxHeight = '70vh';
        
        modalBody.appendChild(videoClon);
      } 
      // Si la tarjeta tiene una imagen
      else if (img) {
        const imgClon = document.createElement('img');
        imgClon.src = img.src;
        imgClon.alt = img.alt || '';
        imgClon.style.maxWidth = '100%';
        imgClon.style.maxHeight = '70vh';
        imgClon.style.objectFit = 'contain';
        
        modalBody.appendChild(imgClon);
      }

      // Mostramos la ventana flotante
      modal.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    });
  });
});

// Funciones globales para cerrar la ventana
function cerrarLightbox(event) {
  if (event.target.id === 'lightbox-modal') {
    cerrarLightboxForzado();
  }
}

function cerrarLightboxForzado() {
  const modal = document.getElementById('lightbox-modal');
  const modalBody = document.getElementById('lightbox-body');
  
  if (modal) {
    modal.classList.remove('is-active');
    document.body.style.overflow = 'auto';
    modalBody.innerHTML = ''; // Elimina el video/imagen para detener el audio
  }
}

// Cerrar presionado la tecla ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') cerrarLightboxForzado();
});