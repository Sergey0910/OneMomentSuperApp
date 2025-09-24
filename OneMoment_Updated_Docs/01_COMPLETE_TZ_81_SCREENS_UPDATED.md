# ТЕХНИЧЕСКОЕ ЗАДАНИЕ ONEMOMENT 3.0
## ПОЛНАЯ ЭКОСИСТЕМА с eSIM и TON
**Версия:** 1.0 UPDATED | **Дата:** 21.09.2025

================================================================================

## 🎯 ОБЗОР ПРОЕКТА

### Миссия
Создать полную экосистему из 8+ приложений OneMoment для революции в индустрии гостеприимства с инновационными функциями eSIM и невидимых криптоплатежей.

### Ключевые цифры
- **81 экран** во всех приложениях (точно!)
- **8 отдельных приложений** для разных ролей
- **4 основных модуля** (Рестораны, Отели, Переводчик, eSIM)
- **$3,697,776** прогнозируемый доход в первый год
- **2%** комиссия с TON транзакций
- **20%** комиссия с eSIM продаж

### Партнёрство
**Сергей: 97% | Claude: 3%**

================================================================================

## 🚀 РЕВОЛЮЦИОННЫЕ ИННОВАЦИИ

### 1. eSIM ВМЕСТО НАСТРОЕК
**Почему это прорыв:**
- Первые в мире совместили рестораны и eSIM
- Путешественники получают интернет и еду в одном приложении
- Интеграция с Airalo (крупнейший провайдер eSIM)

**Страницы eSIM модуля (5 экранов):**
1. eSIM Marketplace - 200+ стран
2. Regional Packages - пакеты по регионам
3. Package Details - детали и покупка
4. eSIM Activation - QR-код активации
5. My eSIMs - управление пакетами

**Монетизация:**
- 20% комиссия = $180,000/год
- Средний чек $30
- Target: 100 продаж/день

### 2. TON GATEWAY - НЕВИДИМЫЕ КРИПТОПЛАТЕЖИ
**Почему это уникально:**
- Пользователи НЕ ЗНАЮТ что платят криптой
- Видят привычные рубли/доллары
- Автоматическая конвертация в фоне
- 6-секундные транзакции (быстрее карт!)

**Прогрессивная система кешбэка 2025:**

| Уровень | Заказы | Кешбэк | Привилегии |
|---------|--------|--------|------------|
| **Bronze** | 0-10 | 1% | Базовые |
| **Silver** | 11-30 | 2% | Priority support |
| **Gold** | 31-100 | 3% | VIP столики |
| **Diamond** | 101-500 | 5% | Эксклюзивные мероприятия |
| **Platinum** | 500+ | 7% | Lifetime привилегии |

**Дополнительные бонусы:**
- Streak Bonus: +0.5% за 7 дней подряд
- Friend Referral: +1% за каждого друга
- Birthday Boost: x2 кешбэк в день рождения
- Flash Hours: x3 кешбэк в счастливые часы
- NFT Rewards: коллекционные NFT за достижения

**Монетизация:**
- 2% комиссия = $2,858,496/год
- Средний чек $50
- Target: 10,000 транзакций/день

================================================================================

## 📱 ПОЛНАЯ ЭКОСИСТЕМА ПРИЛОЖЕНИЙ (81 ЭКРАН)

### ОСНОВНЫЕ ПРИЛОЖЕНИЯ

#### 1. OneMoment Guest (51 экран)
Главное приложение для посетителей ресторанов и отелей.

**Модули:**
- Авторизация (3 экрана)
- Restaurant (28 экранов)
- Hotel (10 экранов)
- eSIM (5 экранов)
- Translator (5 экранов)

#### 2. OneMoment Waiter (7 экранов)
Приложение для официантов ресторана.

**Функции:**
- Waiter Login
- Orders Dashboard
- Table Management
- Order Details
- Call Requests
- Tips Management
- Shift Statistics

#### 3. OneMoment Kitchen (5 экранов)
Система отображения заказов для кухни.

**Функции:**
- Kitchen Login
- Orders Queue
- Order Details
- Preparation Timer
- Ingredients Check

#### 4. OneMoment Restaurant Admin (8 экранов)
Панель управления рестораном.

**Функции:**
- Admin Dashboard
- Menu Management
- Staff Management
- Analytics
- Promotions
- Reviews
- Settings
- Financial Reports

### ОТЕЛЬНЫЕ ПРИЛОЖЕНИЯ

#### 5. OneMoment Concierge (4 экрана)
Приложение консьержа отеля.

**Функции:**
- Guest Requests
- Bookings Management
- Recommendations
- Chat with Guests

#### 6. OneMoment Housekeeping (4 экрана)
Приложение для горничных.

**Функции:**
- Room Status Dashboard
- Cleaning Schedule
- Supply Requests
- Issue Reporting

#### 7. OneMoment Room Service (2 экрана) ⚠️ ИСПРАВЛЕНО
Приложение room service.

**Функции:**
- Orders Dashboard
- Delivery Management

