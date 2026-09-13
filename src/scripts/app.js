class MotionEngine {
  constructor() {
    this.initObservers();
  }

  initObservers() {
    const observerOptions = {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(
      '.hero, .facts, .price-section, .gallery-section, .contact-section, .service-row, .bento__cell'
    );

    animatedElements.forEach((el) => observer.observe(el));

    const services = document.getElementById('services') || document.getElementById('price');
    if (services) {
      observer.observe(services);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new MotionEngine();

  const MAX_PROFILE_URL = 'https://max.ru/u/f9LHodD0cOKqoPsd_Nw4LzKoPxXF-Y3RIXTB4YAE0KlUggtgNmnXoHqGal0';
  const selectedServices = [];

  const burgerBtn = document.getElementById('burger-btn');
  const navMenu = document.getElementById('nav-menu');

  if (burgerBtn && navMenu) {
    burgerBtn.addEventListener('click', () => {
      burgerBtn.classList.toggle('is-active');
      navMenu.classList.toggle('is-active');
    });

    navMenu.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        burgerBtn.classList.remove('is-active');
        navMenu.classList.remove('is-active');
      });
    });
  }

  const header = document.getElementById('nav') || document.getElementById('header');
  const dock = document.getElementById('dock') || document.getElementById('dock-bar');
  const dockCounter = document.getElementById('dock-counter') || document.getElementById('dock-calc');
  const openOrderBtn = document.getElementById('dock-btn-order') || document.getElementById('btn-open-modal') || document.getElementById('open-order-btn');

  const modal = document.getElementById('order-modal') || document.getElementById('modal-overlay');
  const modalCloseBtn = document.getElementById('modal-close') || document.getElementById('btn-close-modal');
  const modalList = document.getElementById('modal-list') || document.getElementById('modal-services-list');
  const modalTotal = document.getElementById('modal-total-val') || document.getElementById('modal-total');
  const btnSubmitMax = document.getElementById('btn-submit-max') || document.getElementById('btn-send-max');

  const lightbox = document.getElementById('lightbox') || document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');

  window.addEventListener('scroll', () => {
    if (!header) return;
    if (window.scrollY > 20) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }, { passive: true });

  const priceHeaders = document.querySelectorAll('.price-group__header, .price__header');
  priceHeaders.forEach((btn) => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.price-group, .price__group');
      if (group) {
        group.classList.toggle('is-open');
        group.classList.toggle('collapsed');
      }
    });
  });

  const serviceRows = document.querySelectorAll('.service-row, .service-item-row');
  serviceRows.forEach((row) => {
    row.addEventListener('click', () => {
      const id = row.dataset.id;
      const name = row.dataset.name || row.querySelector('.service-name, .service-title-text')?.textContent?.trim();
      const price = parseInt(row.dataset.price, 10);

      if (!id || isNaN(price)) return;

      const existingIndex = selectedServices.findIndex((item) => item.id === id);

      if (existingIndex > -1) {
        selectedServices.splice(existingIndex, 1);
        row.classList.remove('is-selected', 'is-checked');
      } else {
        selectedServices.push({ id, name, price });
        row.classList.add('is-selected', 'is-checked');
      }

      updateDock();
    });
  });

  function updateDock() {
    if (!dockCounter) return;
    const count = selectedServices.length;
    const total = selectedServices.reduce((sum, item) => sum + item.price, 0);
    dockCounter.textContent = `${count} услуг · ${total.toLocaleString('ru-RU')} ₽`;
  }

  function redirectToMax() {
    let message = 'Здравствуйте, Валентина! Хочу записаться к вам на маникюр.';

    if (selectedServices.length > 0) {
      const list = selectedServices.map((s) => `• ${s.name} (${s.price} ₽)`).join('\n');
      const total = selectedServices.reduce((sum, item) => sum + item.price, 0);
      message += `\n\nВыбранные услуги:\n${list}\n\nПримерная стоимость: ${total} ₽`;
    }

    const finalUrl = `${MAX_PROFILE_URL}?message=${encodeURIComponent(message)}&text=${encodeURIComponent(message)}`;
    window.location.href = finalUrl;
  }

  function renderModal() {
    if (!modalList || !modalTotal) return;

    if (selectedServices.length === 0) {
      modalList.innerHTML = '<p style="color: #8E8E9A; font-size: 0.95rem; padding: 12px 0;">Услуги не выбраны. Вы можете перейти в чат для прямой консультации.</p>';
      modalTotal.textContent = '0 ₽';
      return;
    }

    modalList.innerHTML = selectedServices.map((item) => `
      <div class="modal__item" style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #EBEBF0;">
        <span>${item.name}</span>
        <b>${item.price.toLocaleString('ru-RU')} ₽</b>
      </div>
    `).join('');

    const total = selectedServices.reduce((sum, item) => sum + item.price, 0);
    modalTotal.textContent = `${total.toLocaleString('ru-RU')} ₽`;
  }

  function closeModal() {
    if (!modal) return;
    modal.setAttribute('hidden', '');
    modal.classList.remove('is-open', 'is-active', 'open');
  }

  if (openOrderBtn) {
    openOrderBtn.addEventListener('click', () => {
      if (modal) {
        renderModal();
        modal.removeAttribute('hidden');
        modal.classList.add('is-open', 'is-active', 'open');
      } else {
        redirectToMax();
      }
    });
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  if (btnSubmitMax) {
    btnSubmitMax.addEventListener('click', redirectToMax);
  }

  const galleryCells = document.querySelectorAll('.bento__cell, .bento-cell, .bento-tile');
  galleryCells.forEach((cell) => {
    cell.addEventListener('click', () => {
      const src = cell.dataset.src || cell.querySelector('img')?.getAttribute('src');
      if (lightbox && lightboxImg && src) {
        lightboxImg.src = src;
        lightbox.removeAttribute('hidden');
        lightbox.classList.add('is-open', 'is-active', 'open');
      }
    });
  });

  if (lightbox) {
    lightbox.addEventListener('click', () => {
      lightbox.setAttribute('hidden', '');
      lightbox.classList.remove('is-open', 'is-active', 'open');
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      if (lightbox) {
        lightbox.setAttribute('hidden', '');
        lightbox.classList.remove('is-open', 'is-active', 'open');
      }
    }
  });
});
