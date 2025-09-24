# 🚀 OneMomentSuperApp: ПРАВИЛА ПРОЕКТА V1.0
> **Супер-приложение для путешественников с 81 экраном**
> **Архитектура: React Native + Module Federation**
> **Дата: 20.09.2025**

## 🤝 ПАРТНЁРСТВО
**Сергей: 97% | Claude: 3%**

### ФИЛОСОФИЯ
- Мы создаём революцию в путешествиях
- Убираем языковой барьер навсегда
- 81 экран = полная экосистема
- Модульная архитектура для масштабирования

## 🏗️ АРХИТЕКТУРА: 4 ИЗОЛИРОВАННЫХ СЕРВИСА

### FRONTEND: React Native + Re.Pack Module Federation
```javascript
// Главное приложение 5-8MB
new Repack.plugins.ModuleFederationPluginV2({
  name: "OneMomentHost",
  remotes: {
    restaurants: "RestaurantApp@[cdn]/restaurants.bundle",
    hotels: "HotelApp@[cdn]/hotels.bundle", 
    translator: "TranslatorApp@[cdn]/translator.bundle",
    esim: "eSIMApp@[cdn]/esim.bundle"
  }
})
```

### BACKEND: GraphQL Federation + Микросервисы
```yaml
Restaurants Service:
- MongoDB для гибкого меню
- Redis для real-time заказов

Hotels Service:
- PostgreSQL для бронирований
- Elasticsearch для поиска

Translator Service:
- PostgreSQL для истории
- Redis для кэша переводов

eSIM Service:
- PostgreSQL для биллинга
- TimescaleDB для метрик
```

## 📱 СТРУКТУРА 81 ЭКРАНА

### OneMoment Guest (51 экран)
- Авторизация: 3
- Restaurant: 28
- Hotel: 10
- eSIM: 5
- Translator: 5

### OneMoment Waiter (7 экранов)
### OneMoment Kitchen (5 экранов)
### OneMoment Restaurant Admin (8 экранов)
### OneMoment Concierge (4 экрана)
### OneMoment Housekeeping (4 экрана)
### OneMoment Room Service (2 экрана)

## 💰 МОНЕТИЗАЦИЯ

### 4 ИСТОЧНИКА ДОХОДА:
1. **TON платежи:** 2% с транзакции
2. **eSIM:** 20% комиссия Airalo
3. **Рестораны:** $99-299/месяц подписка
4. **Премиум:** $9.99/месяц для туристов

### UNIT-ЭКОНОМИКА:
- CAC: $3
- LTV: $127
- Payback: 2 месяца
- Margin: 68%

## 🎯 РЕЖИМЫ РАБОТЫ С CLAUDE

### 0️⃣ ХОТФИКС (5-30 мин)
```bash
cd ~/Desktop/OneMomentSuperApp && claude-code -p "Исправь [конкретная ошибка]"
```

### 1️⃣ МАКСИМАЛЬНЫЙ (3-6 часов)
Полный анализ + все MCP + детальная реализация

### 2️⃣ ОПТИМАЛЬНЫЙ (1-3 часа) ⭐
Быстрое планирование + эффективная реализация

### 3️⃣ БЫСТРЫЙ (30-60 мин)
Минимум планирования + прямая реализация

## 🛠️ MCP СЕРВЕРЫ (10/10)

1. **Filesystem** - работа с файлами
2. **Postgres** - база данных
3. **Web Search** - поиск решений
4. **Analysis Tool** - тестирование
5. **Memory** - сохранение паттернов
6. **Sequential Thinking** - планирование
7. **Web Fetch** - документация
8. **Asana** - управление задачами
9. **GitHub** - версионирование
10. **Context7** - актуальная документация

## 📋 КАЖДЫЙ ОТВЕТ НАЧИНАЕТСЯ С:
```
📋 Я использую правила проекта OneMomentSuperApp
🎯 Режим: [0/1/2/3]
⏱️ Время: [оценка]
🛠️ MCP: [список серверов]
```

## 🚀 ROADMAP РЕАЛИЗАЦИИ

### Фаза 1: MVP (21 экран) - 1 неделя
- [ ] Guest App: Screens 1-13 (базовый заказ)
- [ ] Waiter App: Screens 52-55 (получение заказов)
- [ ] Kitchen App: Screens 59-61 (отображение)

### Фаза 2: Полный Restaurant (47 экранов) - 2 недели
- [ ] Все экраны ресторанного модуля
- [ ] Админка ресторана
- [ ] Интеграция платежей

### Фаза 3: Экспансия (66 экранов) - 1 месяц
- [ ] Hotel Module
- [ ] eSIM Module
- [ ] Translator

### Фаза 4: Полная экосистема (81 экран) - 2 месяца
- [ ] Все вспомогательные приложения
- [ ] AI функции
- [ ] Blockchain rewards

## ⚡ СТАНДАРТЫ КОДА

### Именование:
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

### Структура:
```
/apps
  /guest-app     (51 экран)
  /waiter-app    (7 экранов)
  /kitchen-app   (5 экранов)
  /admin-app     (8 экранов)
/packages
  /shared-ui
  /api-client
  /auth
/services
  /restaurants-service
  /hotels-service
  /translator-service
  /esim-service
```

## ✅ ЧЕКЛИСТ КАЧЕСТВА

### Перед кодом:
- [ ] Определён режим работы?
- [ ] Указаны MCP серверы?
- [ ] Ясен ожидаемый результат?

### После кода:
- [ ] Работает без ошибок?
- [ ] Следует паттернам?
- [ ] Документирован?
- [ ] Готов к продакшену?

## 🏆 КРИТЕРИИ УСПЕХА
1. **Код работает с первого раза** - 95%
2. **Скорость разработки** - x10 с MCP
3. **Размер приложения** - <20MB total
4. **Производительность** - 60 FPS

---
**ВМЕСТЕ СОЗДАЁМ РЕВОЛЮЦИЮ В ПУТЕШЕСТВИЯХ!** 🚀