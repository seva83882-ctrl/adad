document.addEventListener('DOMContentLoaded', () => {
  const MAX_PROFILE_URL = 'https://max.ru/u/f9LHodD0cOKqoPsd_Nw4LzKoPxXF-Y3RIXTB4YAE0KlUggtgNmnXoHqGal0';
  const selectedServices = [];

  const burgerBtn = document.getElementById('burger-btn');
  const navMenu = document.getElementById('nav-menu');

  if (burgerBtn && navMenu) {
    burgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = burgerBtn.classList.toggle('is-active');
      navMenu.classList.toggle('is-active');
      document.body.style.overflow = isActive ? 'hidden' : '';
    });

    navMenu.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        burgerBtn.classList.remove('is-active');
        navMenu.classList.remove('is-active');
        document.body.style.overflow = '';
      });
    });
  }

  const dockCounter = document.getElementById('dock-counter');
  const openOrderBtn = document.getElementById('dock-btn-order');

  const modal = document.getElementById('order-modal');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalCloseBtn = document.getElementById('modal-close');
  const modalList = document.getElementById('modal-list');
  const modalTotal = document.getElementById('modal-total-val');
  const btnSubmitMax = document.getElementById('btn-submit-max');
  const modalSubmitText = document.getElementById('modal-submit-text');

  const serviceRows = document.querySelectorAll('.service-row');
  serviceRows.forEach((row) => {
    row.addEventListener('click', () => {
      const id = row.dataset.id;
      const name = row.dataset.name;
      const price = parseInt(row.dataset.price, 10);

      if (!id || isNaN(price)) return;

      const idx = selectedServices.findIndex((item) => item.id === id);

      if (idx > -1) {
        selectedServices.splice(idx, 1);
        row.classList.remove('is-selected');
      } else {
        selectedServices.push({ id, name, price });
        row.classList.add('is-selected');
      }

      updateDockUI();
    });
  });

  function updateDockUI() {
    if (!dockCounter) return;
    const count = selectedServices.length;
    const total = selectedServices.reduce((sum, item) => sum + item.price, 0);
    dockCounter.textContent = `${count} услуг · ${total.toLocaleString('ru-RU')} ₽`;
  }

  function generateMessage() {
    let text = 'Здравствуйте, Валентина! Хочу записаться к вам на маникюр.';
    if (selectedServices.length > 0) {
      const list = selectedServices.map((s) => `• ${s.name} (${s.price} ₽)`).join('\n');
      const total = selectedServices.reduce((sum, s) => sum + s.price, 0);
      text += `\n\nВыбранные услуги:\n${list}\n\nПримерная стоимость: ${total} ₽`;
    }
    return text;
  }

  async function copyOrderAndGoToMax() {
    const textToCopy = generateMessage();

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.warn('Не удалось автоматически скопировать текст', err);
    }

    if (modalSubmitText) {
      modalSubmitText.textContent = 'Скопировано! Открываем MAX...';
    }

    setTimeout(() => {
      window.location.href = MAX_PROFILE_URL;
    }, 400);
  }

  function openOrderModal() {
    if (!modal) {
      copyOrderAndGoToMax();
      return;
    }

    if (modalSubmitText) {
      modalSubmitText.textContent = 'Скопировать заказ и перейти в MAX';
    }

    renderModalItems();
    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeOrderModal() {
    if (!modal) return;
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  function renderModalItems() {
    if (!modalList || !modalTotal) return;

    if (selectedServices.length === 0) {
      modalList.innerHTML = '<p style="color:#777785; padding:16px 0; font-size:0.95rem;">Вы не выбрали ни одной услуги. Нажмите кнопку ниже, чтобы открыть чат с мастером.</p>';
      modalTotal.textContent = '0 ₽';
      return;
    }

    modalList.innerHTML = selectedServices.map((item) => `
      <div class="modal__item">
        <span>${item.name}</span>
        <b>${item.price.toLocaleString('ru-RU')} ₽</b>
      </div>
    `).join('');

    const total = selectedServices.reduce((sum, item) => sum + item.price, 0);
    modalTotal.textContent = `${total.toLocaleString('ru-RU')} ₽`;
  }

  if (openOrderBtn) {
    openOrderBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openOrderModal();
    });
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeOrderModal();
    });
    modalCloseBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeOrderModal();
    });
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', closeOrderModal);
  }

  if (btnSubmitMax) {
    btnSubmitMax.addEventListener('click', (e) => {
      e.preventDefault();
      copyOrderAndGoToMax();
    });
  }

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const bentoCells = document.querySelectorAll('.bento__cell');

  bentoCells.forEach((cell) => {
    cell.addEventListener('click', () => {
      const src = cell.dataset.src;
      if (lightbox && lightboxImg && src) {
        lightboxImg.src = src;
        lightbox.removeAttribute('hidden');
      }
    });
  });

  if (lightbox) {
    lightbox.addEventListener('click', () => {
      lightbox.setAttribute('hidden', '');
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeOrderModal();
      if (lightbox) lightbox.setAttribute('hidden', '');
      if (burgerBtn && navMenu) {
        burgerBtn.classList.remove('is-active');
        navMenu.classList.remove('is-active');
        document.body.style.overflow = '';
      }
    }
  });
});
