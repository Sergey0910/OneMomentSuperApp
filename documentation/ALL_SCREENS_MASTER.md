# 📱 OneMoment SuperApp - Complete 81 Screens Documentation
> **Автоматически сгенерированная документация**
> **Версия:** 1.0 | **Дата:** 21.09.2025

## 📊 СВОДКА ПО ПРИЛОЖЕНИЯМ

| Приложение | Экраны | Статус | Приоритет |
|------------|--------|--------|-----------|
| Guest App | 51 | 🔄 Документируется | P0 |
| Waiter App | 7 | 🔄 Документируется | P1 |
| Kitchen App | 5 | 🔄 Документируется | P1 |
| Admin App | 8 | 🔄 Документируется | P2 |
| Concierge App | 4 | 🔄 Документируется | P3 |
| Housekeeping App | 4 | 🔄 Документируется | P3 |
| Room Service | 2 | 🔄 Документируется | P3 |
| **ИТОГО** | **81** | | |

---

# 1️⃣ GUEST APP (51 ЭКРАН)

## 🔐 AUTHENTICATION MODULE (Screens 001-003)

### Common Stack:
- react-native-otp-entry (✅ установлена)
- react-native-fingerprint-scanner (✅ установлена)
- PocketBase Auth API
- libphonenumber-js

### Screen 001: Splash Screen
**Status:** ✅ HTML готов | 📝 Документация создана
**Libraries:** Animated API, AsyncStorage
**API:** GET /api/v1/auth/check
**Time:** 2 часа

### Screen 002: Phone Login  
**Status:** ✅ HTML готов | ✅ Документация полная
**Libraries:** react-native-otp-entry, libphonenumber-js
**API:** POST /api/v1/auth/send-otp
**Time:** 4 часа

### Screen 003: OTP Verification
**Status:** ✅ HTML готов | 📝 Документация создана
**Libraries:** react-native-otp-entry
**API:** POST /api/v1/auth/verify-otp
**Time:** 3 часа

### Screen 004: Home Dashboard
**Status:** ✅ HTML готов | 📝 Документация создана
**Libraries:** Module Federation, Zustand
**API:** GET /api/v1/user/profile
**Time:** 6 часов

## 🍽️ RESTAURANT MODULE (Screens 005-032)

### Common Stack:
- react-native-qr-code-scanner (✅ установлена)
- TON Connect SDK (✅ установлена)
- react-native-gifted-chat (✅ установлена)
- react-native-image-picker (✅ установлена)
- PocketBase REST API

### Core Ordering Flow (005-013):
| Screen | Name | Libraries | API | Time |
|--------|------|-----------|-----|------|
| 005 | QR Scanner | QR Scanner, Camera | POST /api/v1/tables/verify | 3h |
| 006 | Table Confirmation | - | POST /api/v1/tables/confirm | 2h |
| 007 | Menu Categories | FlatList, Search | GET /api/v1/menu/categories | 3h |
| 008 | Category Items | VirtualizedList | GET /api/v1/menu/items | 4h |
| 009 | Item Detail | Image Gallery, Modifiers | GET /api/v1/menu/item/:id | 5h |
| 010 | Cart | Zustand, Calculations | - | 4h |
| 011 | Payment Selection | TON Connect | GET /api/v1/payment/methods | 3h |
| 012 | Payment Process | Stripe, TON | POST /api/v1/payment/process | 6h |
| 013 | Order Success | Lottie, Push | POST /api/v1/orders/confirm | 2h |

### Extended Features (014-032):
| Screen | Name | Key Feature | Time |
|--------|------|-------------|------|
| 014 | Order Tracking | WebSocket, Maps | 4h |
| 015 | Order History | Pagination | 3h |
| 016 | Reviews | Gifted Chat, Stars | 3h |
| 017 | Photo Review | Image Picker | 3h |
| 018 | Favorites | AsyncStorage | 2h |
| 019 | Search | Algolia/ElasticSearch | 4h |
| 020 | Filters | Multi Slider | 3h |
| 021 | Restaurant Info | Maps, Gallery | 3h |
| 022 | Table Booking | Date Picker | 4h |
| 023 | Loyalty Program | QR, Points | 4h |
| 024 | Rewards Catalog | - | 3h |
| 025 | Promo Codes | - | 2h |
| 026 | Split Bill | Calculator | 5h |
| 027 | Group Order | WebSocket | 6h |
| 028 | Voice Order | Whisper API | 8h |
| 029 | AR Menu | AR.js | 10h |
| 030 | Nutrition Info | Charts | 3h |
| 031 | Allergen Filter | - | 3h |
| 032 | Restaurant Discovery | Maps, Filters | 5h |

## 🏨 HOTEL MODULE (Screens 033-042)

### Common Stack:
- Mapbox GL (✅ установлена)
- react-native-date-picker (✅ установлена)
- react-native-bottom-sheet (✅ установлена)
- PocketBase Booking API

| Screen | Name | Key Feature | Time |
|--------|------|-------------|------|
| 033 | Hotel Search | Maps, Filters | 5h |
| 034 | Search Results | Pagination | 3h |
| 035 | Hotel Detail | Gallery, Reviews | 4h |
| 036 | Room Selection | Comparison | 4h |
| 037 | Booking Form | Forms, Validation | 4h |
| 038 | Payment | Stripe/TON | 5h |
| 039 | Booking Success | PDF Generation | 3h |
| 040 | Digital Check-in | Forms, Camera | 5h |
| 041 | Digital Room Key | NFC/QR | 6h |
| 042 | Hotel Services | Chat, Orders | 4h |

