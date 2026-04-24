/* ============================================================
   main.js — Burger menu, scroll reveal, horario, popup, WA
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     1. BURGER MENU
     ---------------------------------------------------------- */
  const burger = document.getElementById('burger');
  const menu   = document.getElementById('navbar-menu');

  if (burger && menu) {
    burger.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      burger.classList.toggle('open', isOpen);
      burger.setAttribute('aria-expanded', isOpen);
    });
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', false);
      });
    });
  }

  /* ----------------------------------------------------------
     2. SCROLL REVEAL
     ---------------------------------------------------------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.10 }
    );
    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }

  /* ----------------------------------------------------------
     3. DÍA DE HOY EN HORARIO
     0=Dom 1=Lun 2=Mar 3=Mié 4=Jue 5=Vie 6=Sáb
     ---------------------------------------------------------- */
  const today = new Date().getDay();
  document.querySelectorAll('#schedule-table tr[data-day]').forEach(row => {
    if (parseInt(row.dataset.day) === today) {
      row.querySelectorAll('td').forEach(td => {
        if (td.classList.contains('day'))   td.classList.add('today');
        if (td.classList.contains('hours')) td.classList.add('today');
      });
    }
  });

  /* ----------------------------------------------------------
     4. GALERÍA — Ver más / Ver menos
     ---------------------------------------------------------- */
  const galleryToggle = document.getElementById('gallery-toggle');
  const galleryExtra  = document.getElementById('gallery-extra');
  const toggleLabel   = document.getElementById('gallery-toggle-label');
  const toggleArrow   = document.getElementById('gallery-arrow');

  if (galleryToggle && galleryExtra) {
    galleryToggle.addEventListener('click', () => {
      const isOpen = galleryExtra.classList.contains('visible');

      if (isOpen) {
        // Cerrar
        galleryExtra.classList.remove('visible');
        galleryToggle.setAttribute('aria-expanded', 'false');
        toggleLabel.textContent = 'Ver más fotos';

        // Scroll suave de regreso al inicio de la galería
        document.getElementById('galeria').scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        // Abrir
        galleryExtra.classList.remove('hidden');
        // Forzar reflow antes de añadir la clase visible para que la transición funcione
        galleryExtra.offsetHeight;
        galleryExtra.classList.add('visible');
        galleryToggle.setAttribute('aria-expanded', 'true');
        toggleLabel.textContent = 'Ver menos';
      }
    });
  }

  /* ----------------------------------------------------------
     5. POPUP DE PROMOCIONES
     Se muestra una vez por sesión. Para mostrarlo siempre
     en desarrollo, comenta la línea de sessionStorage.
     ---------------------------------------------------------- */
  const overlay  = document.getElementById('promo-popup');
  const closeBtn = document.getElementById('popup-close');

  if (overlay && closeBtn) {
    const seen = sessionStorage.getItem('popupSeen');
    if (!seen) {
      setTimeout(() => {
        overlay.classList.remove('hidden');
      }, 900); // pequeño delay para que la página cargue primero
    }

    const closePopup = () => {
      overlay.classList.add('hidden');
      sessionStorage.setItem('popupSeen', '1');
    };

    closeBtn.addEventListener('click', closePopup);

    // También cerrar al hacer clic en el fondo
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closePopup();
    });

    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closePopup();
    });
  }

});


/* ============================================================
/* ============================================================
   CARRUSEL DE SERVICIOS — 1 servicio por pantalla
   ============================================================ */
(function initCarousel() {
  const track    = document.getElementById('carousel-track');
  const outer    = document.getElementById('carousel-outer');
  const btnPrev  = document.getElementById('carousel-prev');
  const btnNext  = document.getElementById('carousel-next');
  const dotsWrap = document.getElementById('carousel-dots');

  if (!track || !outer || !dotsWrap) return;

  const cards = Array.from(track.children);
  const total = cards.length;
  let currentIdx = 0;
  let isDragging = false;
  let startX = 0;
  let scrollStart = 0;

  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.ariaLabel = `Ir al servicio ${i + 1}`;
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  const dots = Array.from(dotsWrap.children);

  function getGap() {
    const styles = window.getComputedStyle(track);
    return parseFloat(styles.columnGap || styles.gap) || 0;
  }

  function slideWidth() {
    return cards[0].getBoundingClientRect().width + getGap();
  }

  function goTo(idx) {
    const maxIdx = total - 1;
    currentIdx = Math.min(Math.max(0, idx), maxIdx);

    track.style.transform = `translateX(-${currentIdx * slideWidth()}px)`;

    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIdx));

    if (btnPrev) btnPrev.disabled = currentIdx === 0;
    if (btnNext) btnNext.disabled = currentIdx === maxIdx;
  }

  if (btnPrev) btnPrev.addEventListener('click', () => goTo(currentIdx - 1));
  if (btnNext) btnNext.addEventListener('click', () => goTo(currentIdx + 1));

  outer.addEventListener('mousedown', e => {
    isDragging = true;
    startX = e.clientX;
    scrollStart = currentIdx;
    track.style.transition = 'none';
  });

  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const diff = startX - e.clientX;
    const rawOffset = scrollStart * slideWidth() + diff;
    track.style.transform = `translateX(-${Math.max(0, rawOffset)}px)`;
  });

  window.addEventListener('mouseup', e => {
    if (!isDragging) return;
    isDragging = false;
    track.style.transition = '';
    const diff = startX - e.clientX;
    const moved = Math.round(diff / slideWidth());
    goTo(scrollStart + moved);
  });

  outer.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    scrollStart = currentIdx;
  }, { passive: true });

  outer.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(currentIdx + (diff > 0 ? 1 : -1));
  }, { passive: true });

  window.addEventListener('resize', () => goTo(currentIdx));
  goTo(0);
})();
