# АРХИТЕКТУРА И СВЯЗИ МЕЖДУ ЭКРАНАМИ ONEMOMENT
## MODULE FEDERATION + REACT NATIVE
**Версия:** 1.0 UPDATED | **Дата:** 21.09.2025

================================================================================

## 📊 ОБЩАЯ СТРУКТУРА: 81 ЭКРАН (ТОЧНО!)

### Распределение по приложениям:
```
┌──────────────────────────────────────────┐
│      ONEMOMENT ECOSYSTEM (81 экран)      │
├──────────────────────────────────────────┤
│ 1. Guest App         │ 51 экран         │
│ 2. Waiter App        │ 7 экранов        │
│ 3. Kitchen App       │ 5 экранов        │
│ 4. Restaurant Admin  │ 8 экранов        │
│ 5. Concierge App     │ 4 экрана         │
│ 6. Housekeeping App  │ 4 экрана         │
│ 7. Room Service App  │ 2 экрана  ✅     │
│ 8. Hotel Admin       │ 7 экранов        │
└──────────────────────────────────────────┘
ИТОГО: 81 экран (мобильные приложения)
+ 2 Web приложения (Super Admin, Analytics)
```

================================================================================

## 🏗️ MODULE FEDERATION ARCHITECTURE

### Динамическая загрузка модулей

```javascript
// React Native + Re.Pack Module Federation
const ModuleLoader = {
  // Загружаются по требованию с CDN
  restaurant: () => import('restaurant@cdn/bundle'), // 2MB
  hotel: () => import('hotel@cdn/bundle'),          // 2MB
  esim: () => import('esim@cdn/bundle'),           // 1MB
  translator: () => import('translator@cdn/bundle')  // 1MB
}

// Host App - всего 5-8MB!
// Модули грузятся когда пользователь их открывает
```

### Структура навигации с Module Federation

```typescript
// ModuleLoader Component
<ModuleLoader
  moduleName="restaurants"
  screenName="QRScanner"
  fallback={<LoadingScreen />}
/>
```

================================================================================

## 1️⃣ GUEST APP - НАВИГАЦИОННАЯ КАРТА (51 ЭКРАН)

### АВТОРИЗАЦИЯ (Экраны 1-3)
```mermaid
S1[1.Splash] --> S2[2.Phone Login]
S2 --> S3[3.OTP Verify]
S3 --> S4[4.Home Dashboard]
```

### ГЛАВНАЯ НАВИГАЦИЯ (Экран 4) - Module Federation Hub
```javascript
S4[4.Home Dashboard] --> {
  restaurants: "Dynamic Load",  // 28 экранов
  hotel: "Dynamic Load",        // 10 экранов
  esim: "Dynamic Load",         // 5 экранов
  translator: "Dynamic Load"    // 5 экранов
}
```

### RESTAURANT MODULE (Экраны 5-32) - 28 экранов

**Основной флоу заказа:**
```
5.QR Scanner → 6.Table Confirm → 7.Menu Categories → 8.Category Items 
→ 9.Item Detail → 10.Cart → 11.Payment Method → 12.Payment Process 
→ 13.Order Success → 14.Orders History → 15.Order Details
```

**Дополнительные экраны:**
```
16.Restaurant Search ←→ 17.Filters
     ↓
18.Restaurant Details → 19.Reviews → 20.Write Review
     ↓
31.Table Booking → 32.Booking Confirm
```

**Вспомогательные:**
```
21.Favorites     24.Split Bill    27.Help & FAQ
22.Notifications 25.Waiter Call   28.Settings
23.Promo Codes   26.Language      29.Profile
30.Loyalty Program
```

### HOTEL MODULE (Экраны 33-42) - 10 экранов

**Флоу бронирования:**
```
33.Hotel Search → 34.Hotel Details → 35.Room Selection 
→ 36.Hotel Booking → 37.Digital Check-in → 38.Digital Key
```

**Room Service:**
```
39.Room Service Menu → 10.Cart (reuse) → 40.Concierge Chat
```

**Check-out:**
```
41.Express Checkout → 42.Hotel Invoice
```

### eSIM MODULE (Экраны 43-47) - 5 экранов
```
43.eSIM Marketplace → 44.Regional Packages → 45.Package Details
→ 46.eSIM Activation → 47.My eSIMs
```

### TRANSLATOR MODULE (Экраны 48-51) - 5 экранов
```
48.Voice Translator
49.Camera Translator  
50.Text Translator
51.Phrase Book
```

================================================================================

## 2️⃣ WAITER APP - FLOW (7 ЭКРАНОВ)

### Навигационная структура:
```
W52[52.Waiter Login] --> W53[53.Orders Dashboard]
W53 --> W54[54.Table Management]
W53 --> W55[55.Order Details]
W53 --> W56[56.Call Requests]
W53 --> W57[57.Tips Management]
W53 --> W58[58.Shift Statistics]
```

