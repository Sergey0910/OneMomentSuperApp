# 📋 МАСТЕР-ПЛАН РАЗРАБОТКИ ONEMOMENT SUPERAPP

## 🎯 СИСТЕМА ОТСЛЕЖИВАНИЯ ПРОГРЕССА

```yaml
СТАТУСЫ:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⬜ Не начато
🟨 В процессе  
✅ Завершено
🔴 Блокер (нужна помощь)
⏸️ На паузе
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ТЕКУЩИЙ ПРОГРЕСС: ▓░░░░░░░░░ 3/81 экрана (3.7%)
ДНЕЙ В РАЗРАБОТКЕ: 0
ЦЕЛЕВОЙ СРОК: 90 дней
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 🏗️ АРХИТЕКТУРА: FRONTEND + BACKEND

### ЧТО ЕСТЬ В НАЙДЕННЫХ РЕШЕНИЯХ:

```yaml
FRONTEND (Готово):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Ignite - React Native фреймворк
✅ Re.Pack - Module Federation 
✅ WatermelonDB - Offline база данных
✅ TON-Crypto - Блокчейн библиотека
✅ QR Scanner - Готовые компоненты
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BACKEND (Частично):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ QR-Code-System - Node.js API для ресторана
⚠️ PocketBase - Нужно настроить
⚠️ n8n - Нужно настроить workflows
⬜ GraphQL Federation - Нужно создать
⬜ WebSocket сервер - Нужно создать
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ЧТО НУЖНО ДОБАВИТЬ:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. PocketBase как основной backend
2. GraphQL Federation для микросервисов
3. Redis для кэширования
4. PostgreSQL для основных данных
5. WebSocket для real-time
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

# 📅 ФАЗА 0: ПОДГОТОВКА (НЕДЕЛЯ 1)

## День 1: Окружение и Инструменты
⬜ **1.1** Установить Node.js v18+ и npm
```bash
# Проверяем версии
node --version  # должно быть v18+
npm --version   # должно быть v8+
```

⬜ **1.2** Установить React Native CLI
```bash
npm install -g react-native-cli
npm install -g eas-cli  # для Expo build
```

⬜ **1.3** Настроить Android Studio / Xcode
- [ ] Android Studio с Android SDK 31+
- [ ] Xcode 14+ (для Mac)
- [ ] Эмуляторы настроены

⬜ **1.4** Установить вспомогательные инструменты
```bash
npm install -g ignite-cli
npm install -g @callstack/repack-cli
brew install watchman  # для Mac
```

**🤖 CLAUDE ПОМОЖЕТ:** "Настрой мне окружение для React Native разработки"

---

## День 2: Backend Инфраструктура

⬜ **2.1** Установить PocketBase
```bash
# Скачиваем PocketBase
wget https://github.com/pocketbase/pocketbase/releases/download/v0.19.0/pocketbase_0.19.0_darwin_amd64.zip
unzip pocketbase_0.19.0_darwin_amd64.zip
./pocketbase serve
# Открываем http://127.0.0.1:8090/_/
```

⬜ **2.2** Создать схему базы данных в PocketBase
```javascript
// Collections для OneMoment:
- users (авторизация)
- restaurants (рестораны)
- menu_items (блюда)
- orders (заказы)
- hotels (отели)
- bookings (бронирования)
- translations (переводы)
- esim_plans (eSIM тарифы)
```

⬜ **2.3** Установить n8n для автоматизации
```bash
npm install -g n8n
n8n start
# Открываем http://localhost:5678
```

⬜ **2.4** Настроить Docker Compose для всех сервисов
```yaml
# docker-compose.yml
version: '3.8'
services:
  pocketbase:
    image: pocketbase/pocketbase
    ports:
      - "8090:8090"
    volumes:
      - ./pb_data:/pb_data
      
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: onemoment
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secure_password
    ports:
      - "5432:5432"
      
  redis:
    image: redis:7
    ports:
      - "6379:6379"
      
  n8n:
    image: n8nio/n8n
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
```

**🤖 CLAUDE ПОМОЖЕТ:** "Настрой PocketBase схему для OneMoment"

---

## День 3: Создание Проекта