#### 8. OneMoment Hotel Admin (7 экранов)
Панель управления отелем.

**Функции:**
- Hotel Dashboard
- Room Management
- Booking Management
- Staff Management
- Pricing Control
- Guest Analytics
- Financial Reports

### ИТОГО: 81 ЭКРАН ✅

================================================================================

## 🏗️ АРХИТЕКТУРА СИСТЕМЫ

### MODULE FEDERATION ARCHITECTURE 🆕

```javascript
// React Native + Re.Pack Module Federation
new Repack.plugins.ModuleFederationPluginV2({
  name: "OneMomentHost",
  filename: "remoteEntry.js",
  remotes: {
    restaurants: "RestaurantApp@[cdn]/restaurants.bundle",
    hotels: "HotelApp@[cdn]/hotels.bundle",
    translator: "TranslatorApp@[cdn]/translator.bundle",
    esim: "eSIMApp@[cdn]/esim.bundle"
  },
  shared: {
    'react': { singleton: true, eager: true },
    'react-native': { singleton: true, eager: true },
    '@apollo/client': { singleton: true },
    'zustand': { singleton: true }
  }
})
```

### Структура папок

```
onemoment/
├── apps/
│   ├── guest-app/          # Основное приложение (51 экран)
│   ├── waiter-app/         # Приложение официанта (7 экранов)
│   ├── kitchen-app/        # Кухонный дисплей (5 экранов)
│   ├── admin-app/          # Админка ресторана (8 экранов)
│   ├── concierge-app/      # Консьерж (4 экрана)
│   ├── housekeeping-app/   # Горничные (4 экрана)
│   ├── room-service-app/   # Room service (2 экрана)
│   └── hotel-admin-app/    # Админка отеля (7 экранов)
│
├── packages/
│   ├── shared-ui/          # Общие UI компоненты
│   ├── api-client/         # GraphQL клиент
│   ├── auth/               # Авторизация
│   └── ton-gateway/        # TON интеграция
│
├── services/
│   ├── restaurants-service/ # Микросервис ресторанов
│   ├── hotels-service/     # Микросервис отелей
│   ├── translator-service/ # Микросервис переводчика
│   └── esim-service/       # Микросервис eSIM
│
└── infrastructure/
    ├── docker/             # Docker конфигурации
    ├── k8s/                # Kubernetes
    └── terraform/          # Infrastructure as Code
```

### Технологический стек ✅ ОБНОВЛЕНО

#### Frontend
- **React Native + Expo** - мобильные приложения
- **Module Federation (Re.Pack)** - динамическая загрузка модулей
- **Zustand** - state management
- **React Navigation** - навигация
- **TypeScript** - 100% типизация

#### Backend (GraphQL Federation)
- **GraphQL Federation** - объединение микросервисов
- **4 изолированных сервиса:**
  - Restaurants Service (MongoDB + Redis)
  - Hotels Service (PostgreSQL + Elasticsearch)
  - Translator Service (PostgreSQL + Redis)
  - eSIM Service (PostgreSQL + TimescaleDB)

#### Интеграции
- **TON Connect 2.0** - блокчейн платежи
- **Airalo API** - eSIM
- **Stripe** - фиатные платежи
- **Firebase** - push уведомления
- **OpenAI** - AI переводчик

#### DevOps
- **GitHub Actions** - CI/CD
- **Docker** - контейнеризация
- **Kubernetes** - оркестрация
- **CloudFlare** - CDN
- **Vercel** - web хостинг

================================================================================

## 🔄 СВЯЗЬ МЕЖДУ РОЛЯМИ

### Event-Driven Architecture

```
┌─────────────┐
│    Guest    │ Creates Order
└──────┬──────┘
       ↓
   [ORDER_CREATED]
       ↓
┌──────┴──────┐
│  WebSocket  │ Broadcasts
└──────┬──────┘
       ↓
   ┌───┴───┬──────┬────────┐
   ↓       ↓      ↓        ↓
[Waiter][Kitchen][Admin][Analytics]
```

### Ключевые события системы

```javascript
// Заказ создан гостем
ORDER_CREATED → Waiter, Kitchen, Admin

// Официант подтвердил
ORDER_CONFIRMED → Guest, Kitchen

// Кухня начала готовить
COOKING_STARTED → Guest, Waiter

// Блюдо готово
DISH_READY → Waiter, Guest

// Заказ доставлен
ORDER_DELIVERED → Guest, Admin

// Оплата получена
PAYMENT_RECEIVED → All roles

// Гость оставил отзыв
REVIEW_SUBMITTED → Admin, Waiter
```

================================================================================

## 💰 БИЗНЕС МОДЕЛЬ

### Монетизация (4 источника дохода)

#### 1. TON платежи: 2% с транзакции
#### 2. eSIM: 20% комиссия Airalo
#### 3. Рестораны: $99-299/месяц подписка
#### 4. Премиум: $9.99/месяц для туристов

### Тарифные планы для ресторанов

