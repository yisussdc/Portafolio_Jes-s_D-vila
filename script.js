// ============================================================
// 1) AÑO AUTOMÁTICO EN EL FOOTER
// ============================================================
const anioEl = document.getElementById('anio');
if (anioEl) {
  anioEl.textContent = new Date().getFullYear();
}

// ============================================================
// 2) MENÚ MÓVIL (Hamburguesa)
// ============================================================
const navToggle = document.getElementById('navToggle');
const mainNav = document.querySelector('.main-nav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Cierra el menú al hacer clic en cualquier enlace (útil en móviles)
  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ============================================================
// 3) FILTRADO DE PROYECTOS POR CATEGORÍA
// ------------------------------------------------------------
// LÓGICA:
// - Cada botón de filtro tiene data-filter ("todos", "diseno", "web", "estrategia").
// - Cada proyecto tiene data-category (puede contener varias palabras: ej. "diseno web").
// - Si es "todos", se muestran todos.
// - Si se elige una categoría, se muestran las filas que incluyan dicha categoría.
// ============================================================
const filtroBtns = document.querySelectorAll('.filtro-btn');
const proyectoFilas = document.querySelectorAll('.proyecto-fila');
const sinResultados = document.querySelector('.sin-resultados');

filtroBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const categoria = btn.dataset.filter;

    // Actualiza el botón activo
    filtroBtns.forEach((b) => b.classList.remove('is-active'));
    btn.classList.add('is-active');

    let visibles = 0;

    proyectoFilas.forEach((fila) => {
      const categoriasFila = fila.dataset.category || '';
      const coincide = (categoria === 'todos') || categoriasFila.includes(categoria);

      if (coincide) {
        fila.classList.remove('is-hidden');
        // Si entra en pantalla al ser mostrado, aseguramos su visibilidad
        fila.classList.add('is-visible');
        visibles++;
      } else {
        fila.classList.add('is-hidden');
      }
    });

    if (sinResultados) {
      sinResultados.hidden = (visibles !== 0);
    }
  });
});

// ============================================================
// 4) ANIMACIONES FLUIDAS AL HACER SCROLL (IntersectionObserver)
// ------------------------------------------------------------
// Esta función detecta cuándo una fila de proyecto (.proyecto-fila)
// entra al campo visual del usuario y le agrega la clase .is-visible.
// Al agregarse la clase, el CSS activa la transición fluida:
// - Columna izquierda (.animate-left) surge desde la izquierda
// - Columna derecha (.animate-right) surge desde la derecha
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  const filas = document.querySelectorAll('.proyecto-fila');

  if ('IntersectionObserver' in window) {
    const scrollObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Una vez animado, dejamos de observarlo para rendimiento
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -60px 0px', // Activa la animación un poco antes de llegar
      threshold: 0.12                  // Se dispara cuando el 12% es visible
    });

    filas.forEach((fila) => scrollObserver.observe(fila));
  } else {
    // Si el navegador es muy antiguo, mostramos todo sin retrasos
    filas.forEach((fila) => fila.classList.add('is-visible'));
  }
});

// ============================================================
// 5) EXPANDIR MINIATURAS: LIGHTBOX / MODAL EN PANTALLA COMPLETA
// ------------------------------------------------------------
// Al presionar cualquier miniatura (.media-thumb) de imagen o video:
// - Se abre el modal con fondo desenfocado
// - Si es VIDEO: se reproduce en grande con controles y audio disponible
// - Si es IMAGEN: se muestra en alta calidad con pie descriptivo
// - Al cerrar: se detiene el audio y video inmediatamente
// ============================================================
const modal = document.getElementById('lightbox-modal');
const modalBody = document.getElementById('lightbox-body');
const modalCaption = document.getElementById('lightbox-caption');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const lightboxCounter = document.getElementById('lightbox-counter');

// Estado activo del álbum en el Lightbox
let activeAlbum = null;

