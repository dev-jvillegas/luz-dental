/* ============================================================
   blog.js — Filtros + Modal de artículo completo
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     FILTROS
     ---------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.blog-post-card');
  const emptyMsg = document.getElementById('blog-empty');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      let visible = 0;

      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden-card', !match);
        if (match) visible++;
      });

      if (emptyMsg) {
        emptyMsg.classList.toggle('hidden', visible > 0);
      }
    });
  });

  /* ----------------------------------------------------------
     IMÁGENES DE PORTADA — Una URL por artículo.
     Para usar foto propia: reemplaza la URL de Unsplash por
     la ruta local, p.ej. "../img/blog-extraccion.jpg"
     ---------------------------------------------------------- */
  const coverImages = {
    extraccion: './img/extraccion.webp',
    brackets: './img/brackets.webp',
    guardas: './img/guardas.webp',
    cepillado: './img/cepillado.webp',
    endodoncia: './img/endodoncia.webp',
    aniversario: './img/aniversario.webp',
  };

  /* ----------------------------------------------------------
     MODAL
     ---------------------------------------------------------- */
  const modal = document.getElementById('article-modal');
  const backdrop = document.getElementById('modal-backdrop');
  const closeBtn = document.getElementById('modal-close');
  const modalThumb = document.getElementById('modal-thumb');
  const modalTag = document.getElementById('modal-tag');
  const modalTitle = document.getElementById('modal-title');
  const modalDate = document.getElementById('modal-date');
  const modalContent = document.getElementById('modal-content');

  document.querySelectorAll('.blog-read-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.blog-post-card');
      if (!card) return;

      const thumbKey = card.dataset.thumb || '';
      const imgUrl = coverImages[thumbKey] || '';

      modalThumb.className = `article-modal__thumb blog-thumb--${thumbKey}`;
      modalThumb.innerHTML = imgUrl
        ? `<img src="${imgUrl}" alt="${card.dataset.title}" loading="lazy" />`
        : '';

      modalTag.textContent = card.dataset.tag || '';
      modalTitle.textContent = card.dataset.title || '';
      modalDate.innerHTML = `<i class="fa-regular fa-calendar"></i> ${card.dataset.date || ''}`;
      modalContent.innerHTML = card.dataset.content || '';

      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';

      setTimeout(() => closeBtn.focus(), 50);
    });
  });

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