### WebSocket взаимодействие с Guest App:
```javascript
// Real-time события
Guest[Guest App] --ORDER_CREATED--> W53[Orders Dashboard]
W55[Order Details] --STATUS_UPDATE--> Guest[Guest App]
Guest[Guest App] --WAITER_CALL--> W56[Call Requests]
```

================================================================================

## 3️⃣ KITCHEN APP - FLOW (5 ЭКРАНОВ)

### Навигационная структура:
```
K59[59.Kitchen Login] --> K60[60.Orders Queue]
K60 --> K61[61.Order Details]
K60 --> K62[62.Preparation Timer]
K60 --> K63[63.Ingredients Check]
```

### WebSocket взаимодействие:
```javascript
Waiter[Waiter App] --ORDER_CONFIRMED--> K60[Orders Queue]
K61[Order Details] --DISH_READY--> Waiter[Waiter App]
K61[Order Details] --COOKING_STARTED--> Guest[Guest App]
```

================================================================================

## 4️⃣ RESTAURANT ADMIN - FLOW (8 ЭКРАНОВ)

### Навигационная структура:
```
A64[64.Admin Dashboard] --> A65[65.Menu Management]
A64 --> A66[66.Staff Management]
A64 --> A67[67.Analytics]
A64 --> A68[68.Promotions]
A64 --> A69[69.Reviews]
A64 --> A70[70.Settings]
A64 --> A71[71.Financial Reports]
```

================================================================================

## 5️⃣-8️⃣ ОТЕЛЬНЫЕ ПРИЛОЖЕНИЯ

### 5. Concierge App (4 экрана): 72-75
### 6. Housekeeping App (4 экрана): 76-79
### 7. Room Service App (2 экрана): 80-81 ✅
### 8. Hotel Admin (7 экранов): Web-based

================================================================================

## 🔄 REAL-TIME СОБЫТИЯ МЕЖДУ ЭКРАНАМИ

### ORDER FLOW - Полный цикл заказа:

```typescript
1. Guest.Screen9 (Item Detail) 
   ↓ ADD_TO_CART (Zustand store)
2. Guest.Screen10 (Cart)
   ↓ CREATE_ORDER (GraphQL mutation)
3. Waiter.Screen53 (Orders Dashboard) [NEW ORDER NOTIFICATION]
   ↓ CONFIRM_ORDER
4. Kitchen.Screen60 (Orders Queue) [ORDER APPEARS]
   ↓ START_COOKING
5. Guest.Screen15 (Order Details) [STATUS: COOKING]
   ↓ DISH_READY
6. Waiter.Screen55 (Order Details) [READY TO SERVE]
   ↓ DELIVER
7. Guest.Screen12 (Payment) 
   ↓ PAY (TON Gateway)
8. Admin.Screen64 (Dashboard) [REVENUE UPDATE]
```

### WAITER CALL FLOW:

```typescript
1. Guest.Screen25 (Waiter Call)
   ↓ CALL_WAITER (WebSocket)
2. Waiter.Screen56 (Call Requests) [VIBRATION + SOUND]
   ↓ ACCEPT_CALL
3. Guest.Screen25 [STATUS: WAITER COMING]
```

================================================================================

## 🔗 DEEP LINKING СТРУКТУРА

### Guest App Routes:
```
onemoment://restaurant/{id}/menu
onemoment://restaurant/{id}/table/{tableId}
onemoment://order/{orderId}
onemoment://booking/{bookingId}
onemoment://esim/package/{packageId}
onemoment://hotel/{hotelId}/room/{roomId}
onemoment://profile
onemoment://loyalty
```

### Staff Apps Routes:
```
onemoment-waiter://orders/{orderId}
onemoment-waiter://table/{tableId}
onemoment-kitchen://order/{orderId}
onemoment-admin://analytics/date/{date}
```

================================================================================

## 🔐 РОЛИ И ДОСТУПЫ К ЭКРАНАМ

### Публичные экраны (без авторизации):
- Screen 1-2: Splash, Phone Login
- Screen 5: QR Scanner
- Screen 16-18: Restaurant Browse

### Авторизованные экраны (Guest):
- Screen 4+: Все основные функции
- Screen 29: Profile
- Screen 30: Loyalty

### Staff Only:
- Waiter App: PIN + Restaurant Code
- Kitchen App: Station Login
- Admin Apps: Email + Password + 2FA

================================================================================

## 📊 СТАТИСТИКА ИСПОЛЬЗОВАНИЯ ЭКРАНОВ

### Наиболее используемые (>100 раз/день):
1. Screen 7: Menu Categories - точка входа
2. Screen 8: Category Items - просмотр блюд
3. Screen 10: Cart - корзина
4. Screen 53: Waiter Orders - постоянный мониторинг

