import { SYMBOLS, updateCryptoUI } from './ui.js';

let ws = null;

export function initWebSocket() {
  const status = document.getElementById('market-status');
  const streams = SYMBOLS.map(s => s.stream).join('/');
  const wsUrl = `wss://stream.binance.com:9443/stream?streams=${streams}`;

  if (ws) ws.close();
  if (status) status.textContent = 'SYNC';

  ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    if (status) status.textContent = 'LIVE';
  };

  ws.onmessage = (event) => {
    try {
      const parsedData = JSON.parse(event.data);
      const ticker = parsedData.data; 
      
      const symbolId = ticker.s.toLowerCase();
      const currentPrice = ticker.c;
      const priceChangePercent = ticker.P;

      updateCryptoUI(symbolId, currentPrice, priceChangePercent);
    } catch (error) {
      if (status) status.textContent = 'ERR';
    }
  };

  ws.onerror = () => {
    if (status) status.textContent = 'ERR';
  };

  ws.onclose = () => {
    if (status) status.textContent = 'WAIT';
    setTimeout(initWebSocket, 3000);
  };
}