// Función para renderizar el slide actual en el Lightbox
function renderLightboxSlide() {
  if (!activeAlbum || !modalBody) return;
  const slide = activeAlbum.slides[activeAlbum.currentIndex];
  if (!slide) return;

  modalBody.innerHTML = '';

  if (slide.type === 'video') {
    const video = document.createElement('video');
    video.src = slide.src;
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    video.muted = false; // Sonido activado en pantalla grande
    modalBody.appendChild(video);
  } else {
    const img = document.createElement('img');
    img.src = slide.src;
    img.alt = slide.caption || activeAlbum.title;
    modalBody.appendChild(img);
  }

  // Actualizar contador y caption
  if (lightboxCounter) {
    lightboxCounter.style.display = 'inline-block';
    lightboxCounter.textContent = `${activeAlbum.currentIndex + 1} / ${activeAlbum.slides.length}`;
  }

  if (modalCaption) {
    modalCaption.innerHTML = `<h4>${activeAlbum.title}</h4><p>${slide.caption || ''}</p>`;
  }
}

// Función global para navegar en el Lightbox (botones ‹ y ›, flechas de teclado, swipe)
function navLightbox(delta) {
  if (!activeAlbum || activeAlbum.slides.length <= 1) return;
  activeAlbum.currentIndex = (activeAlbum.currentIndex + delta + activeAlbum.slides.length) % activeAlbum.slides.length;
  renderLightboxSlide();
}

// ------------------------------------------------------------
// Navegación en miniatura (botones ‹ y › en la tarjeta del álbum)
// ------------------------------------------------------------
document.addEventListener('click', (e) => {
  const thumbBtn = e.target.closest('.thumb-btn');
  if (!thumbBtn) return;
  e.stopPropagation(); // Evita abrir el modal al pulsar la flecha pequeña

  const albumThumb = thumbBtn.closest('.media-album');
  if (!albumThumb) return;

  const slidesEls = Array.from(albumThumb.querySelectorAll('.album-slides > span, .album-slides > div'));
  if (slidesEls.length === 0) return;

  let currentIndex = parseInt(albumThumb.dataset.currentIndex || '0', 10);
  const delta = thumbBtn.classList.contains('thumb-next') ? 1 : -1;
  currentIndex = (currentIndex + delta + slidesEls.length) % slidesEls.length;
  albumThumb.dataset.currentIndex = currentIndex;

  const targetSlide = slidesEls[currentIndex];
  const src = targetSlide.dataset.src;
  const type = targetSlide.dataset.type;

  const wrapper = albumThumb.querySelector('.media-wrapper');
  const currentMedia = wrapper.querySelector('.album-current-media');

  if (type === 'video') {
    if (currentMedia && currentMedia.tagName.toLowerCase() === 'video') {
      const source = currentMedia.querySelector('source');
      if (source) source.src = src;
      else currentMedia.src = src;
      currentMedia.load();
    }
  } else {
    if (currentMedia && currentMedia.tagName.toLowerCase() === 'img') {
      currentMedia.src = src;
    }
  }

  const counterEl = albumThumb.querySelector('.thumb-counter');
  if (counterEl) {
    counterEl.textContent = `${currentIndex + 1} / ${slidesEls.length}`;
  }
});