⬜ **3.1** Инициализация через Ignite
```bash
npx ignite-cli@latest new OneMomentSuperApp
cd OneMomentSuperApp

# Отвечаем на вопросы:
? Would you like to use TypeScript? → Yes
? What state management? → MobX-State-Tree
? What internationalization library? → i18n-js
```

⬜ **3.2** Структура проекта
```bash
# Проверяем структуру
tree -L 2
# Должны увидеть:
# OneMomentSuperApp/
# ├── app/
# ├── android/
# ├── ios/
# └── package.json
```

⬜ **3.3** Первый запуск
```bash
# iOS
npx react-native run-ios

# Android
npx react-native run-android

# Должен открыться эмулятор с приложением
```

**🤖 CLAUDE ПОМОЖЕТ:** "Создай базовый проект OneMoment через Ignite"

---

## День 4: Module Federation

⬜ **4.1** Установить Re.Pack
```bash
npm install --save-dev @callstack/repack@next
npm install --save-dev webpack terser-webpack-plugin
```

⬜ **4.2** Клонировать примеры
```bash
# Создаём папку для референсов
mkdir -p references
cd references

# Клонируем Super App пример
git clone https://github.com/callstack/super-app-showcase
```

⬜ **4.3** Настроить webpack.config.js
```javascript
// Копируем из super-app-showcase и адаптируем
cp references/super-app-showcase/webpack.config.js ./
```

⬜ **4.4** Создать структуру модулей
```bash
mkdir -p modules/restaurant
mkdir -p modules/hotel
mkdir -p modules/translator
mkdir -p modules/esim
```

**🤖 CLAUDE ПОМОЖЕТ:** "Настрой Module Federation для 4 модулей OneMoment"

---

## День 5: Offline База Данных

⬜ **5.1** Установить WatermelonDB
```bash
npm install @nozbe/watermelondb
npm install --save-dev @babel/plugin-proposal-decorators

# Для iOS
cd ios && pod install && cd ..
```

⬜ **5.2** Создать схему базы данных
```javascript
// app/models/database/schema.js
// Копируем схему из DETAILED_INTEGRATION_GUIDE.md
```

⬜ **5.3** Настроить синхронизацию с PocketBase
```javascript
// app/services/sync.js
// Настраиваем sync между WatermelonDB и PocketBase
```

**🤖 CLAUDE ПОМОЖЕТ:** "Настрой WatermelonDB с синхронизацией PocketBase"

---

## День 6-7: Интеграция Готовых Решений

⬜ **6.1** Клонировать QR-Code-Ordering-System
```bash
cd references
git clone https://github.com/doublenine99/QR-Code-Ordering-System
```

⬜ **6.2** Адаптировать QR Scanner
```bash
# Копируем нужные файлы
cp references/QR-Code-Ordering-System/src/QRScanner.js \
   app/screens/restaurant/QRScannerScreen.tsx
```

⬜ **6.3** Интегрировать TON платежи
```bash
npm install ton-crypto ton-core @ton-community/func-js
```

**🤖 CLAUDE ПОМОЖЕТ:** "Интегрируй QR scanner и TON платежи"

---

# 📅 ФАЗА 1: MVP RESTAURANT MODULE (НЕДЕЛИ 2-4)

## Неделя 2: Основные Экраны Ресторана

### Понедельник: QR Scanner (Screen 005)
⬜ **Утро:** Адаптация QR scanner из репозитория
⬜ **День:** Интеграция с камерой
⬜ **Вечер:** Тестирование сканирования

### Вторник: Table Confirmation (Screen 006)
⬜ **Утро:** UI компонент подтверждения стола
⬜ **День:** WebSocket подключение к столу
⬜ **Вечер:** Синхронизация с другими устройствами

### Среда: Menu Categories (Screen 007)
⬜ **Утро:** Grid layout категорий
⬜ **День:** Загрузка из PocketBase
⬜ **Вечер:** Offline кэширование

### Четверг: Category Items (Screen 008)
⬜ **Утро:** Список блюд категории
⬜ **День:** Фильтры и сортировка
⬜ **Вечер:** Поиск по блюдам

### Пятница: Item Details (Screen 009)
⬜ **Утро:** Детальный просмотр блюда
⬜ **День:** Модификаторы и опции
⬜ **Вечер:** Добавление в корзину