### Критические для конверсии:
1. Screen 5: QR Scanner (вход в систему)
2. Screen 10: Cart (конверсия в заказ)
3. Screen 12: Payment (завершение покупки)

### Редко используемые (<10 раз/день):
- Screen 26: Language (один раз настроил)
- Screen 28: Settings (редкие изменения)
- Screen 63: Ingredients Check (по необходимости)

================================================================================

## ⚡ ОПТИМИЗАЦИЯ НАВИГАЦИИ

### Быстрые переходы (shortcuts):
```javascript
// Жесты из любого экрана
- Swipe Right → Cart (Screen 10)
- Long Press Logo → Home (Screen 4)
- Shake Device → Waiter Call (Screen 25)
```

### Bottom Navigation (постоянная):
```
[Home] [Menu] [Orders] [Profile] [More]
   4      7      14       29      Settings
```

### Контекстные действия:
```typescript
From Order Details:
- "Repeat Order" → Cart with same items
- "Share" → Deep link to order
- "Help" → Chat with support
```

================================================================================

## 🧩 ТЕХНИЧЕСКИЕ СВЯЗИ

### Shared Components между экранами:

```typescript
// Используются в 10+ экранах
- CartButton (показывает количество)
- PriceDisplay (с конвертацией валют)
- LoadingOverlay (единый стиль)
- ErrorBoundary (обработка ошибок)

// Используются в 5+ экранах  
- RestaurantCard
- MenuItemCard
- OrderStatusBadge
- RatingStars

// Специфичные компоненты
- QRScanner (только Screen 5)
- PaymentForm (только Screen 12)
- KitchenTimer (только Screen 62)
```

### State Management связи (Zustand):

```typescript
// Глобальные stores (Zustand) ✅ ОБНОВЛЕНО
const useUserStore = create(...)      // информация пользователя
const useCartStore = create(...)      // корзина (screens 8,9,10,11,12)
const useOrdersStore = create(...)    // заказы (screens 13,14,15)
const useRestaurantStore = create(...) // текущий ресторан

// Локальные states
- Каждый экран имеет свой local state
- Синхронизация через WebSocket events
```

### WebSocket каналы:

```javascript
// Подписки по ролям
guest.subscribe(`table:${tableId}`)
waiter.subscribe(`restaurant:${restaurantId}:orders`)
kitchen.subscribe(`restaurant:${restaurantId}:kitchen`)
admin.subscribe(`restaurant:${restaurantId}:all`)
```

================================================================================

## 📈 МЕТРИКИ ПЕРЕХОДОВ

### Воронка конверсии:
```
QR Scan (100%) → Table Confirm (95%) → Menu View (90%)
→ Add to Cart (40%) → Checkout (35%) → Payment (30%)
→ Success (28%) → Review (5%)
```

### Среднее время на экране:
```yaml
Menu Categories: 45 сек
Item Details: 30 сек
Cart: 90 сек
Payment: 120 сек
Order Tracking: 15 мин
```

### Частота возвратов (bounce rate):
```yaml
QR Scanner: 5% (отличное удержание)
Menu: 10% (хорошее)
Cart: 25% (нужна оптимизация)
Payment: 15% (приемлемо)
```

================================================================================

## 🚀 РЕКОМЕНДАЦИИ ПО ОПТИМИЗАЦИИ

### Приоритет разработки:
1. **Критический путь** (Screens 5→10→12→13)
2. **Waiter flow** (Screens 52→53→55)
3. **Kitchen display** (Screens 59→60→61)
4. **Nice to have** (остальные экраны)

### Переиспользование с Module Federation:
```javascript
// Shared между модулями
- Cart логика (Restaurant + Hotel)
- Payment flow (универсальный)
- Profile/Settings (все роли)
- UI Kit (все приложения)
```

### Упрощения для MVP (21 экран):
- ✅ Базовый Restaurant flow
- ✅ Минимальный Waiter App
- ✅ Простой Kitchen Display
- ❌ Отложить: Loyalty, Hotel, eSIM

================================================================================

## 💡 MODULE FEDERATION ОПТИМИЗАЦИИ

### Lazy Loading стратегия:
```javascript
// Предзагрузка популярных модулей
requestIdleCallback(() => {
  import('restaurant'); // в фоне
  import('esim');      // после restaurant
});
```

### Кэширование модулей:
```javascript
// IndexedDB для offline
await cacheModule('restaurant', bundle);
await cacheModule('hotel', bundle);
```

### Версионирование:
```javascript
// A/B testing разных версий
const version = getUserVersion(userId);
import(`restaurant@${version}`);
```

================================================================================

**Документ обновлён:** 21.09.2025  
**Версия:** 1.0 UPDATED  
**Архитектура:** React Native + Module Federation  
**Статус:** Соответствует PROJECT_RULES  

**ВМЕСТЕ СОЗДАЁМ РЕВОЛЮЦИЮ В ПУТЕШЕСТВИЯХ!** 🚀
