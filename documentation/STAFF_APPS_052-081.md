# 👨‍🍳 Staff Applications Documentation (30 screens)

## 📊 ОБЩАЯ ИНФОРМАЦИЯ

| Приложение | Экраны | Пользователи | Приоритет | Время |
|------------|--------|--------------|-----------|--------|
| Waiter App | 7 | Официанты | P1 | 29h |
| Kitchen App | 5 | Повара | P1 | 20h |
| Admin App | 8 | Менеджеры | P2 | 39h |
| Concierge | 4 | Консьержи | P3 | 15h |
| Housekeeping | 4 | Уборщики | P3 | 13h |
| Room Service | 2 | Доставка | P3 | 6h |

---

# 🍴 WAITER APP (Screens 052-058)

## Screen 052: Waiter Dashboard
### Функции:
- WebSocket подключение к кухне
- Активные заказы по столам
- Статистика смены
- Push уведомления о готовности

### Tech Stack:
```javascript
- Socket.io для real-time
- react-native-push-notification
- Zustand для состояния
```

## Screen 053: Active Orders
### Функции:
- Список активных заказов
- Статусы: новый/готовится/готов/подан
- Таймеры для каждого заказа
- Цветовая индикация приоритета

## Screen 054: Table Management
### Функции:
- План зала (SVG)
- Статус столов (свободен/занят/резерв)
- Drag & drop для переноса гостей
- История столов

## Screen 055: Order Taking
### Функции:
- Полное меню ресторана
- Модификаторы и комментарии
- Отправка на кухню
- Split bill функционал

## Screen 056: Payment Processing
### Функции:
- POS терминал интеграция
- Разделение счета
- Чаевые
- Печать чека

## Screen 057: Tips Management
### Функции:
- Учет чаевых (нал/карта)
- Распределение между сменой
- История чаевых
- Экспорт для бухгалтерии

## Screen 058: Shift Summary
### Функции:
- Статистика смены
- Заработанные чаевые
- Количество обслуженных
- Средний чек

---

# 👨‍🍳 KITCHEN DISPLAY (Screens 059-063)

## Screen 059: Kitchen Display System (KDS)
### Функции:
- Grid заказов по станциям
- Цветовая индикация времени
- Bump при готовности
- Sound alerts

### Tech Stack:
```javascript
- WebSocket для синхронизации
- react-native-sound для алертов
- Grid layout оптимизация
```

## Screen 060: Order Queue
### Функции:
- Очередь заказов FIFO
- Приоритеты (VIP, аллергии)
- Группировка по столам
- Время с момента заказа

## Screen 061: Order Details
### Функции:
- Детали блюда
- Модификаторы крупным шрифтом
- Аллергены красным
- История изменений

## Screen 062: Inventory Alert
### Функции:
- Уровень запасов
- Автоматические алерты
- 86'd items (закончившиеся)
- Заказ поставщикам

## Screen 063: Kitchen Analytics
### Функции:
- Среднее время приготовления
- Популярные блюда
- Загрузка по часам
- Производительность поваров

---

# 👔 RESTAURANT ADMIN (Screens 064-071)

## Screen 064: Admin Dashboard
### Функции:
- Выручка real-time
- Количество гостей
- Средний чек
- Сравнение с вчера/неделей/месяцем

### Tech Stack:
```javascript
- recharts для графиков
- PocketBase aggregations
- Export в Excel
```

## Screen 065: Menu Management
### Функции:
- CRUD операции с меню
- Загрузка фото блюд
- Управление модификаторами
- Стоп-лист

### Используем:
- react-native-image-picker ✅ (установлен)
- Drag & drop для сортировки

## Screen 066: Staff Management
### Функции:
- График смен
- Расчет зарплат
- KPI официантов
- Доступы и роли

## Screen 067: Table Management
### Функции:
- Редактор плана зала
- Настройка столов
- Бронирования
- Объединение столов

## Screen 068: Analytics
### Функции:
- Детальная аналитика
- Экспорт отчетов
- Прогнозирование
- A/B тесты меню

## Screen 069: Reviews Management
### Функции:
- Агрегация отзывов (Google, Yandex, TripAdvisor)
- Ответы на отзывы
- Sentiment анализ
- Алерты на негатив

### Используем:
- react-native-gifted-chat ✅ для ответов

## Screen 070: Promotions
### Функции:
- Создание акций
- Промокоды
- Push кампании
- Таргетинг по сегментам

### Используем:
- OneSignal ✅ для push

## Screen 071: Settings
### Функции:
- Настройки ресторана
- Интеграции (POS, delivery)
- Налоги и сборы
- Backup данных

---

# 🏨 HOTEL STAFF APPS (10 screens)

## 🎩 CONCIERGE (Screens 072-075)

### Screen 072: Concierge Dashboard
- Очередь запросов от гостей
- Приоритеты (VIP, urgent)
- Статистика выполнения

### Screen 073: Guest Chat
- react-native-gifted-chat ✅
- Переводчик встроенный
- Шаблоны ответов

### Screen 074: Local Recommendations
- База рекомендаций
- Mapbox ✅ для карты
- Бронирование ресторанов

### Screen 075: Services Menu
- Каталог услуг
- Цены и доступность
- Быстрый заказ для гостя

## 🧹 HOUSEKEEPING (Screens 076-079)

### Screen 076: Room Status
- План этажа
- Статусы комнат (clean/dirty/cleaning)
- Приоритеты уборки

### Screen 077: Cleaning Checklist
- Чеклист уборки
- Фото до/после
- Отметка выполнения

### Screen 078: Supply Request
- Заказ расходников
- Уровень запасов
- История заказов

### Screen 079: Shift Report
- Отчет по смене
- Убранные комнаты
- Проблемы и замечания

## 🍽️ ROOM SERVICE (Screens 080-081)

### Screen 080: Room Service Orders
- Очередь заказов
- Детали заказа
- Маршрут доставки

### Screen 081: Delivery Status
- Трекинг доставки
- Подтверждение получения
- Обратная связь

---

## 📱 ОБЩИЕ КОМПОНЕНТЫ ДЛЯ STAFF APPS

### Shared UI Components:
```typescript
// Переиспользуемые между приложениями
- StaffAuthLayout
- OrderCard
- StatusBadge
- TimerComponent
- NotificationHandler
- RealTimeSync
```

### Shared Services:
```typescript
// Общие сервисы
- WebSocketService (Socket.io)
- NotificationService (OneSignal)
- AnalyticsService (Mixpanel)
- AuthService (PocketBase)
```

## 🔒 БЕЗОПАСНОСТЬ STAFF APPS

### Требования:
- [ ] Ролевая модель (RBAC)
- [ ] Логирование всех действий
- [ ] Двухфакторная аутентификация
- [ ] Автовыход после неактивности
- [ ] Шифрование данных
- [ ] VPN для админки

## ⚡ ПРОИЗВОДИТЕЛЬНОСТЬ

### Метрики:
- WebSocket reconnect: <2 sec
- Order update: <100ms
- Screen load: <500ms
- Offline mode: full support

---

**📌 Staff приложения критически важны для операционной эффективности!**