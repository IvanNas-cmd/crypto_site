# crypto_site

# 🌉 Crypto Site

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)

Профессиональный криптовалютный дашборд с потоковыми данными в реальном времени и интеграцией Google OAuth2. Проект выполнен в архитектуре монорепозитория с упором на Pixel-Perfect вёрстку, чистый модульный код и высокую производительность.
ССЫЛКА : https://crypto-site-inky.vercel.app
---

## 📋 Содержание
- [Особенности](#-особенности)
- [Технологический стек](#-технологический-стек)
- [Требования](#-требования)
- [Установка и запуск](#-установка-и-запуск)
- [Конфигурация окружения](#-конфигурация-окружения)
- [Структура проекта](#-структура-проекта)
- [Лицензия](#-лицензия)

---

## ✨ Особенности
* ⚡ **Real-time котировки:** Прямое подключение к мульти-стриму Binance WebSocket для мгновенного обновления цен без перегрузки сети.
* 🔐 **Безопасная авторизация:** Интеграция с Google Identity Services (OAuth2) через надежный бэкенд на FastAPI.
* 🎨 **Pixel-Perfect UI:** Адаптивная верстка с кастомными видео-фонами, анимациями и модальными окнами (Vanilla JS + CSS3).
* 🧩 **Динамический интерфейс:** Умная авто-балансировка DOM-узлов при добавлении новых криптовалют из кастомного выпадающего меню.

---

## 🛠 Технологический стек
* **Frontend:** HTML5, CSS3, Vanilla JS (модульная архитектура), сборщик Vite.
* **Backend:** Python 3.10+, FastAPI, Uvicorn.
* **Интеграции:** Binance WebSocket API, CoinGecko CDN (логотипы), Google OAuth2.

---

## ⚙️ Требования
Перед началом убедитесь, что у вас установлены:
* [Node.js](https://nodejs.org/) (версия 16.x или выше)
* [Python](https://www.python.org/) (версия 3.10 или выше)
* Git

---

## 🚀 Установка и запуск

Проект разделен на две части: клиентскую (`frontend/`) и серверную (`backend/`). Для работы приложения необходимо запустить обе.

### 1. Клонирование репозитория
```bash
git clone [https://github.com/vanyanasennik/kairos-digital-bridge.git](https://github.com/vanyanasennik/kairos-digital-bridge.git)
cd kairos-digital-bridge
```

### 2. Запуск Backend (FastAPI)
Откройте терминал и перейдите в папку бэкенда:
```bash
cd backend

# Создание виртуального окружения
python -m venv venv

# Активация окружения (для Mac/Linux):
source venv/bin/activate
# Активация окружения (для Windows):
# venv\Scripts\activate

# Установка зависимостей
pip install -r requirements.txt

# Запуск сервера
uvicorn main:app --reload
```
Дашборд откроется по http://localhost:8000
### 3. Запуск Frontend(Vite)
Откройте новую вкладку терминала и перейдите в папку фронтенда:
```bash
cd frontend

# Установка NPM-пакетов
npm install

# Запуск сервера для разработки
npm run dev
```
Дашборд откроется под http://localhost:5173


### Конфигурация окружения
Для корректной работы авторизации создайте файл .env в папке backend/ по примеру файла .env.example
```bash
# Файл: backend/.env
GOOGLE_CLIENT_ID="ваш-client-id-от-google.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="ваш-секретный-ключ"
FRONTEND_URL="http://localhost:5173"
```

### Лицензия
Распространяется под лицензией MIT

Разработано: Иван Насенник (2026)
