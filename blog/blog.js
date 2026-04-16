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
    extraccion: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&q=80',
    brackets: 'https://images.unsplash.com/photo-1588776814546-daab30f310ce?w=800&q=80',
    guardas: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800&q=80',
    cepillado: 'https://images.unsplash.com/photo-1559305616-3f99cd43e353?w=800&q=80',
    endodoncia: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=800&q=80',
    aniversario: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80',
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