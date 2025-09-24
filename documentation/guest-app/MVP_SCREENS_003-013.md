# 📱 Screen 003: OTP Verification

## 📊 Метаданные
- **ID:** 003
- **Приложение:** Guest App
- **Модуль:** Authentication
- **Приоритет:** P0 (критически важный)
- **Время разработки:** 3 часа
- **Зависимости:** Screen 002 (Phone) → Screen 003 → Screen 004 (Home)

## 🛠️ Технический стек

### Библиотеки (из TOOLBOX.md):
```json
{
  "react-native-otp-entry": "^1.6.0",      // ✅ УЖЕ УСТАНОВЛЕНА!
  "react-native-vector-icons": "^10.0.0",   // ✅ УСТАНОВЛЕНА
  "react-native-linear-gradient": "^2.8.3"  // ✅ УСТАНОВЛЕНА
}
```

### API Endpoints:
```typescript
POST /api/v1/auth/verify-otp
  Body: { 
    phone: string,
    otp: string,
    request_id: string 
  }
  Response: { 
    token: string,
    user: User,
    is_new_user: boolean 
  }

POST /api/v1/auth/resend-otp
  Body: { 
    phone: string,
    request_id: string 
  }
  Response: { 
    success: boolean,
    cooldown: number 
  }
```

## 📐 TypeScript интерфейсы

```typescript
import { z } from 'zod';

// OTP validation schema
export const OTPSchema = z.object({
  code: z.string()
    .length(6, 'OTP must be 6 digits')
    .regex(/^\d+$/, 'OTP must contain only numbers'),
  request_id: z.string().uuid(),
  phone: z.string()
});

export type TOTP = z.infer<typeof OTPSchema>;

// Timer state
export interface IOTPTimerState {
  timeLeft: number;
  canResend: boolean;
  resendCount: number;
  maxResends: number;
}

// Screen state
export interface IOTPScreenState {
  otp: string;
  isVerifying: boolean;
  error: string | null;
  timer: IOTPTimerState;
  autoSubmit: boolean;
}
```

## ✅ Acceptance Criteria

- [ ] 6 цифровых полей для OTP
- [ ] Автофокус на следующее поле
- [ ] Автоматическая отправка при заполнении
- [ ] Таймер обратного отсчета (60 сек)
- [ ] Кнопка повторной отправки (макс 3 раза)
- [ ] Paste поддержка из SMS
- [ ] Haptic feedback при вводе
- [ ] Анимация при ошибке
- [ ] Биометрия для автозаполнения (если сохранено)

## 🧪 Test Scenarios

```typescript
describe('OTP Verification', () => {
  it('should auto-submit on 6 digits', async () => {
    enterOTP('123456');
    await waitFor(() => {
      expect(api.verifyOTP).toHaveBeenCalled();
    });
  });

  it('should handle resend after cooldown', () => {
    jest.advanceTimersByTime(60000);
    expect(resendButton).toBeEnabled();
  });

  it('should limit resends to 3', () => {
    resendOTP(); // 1
    resendOTP(); // 2
    resendOTP(); // 3
    expect(resendButton).toBeDisabled();
  });
});
```

## ⚡ Performance Metrics
- Auto-focus transition: <50ms
- Verification API call: <1000ms
- Animation duration: 300ms
- Memory: <20MB

---

# 📱 Screen 004: Home Dashboard

## 📊 Метаданные
- **ID:** 004
- **Приложение:** Guest App
- **Модуль:** Core
- **Приоритет:** P0
- **Время разработки:** 6 часов
- **Критически важный:** Точка входа для Module Federation

## 🛠️ Технический стек

### Module Federation Setup:
```javascript
// Динамическая загрузка модулей
const loadModule = async (moduleName) => {
  const container = await import(moduleName);
  return container;
};
```

### Библиотеки:
- Zustand (state management)
- Module Federation (Re.pack)
- OneSignal (push notifications) ✅
- Mixpanel (analytics) ✅

## 📐 TypeScript интерфейсы

```typescript
export interface IHomeScreen {
  user: {
    name: string;
    avatar?: string;
    location?: string;
  };
  modules: IServiceModule[];
  promotions: IPromotion[];
  quickActions: IQuickAction[];
}

export interface IServiceModule {
  id: string;
  name: string;
  icon: string;
  color: string;
  isAvailable: boolean;
  badge?: number;
  route: string;
}
```

## ✅ Acceptance Criteria

- [ ] Персонализированное приветствие
- [ ] Карточки 4 основных модулей
- [ ] Промо-баннер (если есть)
- [ ] Быстрые действия внизу
- [ ] Pull-to-refresh
- [ ] Skeleton loading
- [ ] Deep linking поддержка
- [ ] Push notifications handler

---

# 📱 Screen 005: QR Scanner

## 📊 Метаданные
- **ID:** 005
- **Приложение:** Guest App
- **Модуль:** Restaurant
- **Приоритет:** P0
- **Время разработки:** 3 часа

## 🛠️ Технический стек

### Библиотеки:
```json
{
  "react-native-qr-code-scanner": "^1.5.5",  // ✅ УСТАНОВЛЕНА
  "react-native-camera": "^4.2.1",           // Зависимость QR
  "react-native-permissions": "^3.8.0"       // Permissions
}
```

## 📐 TypeScript интерфейсы

```typescript
export interface IQRScannerState {
  isScanning: boolean;
  hasPermission: boolean;
  flashOn: boolean;
  lastScanned?: string;
  error?: string;
}

export interface ITableQRData {
  restaurant_id: string;
  table_id: string;
  table_number: string;
  session_token: string;
}
```

## ✅ Acceptance Criteria

- [ ] Камера с рамкой для QR
- [ ] Фонарик toggle
- [ ] Vibration при успешном скане
- [ ] Ручной ввод кода стола
- [ ] История последних сканов
- [ ] Обработка невалидных QR

---

# 📱 Screens 006-013: Restaurant Flow

## Quick Specs:

### Screen 006: Table Confirmation
- Показ инфо ресторана
- Подтверждение стола
- WebSocket подключение

### Screen 007: Menu Categories  
- Grid/List view toggle
- Поиск по меню
- Промо-блоки
- Счетчик корзины

### Screen 008: Category Items
- VirtualizedList для производительности
- Фильтры (вег, острое, безглютен)
- Сортировка (популярное, цена)
- Lazy loading изображений

### Screen 009: Item Detail
- Галерея фото (свайп)
- Модификаторы (размер, добавки)
- Количество
- Пищевая ценность
- Отзывы о блюде

### Screen 010: Cart
- Редактирование позиций
- Промокод
- Расчет с учетом скидок
- Комментарий к заказу

### Screen 011: Payment Selection
- TON Wallet ✅ (установлен)
- Банковские карты
- Apple/Google Pay
- Наличные

### Screen 012: Payment Process
- 3D Secure iframe
- TON Connect widget
- Loading states
- Error handling

### Screen 013: Order Success
- Lottie анимация
- Номер заказа
- Время готовности
- Push подписка