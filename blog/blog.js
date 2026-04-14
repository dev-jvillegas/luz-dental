/* ============================================================
   blog.js — Filtros + Modal de artículo completo
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     FILTROS DE CATEGORÍA
     ---------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('.blog-post-card');
  const emptyMsg   = document.getElementById('blog-empty');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      let visible  = 0;

      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden-card', !match);
        if (match) visible++;
      });

      if (emptyMsg) emptyMsg.classList.toggle('hidden', visible > 0);
    });
  });


  /* ----------------------------------------------------------
     MODAL DE ARTÍCULO COMPLETO
     ---------------------------------------------------------- */
  const modal        = document.getElementById('article-modal');
  const backdrop     = document.getElementById('modal-backdrop');
  const closeBtn     = document.getElementById('modal-close');
  const modalThumb   = document.getElementById('modal-thumb');
  const modalTag     = document.getElementById('modal-tag');
  const modalTitle   = document.getElementById('modal-title');
  const modalDate    = document.getElementById('modal-date');
  const modalContent = document.getElementById('modal-content');

  // Abre el modal con los datos de la tarjeta
  document.querySelectorAll('.blog-read-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.blog-post-card');
      if (!card) return;

      // Thumbnail del modal: mismo color que la tarjeta
      const thumbKey = card.dataset.thumb || '';
      modalThumb.className = `article-modal__thumb blog-thumb--${thumbKey}`;
      modalThumb.innerHTML = ''; // sin SVG ni iconos

      // Metadatos
      modalTag.textContent   = card.dataset.tag   || '';
      modalTitle.textContent = card.dataset.title || '';
      modalDate.innerHTML    = `<i class="fa-regular fa-calendar"></i> ${card.dataset.date || ''}`;
      modalContent.innerHTML = card.dataset.content || '';

      // Mostrar
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      setTimeout(() => closeBtn.focus(), 50);
    });
  });

  // Cerrar modal
  const closeModal = () => {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  };

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

});