## 🌐 eSIM MODULE (Screens 043-047)

### Common Stack:
- Airalo API (нужно добавить)
- TON Connect
- QR Generator

| Screen | Name | Key Feature | Time |
|--------|------|-------------|------|
| 043 | eSIM Marketplace | Countries List | 4h |
| 044 | Plan Selection | Comparison | 3h |
| 045 | Purchase | Payment | 4h |
| 046 | eSIM Activation | QR Code | 3h |
| 047 | Usage Dashboard | Charts | 4h |

## 🌍 TRANSLATOR MODULE (Screens 048-051)

### Common Stack:
- i18next (✅ установлена)
- Google Translate API
- Whisper API
- react-native-voice

| Screen | Name | Key Feature | Time |
|--------|------|-------------|------|
| 048 | Voice Translator | Voice Recognition | 6h |
| 049 | Text Translator | Keyboard | 3h |
| 050 | Camera Translator | OCR, AR | 8h |
| 051 | Phrasebook | Categories | 3h |

---

# 2️⃣ WAITER APP (7 ЭКРАНОВ)

| Screen | Name | Features | Time |
|--------|------|----------|------|
| 052 | Waiter Dashboard | WebSocket, Stats | 4h |
| 053 | Active Orders | Real-time | 4h |
| 054 | Table Management | Floor Plan | 5h |
| 055 | Order Taking | Menu, Modifiers | 5h |
| 056 | Payment Processing | POS Integration | 5h |
| 057 | Tips Management | Calculator | 3h |
| 058 | Shift Summary | Reports | 3h |

---

# 3️⃣ KITCHEN APP (5 ЭКРАНОВ)

| Screen | Name | Features | Time |
|--------|------|----------|------|
| 059 | Kitchen Display | WebSocket, Grid | 5h |
| 060 | Order Queue | Priority, Timer | 4h |
| 061 | Order Details | Modifiers | 3h |
| 062 | Inventory Alert | Stock Levels | 4h |
| 063 | Kitchen Analytics | Charts | 4h |

---

# 4️⃣ RESTAURANT ADMIN (8 ЭКРАНОВ)

| Screen | Name | Features | Time |
|--------|------|----------|------|
| 064 | Admin Dashboard | Analytics | 5h |
| 065 | Menu Management | CRUD, Images | 6h |
| 066 | Staff Management | Schedules | 5h |
| 067 | Table Management | Floor Plan | 5h |
| 068 | Analytics | Charts, Export | 6h |
| 069 | Reviews Management | Responses | 4h |
| 070 | Promotions | Campaigns | 5h |
| 071 | Settings | Config | 3h |

---

# 5️⃣ CONCIERGE APP (4 ЭКРАНА)

| Screen | Name | Features | Time |
|--------|------|----------|------|
| 072 | Concierge Dashboard | Requests Queue | 4h |
| 073 | Guest Chat | Gifted Chat | 4h |
| 074 | Local Recommendations | Maps, Lists | 4h |
| 075 | Services Menu | Bookings | 3h |

---

# 6️⃣ HOUSEKEEPING APP (4 ЭКРАНА)

| Screen | Name | Features | Time |
|--------|------|----------|------|
| 076 | Room Status | Floor Plan | 4h |
| 077 | Cleaning Checklist | Tasks | 3h |
| 078 | Supply Request | Inventory | 3h |
| 079 | Shift Report | Summary | 3h |

---

# 7️⃣ ROOM SERVICE (2 ЭКРАНА)

| Screen | Name | Features | Time |
|--------|------|----------|------|
| 080 | Room Service Orders | Queue | 3h |
| 081 | Delivery Status | Tracking | 3h |

---

## 📈 МЕТРИКИ ПРОЕКТА

### Время разработки:
- **Guest App:** 170 часов
- **Waiter App:** 29 часов
- **Kitchen App:** 20 часов
- **Admin App:** 39 часов
- **Concierge App:** 15 часов
- **Housekeeping App:** 13 часов
- **Room Service:** 6 часов
- **ИТОГО:** 292 часа (~37 дней при 8ч/день)

### Приоритизация:
1. **MVP (21 экран):** Screens 1-13, 52-55, 59-61
2. **Phase 2 (30 экранов):** Restaurant Extended
3. **Phase 3 (20 экранов):** Hotel + eSIM
4. **Phase 4 (10 экранов):** Admin + Support

---

## 🛠️ ТЕХНИЧЕСКИЙ СТЕК (ОБЩИЙ)

### Core:
- React Native 0.72+
- TypeScript (strict mode)
- Module Federation (Re.pack)
- Zustand (state)
- React Query (API)
- React Navigation

### Backend:
- PocketBase (main)
- Hasura (GraphQL)
- Redis (cache)
- BullMQ (queues)

### Установленные библиотеки:
✅ Все из TOOLBOX.md используются максимально

---

**📌 Документация сгенерирована автоматически. Детали каждого экрана в отдельных файлах.**