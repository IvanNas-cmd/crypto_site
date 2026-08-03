import './style.css';
import { initCryptoCards } from './ui.js';
import { SYMBOLS } from './ui.js';
import { initWebSocket } from './websocket.js';
import { initAuthFlow } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
  initCryptoCards();
  initWebSocket();
  initAuthFlow();
  
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  const dropdownBtn = document.getElementById('dropdown-btn');
  const dropdownMenu = document.getElementById('crypto-menu');

  if (dropdownBtn && dropdownMenu) {
    dropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle('show');
      dropdownBtn.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!dropdownBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.remove('show');
        dropdownBtn.classList.remove('active');
      }
    });
  }

  const modal = document.getElementById('info-modal');
  document.querySelectorAll('[data-open-modal]').forEach((button) => {
    button.addEventListener('click', () => modal?.showModal());
  });
  document.getElementById('modal-close')?.addEventListener('click', () => modal?.close());

  // Логика добавления новой монеты из списка
  const dropdownItems = document.querySelectorAll('.dropdown-item');
  
  dropdownItems.forEach(item => {
    item.addEventListener('click', (e) => {
      // 1. Получаем данные монеты из data-атрибутов
      const id = item.getAttribute('data-id');
      const label = item.getAttribute('data-label');
      const name = item.getAttribute('data-name');
      const img = item.getAttribute('data-img');

      // 2. Проверяем, нет ли ее уже на экране (защита от дублирования)
      if (document.getElementById(`price-${label}`)) {
        dropdownMenu.classList.remove('show');
        dropdownBtn.classList.remove('active');
        return;
      }

      // 3. Находим колонки и считаем количество карточек в них
      const leftColumn = document.querySelector('.crypto-column.left');
      const rightColumn = document.querySelector('.crypto-column.right');
      
      const leftCount = leftColumn ? leftColumn.querySelectorAll('.crypto-item').length : 0;
      const rightCount = rightColumn ? rightColumn.querySelectorAll('.crypto-item').length : 0;

      // 4. Создаем карточку и определяем, куда ее добавить
      const newCard = document.createElement('div');
      newCard.className = 'crypto-item';

      if (leftCount <= rightCount) {
        // Добавляем ВЛЕВО (сначала цена, иконка в конце)
        newCard.innerHTML = `
          <span class="crypto-price" id="price-${label}">Loading</span>
          <span class="crypto-change" id="change-${label}" style="font-size: 12px; margin-left: 8px;">0.00%</span>
          <span class="crypto-name">${name}</span>
          <img src="${img}" alt="${label.toUpperCase()}" class="crypto-icon" width="24" height="24">
        `;
        if (leftColumn) leftColumn.appendChild(newCard);
      } else {
        // Добавляем ВПРАВО (сначала иконка, цена в конце)
        newCard.innerHTML = `
          <img src="${img}" alt="${label.toUpperCase()}" class="crypto-icon" width="24" height="24">
          <span class="crypto-name">${name}</span>
          <span class="crypto-price" id="price-${label}">Loading</span>
          <span class="crypto-change" id="change-${label}" style="font-size: 12px; margin-right: 8px;">0.00%</span>
        `;
        if (rightColumn) rightColumn.appendChild(newCard);
      }

      // 5. Добавляем монету в массив настроек и перезапускаем WebSocket!
      // (Функция initWebSocket сама закроет старое соединение и откроет новое)
      SYMBOLS.push({ id, label, stream: `${id}@ticker`, name });
      initWebSocket(); 

      // 6. Закрываем меню
      dropdownMenu.classList.remove('show');
      dropdownBtn.classList.remove('active');
    });
  });
});

