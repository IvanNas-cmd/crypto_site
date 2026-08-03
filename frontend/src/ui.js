// Конфигурация монет для отображения
export const SYMBOLS = [
  { id: 'btcusdt', label: 'btc', stream: 'btcusdt@ticker', name: 'Bitcoin' },
  { id: 'ethusdt', label: 'eth', stream: 'ethusdt@ticker', name: 'Ethereum' },
  { id: 'solusdt', label: 'sol', stream: 'solusdt@ticker', name: 'Solana' },
  { id: 'bnbusdt', label: 'bnb', stream: 'bnbusdt@ticker', name: 'Binance Coin' },
  { id: 'xrpusdt', label: 'xrp', stream: 'xrpusdt@ticker', name: 'XRP' }, // Поменяли label с 'usdt' на 'xrp'
  { id: 'dogeusdt', label: 'doge', stream: 'dogeusdt@ticker', name: 'Dogecoin' }
];

/**
 * Инициализирует пустые карточки в DOM
 */
export function initCryptoCards() {
  SYMBOLS.forEach((symbol) => {
    const priceEl = document.getElementById(`price-${symbol.label}`);
    const changeEl = document.getElementById(`change-${symbol.label}`);

    if (priceEl) priceEl.textContent = 'Loading';
    if (changeEl) changeEl.textContent = '0.00%';
  });
}

/**
 * Обновляет данные карточки монеты
 * @param {string} symbolId - ID монеты (напр. btcusdt)
 * @param {string} price - Текущая цена
 * @param {string} change - Изменение в процентах
 */
export function updateCryptoUI(symbolId, price, change) {
  const symbol = SYMBOLS.find((item) => item.id === symbolId);
  if (!symbol) return;

  const priceEl = document.getElementById(`price-${symbol.label}`);
  const changeEl = document.getElementById(`change-${symbol.label}`);

  if (!priceEl || !changeEl) return;

  const value = parseFloat(price);
  const formattedPrice = value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: value >= 10 ? 2 : 4,
    maximumFractionDigits: value >= 10 ? 2 : 4,
  });

  priceEl.textContent = formattedPrice;

  const numChange = parseFloat(change);
  changeEl.textContent = `${numChange > 0 ? '+' : ''}${numChange.toFixed(2)}%`;
  
  changeEl.classList.remove('change-positive', 'change-negative');
  changeEl.classList.add(numChange >= 0 ? 'change-positive' : 'change-negative');

  priceEl.closest('.crypto-item')?.classList.add('is-updated');
  window.setTimeout(() => priceEl.closest('.crypto-item')?.classList.remove('is-updated'), 350);
}