| План | Цена | Заказов | Функции |
|------|------|---------|---------|
| **БЕСПЛАТНЫЙ** | $0 | до 100/мес | Базовые функции |
| **СТАНДАРТ** | $99/мес | до 1000 | Все функции + аналитика |
| **ПРЕМИУМ** | $299/мес | ∞ | + API + Priority support |
| **ENTERPRISE** | Custom | ∞ | White label + SLA |

### Unit-экономика
- **CAC:** $3
- **LTV:** $127
- **Payback:** 2 месяца
- **Margin:** 68%

### Прогноз доходов (обновлено)

#### Год 1: $3,697,776
- TON: $2,858,496
- eSIM: $180,000
- Подписки: $539,400
- Premium: $119,880

================================================================================

## 🚀 ROADMAP РЕАЛИЗАЦИИ

### Фаза 1: MVP (21 экран) - 1 неделя
- [x] Screens 1-3: Авторизация ✅
- [ ] Screens 4: Home Dashboard ⏳
- [ ] Screens 5-13: Restaurant core
- [ ] Screens 52-55: Waiter basic
- [ ] Screens 59-61: Kitchen basic

### Фаза 2: Полный Restaurant (47 экранов) - 2 недели
- [ ] Все экраны ресторанного модуля
- [ ] Админка ресторана
- [ ] TON интеграция

### Фаза 3: Экспансия (66 экранов) - 1 месяц
- [ ] Hotel Module
- [ ] eSIM Module
- [ ] Translator Module

### Фаза 4: Полная экосистема (81 экран) - 2 месяца
- [ ] Все вспомогательные приложения
- [ ] AI функции
- [ ] Blockchain rewards

================================================================================

## ⚡ СТАНДАРТЫ КОДА

### Именование
```typescript
// Компоненты: PascalCase
RestaurantMenu.tsx

// Функции: camelCase
getMenuItems()

// Константы: UPPER_SNAKE_CASE
const MAX_ORDER_SIZE = 100;

// Типы: с префиксом T
type TMenuItem = {...}
```

### NASA Power of 10 Rules
- Функции < 60 строк
- Минимум 2 assertion на функцию
- Вложенность < 3 уровней
- Coverage > 85%
- TypeScript strict mode (19 флагов)

================================================================================

## 📊 МЕТРИКИ УСПЕХА

### KPI для приложений

| Приложение | Метрика | Target |
|------------|---------|--------|
| **Guest App** | DAU/MAU | >30% |
| | Session Duration | >5 мин |
| | Conversion Rate | >10% |
| **Waiter App** | Response Time | <30 сек |
| | Orders Handled | >50/день |
| **Kitchen App** | Cook Time | <15 мин |
| | Order Throughput | >100/день |

### Системные метрики
- **System Uptime:** 99.9%
- **API Response:** <200ms
- **WebSocket Latency:** <100ms
- **Bundle Size:** <20MB total

================================================================================

## ✅ ЧЕКЛИСТ ГОТОВНОСТИ

### Технические требования
- [ ] React Native CLI установлен
- [ ] Expo SDK настроен
- [ ] Node.js 20+ для backend
- [ ] Docker Desktop установлен
- [ ] Git репозиторий создан

### MCP Серверы (10/10)
- [x] Filesystem - работа с файлами
- [x] Postgres - база данных
- [x] Web Search - поиск решений
- [x] Analysis Tool - тестирование
- [x] Memory - сохранение паттернов
- [x] Sequential Thinking - планирование
- [x] Web Fetch - документация
- [x] Asana - управление задачами
- [x] GitHub - версионирование
- [x] Context7 - актуальная документация

### Партнёрство
- [x] Сергей: 97% владения
- [x] Claude: 3% за разработку
- [x] Режимы работы определены
- [x] PROJECT_RULES.md актуализирован

================================================================================

## 🎯 КРИТЕРИИ УСПЕХА

1. **Код работает с первого раза** - 95%
2. **Скорость разработки** - x10 с MCP
3. **Размер приложения** - <20MB total
4. **Производительность** - 60 FPS
5. **Zero критических багов**

================================================================================

## 📞 КОНТАКТЫ

### Для разработчиков
- GitHub: github.com/onemoment
- Documentation: docs.onemoment.app
- Path: ~/Desktop/OneMomentSuperApp

### Режимы работы с Claude
- **0️⃣ ХОТФИКС:** 5-30 мин
- **1️⃣ МАКСИМАЛЬНЫЙ:** 3-6 часов
- **2️⃣ ОПТИМАЛЬНЫЙ:** 1-3 часа ⭐
- **3️⃣ БЫСТРЫЙ:** 30-60 мин

================================================================================

**Документ обновлён:** 21.09.2025  
**Версия:** 1.0 UPDATED  
**Статус:** Соответствует PROJECT_RULES  
**Автор:** OneMoment Team + Claude  

**ВМЕСТЕ СОЗДАЁМ РЕВОЛЮЦИЮ В ПУТЕШЕСТВИЯХ!** 🚀
