(function () {
  'use strict';

  var selected = new Map();
  var counterEl = document.getElementById('dock-counter');
  var openOrderBtn = document.getElementById('open-order-btn');
  var orderModal = document.getElementById('order-modal');
  var orderModalClose = document.getElementById('order-modal-close');
  var orderForm = document.getElementById('order-form');
  var previewEl = document.getElementById('order-services-preview');
  var baseProfileUrl = 'https://max.ru/u/f9LHodD0cOKqoPsd_Nw4LzKoPxXF-Y3RIXTB4YAE0KlUggtgNmnXoHqGal0';

  function formatMoney(num) {
    return num.toLocaleString('ru-RU') + ' ₽';
  }

  function renderCalculator() {
    var total = 0;
    selected.forEach(function (s) { total += s.price; });
    var count = selected.size;

    if (counterEl) {
      var noun = 'услуг';
      if (count === 1) noun = 'услуга';
      else if (count >= 2 && count <= 4) noun = 'услуги';
      counterEl.textContent = count + ' ' + noun + ' · ' + formatMoney(total);
    }

    if (previewEl) {
      if (count === 0) {
        previewEl.textContent = 'Услуги не выбраны (вопрос мастеру)';
      } else {
        var names = [];
        selected.forEach(function (s) { names.push(s.name); });
        previewEl.innerHTML = names.join('<br>') + '<div style="margin-top:6px; color:var(--accent-terra); font-weight:600;">Итого: ' + formatMoney(total) + '</div>';
      }
    }
  }

  function initCalculator() {
    var rows = document.querySelectorAll('.service-row');
    rows.forEach(function (row) {
      row.addEventListener('click', function (e) {
        e.preventDefault();

        var id = row.getAttribute('data-id') || row.innerText.trim();
        var nameEl = row.querySelector('.service-name');
        var name = row.getAttribute('data-name') || (nameEl ? nameEl.innerText : 'Услуга');
        var price = parseInt(row.getAttribute('data-price'), 10) || 0;

        if (selected.has(id)) {
          selected.delete(id);
          row.classList.remove('is-selected');
        } else {
          selected.set(id, { name: name, price: price });
          row.classList.add('is-selected');
        }

        renderCalculator();
      });
    });

    renderCalculator();
  }

  function initOrderModal() {
    if (!openOrderBtn || !orderModal) return;

    openOrderBtn.addEventListener('click', function () {
      orderModal.classList.add('is-open');
    });

    function closeModal() {
      orderModal.classList.remove('is-open');
    }

    if (orderModalClose) orderModalClose.addEventListener('click', closeModal);
    orderModal.addEventListener('click', function (e) {
      if (e.target === orderModal) closeModal();
    });

    if (orderForm) {
      orderForm.addEventListener('submit', function (e) {
        e.preventDefault();

        var nameVal = document.getElementById('client-name').value.trim();
        var timeVal = document.getElementById('client-time').value.trim();
        var total = 0;
        selected.forEach(function (s) { total += s.price; });

        var msgParts = ['Здравствуйте, Валентина!'];
        if (nameVal) msgParts.push('Меня зовут ' + nameVal + '.');
        if (timeVal) msgParts.push('Хотела бы записаться на ' + timeVal + '.');

        if (selected.size > 0) {
          msgParts.push('\nВыбрала услуги:');
          selected.forEach(function (s) { msgParts.push('• ' + s.name); });
          msgParts.push('Итого: ' + formatMoney(total));
        } else {
          msgParts.push('\nПодскажите, пожалуйста, адрес кабинета и свободные окна для записи.');
        }

        var fullMsg = msgParts.join('\n');

        if (navigator.clipboard) {
          navigator.clipboard.writeText(fullMsg).catch(function () {});
        }

        closeModal();
        window.open(baseProfileUrl + '?text=' + encodeURIComponent(fullMsg), '_blank');
      });
    }
  }

  function initLightbox() {
    var modal = document.getElementById('lightbox-modal');
    var modalImg = document.getElementById('lightbox-img');
    var closeBtn = document.getElementById('lightbox-close');
    var cells = document.querySelectorAll('.gallery-cell');

    if (!modal || !modalImg) return;

    cells.forEach(function (cell) {
      cell.addEventListener('click', function () {
        var img = cell.querySelector('img');
        if (!img) return;
        modalImg.src = img.src;
        modal.classList.add('is-open');
      });
    });

    function close() { modal.classList.remove('is-open'); }
    if (closeBtn) closeBtn.addEventListener('click', close);
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initCalculator();
    initOrderModal();
    initLightbox();
  });
})();