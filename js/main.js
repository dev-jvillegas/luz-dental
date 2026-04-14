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
     4. POPUP DE PROMOCIONES
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
