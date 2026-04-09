/* ============================================================
   main.js — Burger menu, scroll reveal, día de hoy en horario
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     1. BURGER MENU
     Abre/cierra el menú en móvil
     ---------------------------------------------------------- */
  const burger = document.getElementById('burger');
  const menu   = document.getElementById('navbar-menu');

  if (burger && menu) {
    burger.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      burger.classList.toggle('open', isOpen);
      burger.setAttribute('aria-expanded', isOpen);
    });

    // Cierra el menú al hacer clic en un enlace interno
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
     Anima elementos con class="reveal" al entrar en pantalla
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
      { threshold: 0.12 }
    );
    reveals.forEach(el => observer.observe(el));
  } else {
    // Fallback: muestra todo de inmediato si no hay soporte
    reveals.forEach(el => el.classList.add('visible'));
  }


  /* ----------------------------------------------------------
     3. DÍA DE HOY EN EL HORARIO
     Resalta la fila del día actual en la tabla de horarios
     ---------------------------------------------------------- */
  // 0=Dom 1=Lun 2=Mar 3=Mié 4=Jue 5=Vie 6=Sáb
  const today = new Date().getDay();

  const rows = document.querySelectorAll('#schedule-table tr[data-day]');
  rows.forEach(row => {
    if (parseInt(row.dataset.day) === today) {
      row.querySelectorAll('td').forEach(td => {
        if (td.classList.contains('day'))   td.classList.add('today');
        if (td.classList.contains('hours')) td.classList.add('today');
      });
    }
  });

});