**🤖 CLAUDE ПОДСКАЗКИ КАЖДЫЙ ДЕНЬ:**
- "Сегодня делаем Screen 005, вот код..."
- "Проверь что WebSocket подключен..."
- "Не забудь про offline режим..."

---

## Неделя 3: Корзина и Оплата

### Понедельник: Cart (Screen 010)
⬜ **Утро:** Отображение корзины
⬜ **День:** Изменение количества
⬜ **Вечер:** Промокоды

### Вторник-Среда: Payment (Screens 011-012)
⬜ **TON интеграция**
⬜ **Stripe/Apple Pay**
⬜ **Тестирование платежей**

### Четверг: Order Success (Screen 013)
⬜ **Анимация успеха**
⬜ **Push уведомления**
⬜ **Трекинг заказа**

### Пятница: Тестирование Flow
⬜ **E2E тест: QR → Заказ → Оплата**
⬜ **Исправление багов**

---

## Неделя 4: Дополнительные Экраны

⬜ **14** Order History
⬜ **15** Reviews & Ratings  
⬜ **16** Favorites
⬜ **17** Restaurant Search
⬜ **18** Filters
⬜ **19** Special Offers
⬜ **20-32** Остальные экраны ресторана

---

# 📅 ФАЗА 2: WAITER & KITCHEN APPS (НЕДЕЛИ 5-6)

## Waiter App (7 экранов)
⬜ **52** Waiter Login
⬜ **53** Tables Overview
⬜ **54** Active Orders
⬜ **55** Order Details
⬜ **56** Payment Processing
⬜ **57** Tips Management
⬜ **58** Shift Report

## Kitchen App (5 экранов)
⬜ **59** Kitchen Dashboard
⬜ **60** Incoming Orders
⬜ **61** Order Preparation
⬜ **62** Ready for Pickup
⬜ **63** Kitchen Analytics

---

# 📅 ФАЗА 3: HOTEL MODULE (НЕДЕЛИ 7-8)

⬜ **33** Hotel Search
⬜ **34** Hotel Details
⬜ **35** Room Selection
⬜ **36** Booking Calendar
⬜ **37** Guest Information
⬜ **38** Payment
⬜ **39** Booking Confirmation
⬜ **40** Digital Check-in
⬜ **41** Digital Room Key
⬜ **42** Room Service

---

# 📅 ФАЗА 4: TRANSLATOR & eSIM (НЕДЕЛЯ 9)

## Translator (5 экранов)
⬜ **43** Voice Translator
⬜ **44** Text Translator
⬜ **45** Camera Translator
⬜ **46** Conversation Mode
⬜ **47** Phrasebook

## eSIM (5 экранов)
⬜ **48** eSIM Marketplace
⬜ **49** Plan Details
⬜ **50** Purchase Flow
⬜ **51** Activation

---

# 📅 ФАЗА 5: ADMIN & SERVICE APPS (НЕДЕЛИ 10-11)

## Restaurant Admin (8 экранов)
⬜ **64-71** Admin панель

## Service Apps (10 экранов)
⬜ **72-75** Concierge
⬜ **76-79** Housekeeping
⬜ **80-81** Room Service

---

# 📅 ФАЗА 6: ФИНАЛИЗАЦИЯ (НЕДЕЛЯ 12)

⬜ **Оптимизация Bundle Size**
⬜ **Производительность**
⬜ **E2E тестирование**
⬜ **Подготовка к релизу**
⬜ **Deployment**

---

# 🤖 КАК CLAUDE ПОМОГАЕТ НА КАЖДОМ ШАГЕ

## ЕЖЕДНЕВНЫЙ РИТУАЛ:

### Утро (Планирование):
```
Вы: "Claude, что делаем сегодня?"
Claude: "Сегодня Screen 007 (Menu Categories). Вот план:
1. Создаём компонент MenuCategoriesScreen.tsx
2. Берём grid layout из food_ordering репозитория
3. Подключаем к PocketBase
4. Добавляем offline кэширование
Начнём?"
```

### День (Разработка):
```
Вы: "Claude, создай MenuCategoriesScreen"
Claude: [Генерирует полный код компонента]

Вы: "Добавь загрузку из PocketBase"
Claude: [Добавляет интеграцию с API]
```