// ------------------------------------------------------------
// Clic en cualquier miniatura (.media-thumb) para abrir Lightbox
// ------------------------------------------------------------
document.addEventListener('click', (e) => {
  const thumb = e.target.closest('.media-thumb');
  if (!thumb) return;
  if (e.target.closest('.thumb-slider-controls')) return; // Ya manejado por las flechas pequeñas

  if (!modal || !modalBody) return;

  // CASO A: Es un álbum con múltiples diapositivas / videos
  const slidesEls = Array.from(thumb.querySelectorAll('.album-slides > span, .album-slides > div'));
  if (slidesEls.length > 0) {
    const slides = slidesEls.map((el) => ({
      src: el.dataset.src,
      type: el.dataset.type || 'image',
      caption: el.dataset.caption || ''
    }));

    const startIndex = parseInt(thumb.dataset.currentIndex || '0', 10);
    const title = thumb.dataset.albumTitle || thumb.querySelector('.media-meta h4')?.innerText || 'Álbum';

    activeAlbum = {
      slides,
      currentIndex: startIndex,
      title
    };

    if (lightboxPrev) lightboxPrev.style.display = slides.length > 1 ? 'flex' : 'none';
    if (lightboxNext) lightboxNext.style.display = slides.length > 1 ? 'flex' : 'none';

    renderLightboxSlide();
  } 
  // CASO B: Es una miniatura individual estándar (como en los otros proyectos)
  else {
    activeAlbum = null;
    if (lightboxPrev) lightboxPrev.style.display = 'none';
    if (lightboxNext) lightboxNext.style.display = 'none';
    if (lightboxCounter) lightboxCounter.style.display = 'none';

    const img = thumb.querySelector('img');
    const video = thumb.querySelector('video');
    const titulo = thumb.querySelector('.media-meta h4')?.innerText || '';
    const desc = thumb.querySelector('.media-meta p')?.innerText || '';

    modalBody.innerHTML = '';
    if (modalCaption) {
      modalCaption.innerHTML = `<h4>${titulo}</h4><p>${desc}</p>`;
    }

    if (video) {
      const videoSrc = video.currentSrc || video.querySelector('source')?.src || video.src;
      const modalVideo = document.createElement('video');
      modalVideo.src = videoSrc;
      modalVideo.controls = true;
      modalVideo.autoplay = true;
      modalVideo.playsInline = true;
      modalVideo.muted = false;
      modalBody.appendChild(modalVideo);
    } else if (img) {
      const modalImg = document.createElement('img');
      modalImg.src = img.src;
      modalImg.alt = img.alt || titulo;
      modalBody.appendChild(modalImg);
    }
  }

  // Abre el modal y bloquea el scroll de fondo
  modal.classList.add('is-active');
  document.body.style.overflow = 'hidden';
});

// Función para cerrar el lightbox
function cerrarLightboxForzado() {
  if (modal) {
    modal.classList.remove('is-active');
    document.body.style.overflow = '';
  }
  if (modalBody) {
    modalBody.innerHTML = ''; // Detiene la reproducción de cualquier video y audio
  }
  activeAlbum = null;
}

// Cierra si se hace clic fuera del contenido (en el fondo oscuro)
function cerrarLightbox(event) {
  if (event.target.id === 'lightbox-modal') {
    cerrarLightboxForzado();
  }
}

// Control por teclado (ESC para cerrar, flechas para deslizar)
document.addEventListener('keydown', (e) => {
  if (!modal || !modal.classList.contains('is-active')) return;

  if (e.key === 'Escape') {
    cerrarLightboxForzado();
  } else if (e.key === 'ArrowLeft') {
    navLightbox(-1);
  } else if (e.key === 'ArrowRight') {
    navLightbox(1);
  }
});

// Soporte de gestos táctiles (Swipe) en móvil para deslizar en el Lightbox
let touchStartX = 0;
let touchEndX = 0;

if (modal) {
  modal.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  modal.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        navLightbox(-1); // Deslizar hacia la derecha -> anterior
      } else {
        navLightbox(1);  // Deslizar hacia la izquierda -> siguiente
      }
    }
  }, { passive: true });
}

// ============================================================
// 6) FORMULARIO DE CONTACTO (placeholder)
// ============================================================
const contactoForm = document.querySelector('.contacto-form');
if (contactoForm) {
  contactoForm.addEventListener('submit', (evento) => {
    evento.preventDefault();
    alert('¡Gracias por tu mensaje! Formulario recibido con éxito.');
    contactoForm.reset();
  });
}