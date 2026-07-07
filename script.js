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