### Вечер (Проверка):
```
Вы: "Claude, проверь что всё работает"
Claude: "Чеклист для Screen 007:
✅ Grid отображается
✅ Данные загружаются
✅ Offline режим работает
⬜ Навигация на Screen 008
Нужно доделать навигацию..."
```

---

# 📊 ДАШБОРД ПРОГРЕССА

## ТЕКУЩАЯ НЕДЕЛЯ: 1
## ТЕКУЩИЙ ДЕНЬ: Понедельник
## СЛЕДУЮЩИЙ ШАГ: Установка Node.js

```yaml
МОДУЛИ:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Restaurant: ▓░░░░░░░░░ 3/28 экранов
Hotel:      ░░░░░░░░░░ 0/10 экранов
Translator: ░░░░░░░░░░ 0/5 экранов
eSIM:       ░░░░░░░░░░ 0/5 экранов
Waiter:     ░░░░░░░░░░ 0/7 экранов
Kitchen:    ░░░░░░░░░░ 0/5 экранов
Admin:      ░░░░░░░░░░ 0/8 экранов
Service:    ░░░░░░░░░░ 0/10 экранов
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BACKEND:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⬜ PocketBase не настроен
⬜ GraphQL Federation не создан
⬜ WebSocket сервер не запущен
⬜ n8n workflows не настроены
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ИНТЕГРАЦИИ:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⬜ TON blockchain
⬜ Stripe платежи
⬜ Firebase уведомления
⬜ Google Translate API
⬜ Airalo eSIM API
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

# 🎯 КОМАНДЫ ДЛЯ БЫСТРОГО СТАРТА

## Копируй и выполняй:

```bash
# 1. Создание проекта (5 минут)
npx ignite-cli@latest new OneMomentSuperApp

# 2. Установка зависимостей (10 минут)
cd OneMomentSuperApp
npm install @nozbe/watermelondb @callstack/repack ton-crypto

# 3. Клонирование примеров (2 минуты)
mkdir references && cd references
git clone https://github.com/callstack/super-app-showcase
git clone https://github.com/doublenine99/QR-Code-Ordering-System
cd ..

# 4. Запуск PocketBase (2 минуты)
wget https://github.com/pocketbase/pocketbase/releases/latest
./pocketbase serve

# 5. Первый запуск (5 минут)
npx react-native run-ios
# или
npx react-native run-android
```

---

# 📝 ЕЖЕДНЕВНЫЕ ОТЧЁТЫ

## Шаблон отчёта:
```yaml
ДАТА: [Дата]
ДЕНЬ ПРОЕКТА: [Номер]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ЗАВЕРШЕНО СЕГОДНЯ:
✅ [Что сделано]

В ПРОЦЕССЕ:
🟨 [Над чем работаем]

БЛОКЕРЫ:
🔴 [Что мешает]

ЗАВТРА:
⬜ [План на завтра]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ЭКРАНОВ ГОТОВО: X/81
ПРОГРЕСС: X%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

# ⚡ ГОРЯЧИЕ КЛАВИШИ

```bash
# Быстрая генерация экрана
alias newscreen="claude-code -p 'Создай экран'"

# Проверка прогресса
alias progress="grep -c '✅' MASTER_PLAN.md"

# Запуск всех сервисов
alias start-all="docker-compose up -d && npx react-native start"

# Синхронизация с бекендом
alias sync="node scripts/sync-pocketbase.js"
```

---

# 🚨 КОГДА НУЖНА ПОМОЩЬ

## Скажи мне:
- "Claude, я застрял на [проблема]"
- "Claude, как сделать [функция]?"
- "Claude, проверь мой код"
- "Claude, что дальше?"

## Я автоматически:
1. Проанализирую проблему
2. Найду решение в репозиториях
3. Сгенерирую код
4. Покажу следующий шаг

---

**📌 ЭТОТ ПЛАН - ЖИВОЙ ДОКУМЕНТ! Я БУДУ ОБНОВЛЯТЬ СТАТУСЫ И ПОДСКАЗЫВАТЬ О СЛЕДУЮЩИХ ШАГАХ!**

**🎯 ПЕРВЫЙ ШАГ: Установи Node.js и отметь ✅ в плане!**