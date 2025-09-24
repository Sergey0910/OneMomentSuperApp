# 📱 Screen 002: Phone Login

## 📊 Метаданные
- **ID:** 002
- **Приложение:** Guest App
- **Модуль:** Authentication
- **Приоритет:** P0 (критически важный)
- **Время разработки:** 4 часа
- **Зависимости:** Screen 001 (Splash) → Screen 002 → Screen 003 (OTP)

## 🛠️ Технический стек

### Установленные библиотеки (из TOOLBOX.md):
```json
{
  "react-native-otp-entry": "^1.6.0",      // ✅ Установлена
  "react-native-vector-icons": "^10.0.0",   // ✅ Установлена
  "react-native-linear-gradient": "^2.8.3", // ✅ Установлена
  "libphonenumber-js": "^1.10.44",         // Нужно установить
  "react-native-country-picker-modal": "^2.0.0" // Нужно установить
}
```

### PocketBase API Endpoints:
```typescript
// Authentication endpoints
POST   /api/v1/auth/send-otp
  Body: { phone: string, country_code: string }
  Response: { success: boolean, request_id: string }

POST   /api/v1/auth/verify-otp
  Body: { phone: string, otp: string, request_id: string }
  Response: { token: string, user: User }

GET    /api/v1/auth/countries
  Response: Country[]
```

## 📐 TypeScript интерфейсы

```typescript
// Types with Zod validation
import { z } from 'zod';

// Phone validation schema
export const PhoneNumberSchema = z.object({
  country_code: z.string()
    .regex(/^\+\d{1,4}$/, 'Invalid country code')
    .default('+1'),
  number: z.string()
    .min(6, 'Phone number too short')
    .max(15, 'Phone number too long'),
  formatted: z.string(),
  isValid: z.boolean()
});

export type TPhoneNumber = z.infer<typeof PhoneNumberSchema>;

// Country interface
export interface ICountry {
  name: string;
  code: string;
  dial_code: string;
  flag: string;
  supported: boolean;
}

// Screen props
export interface IPhoneLoginProps {
  navigation: NavigationProp<RootStackParamList, 'PhoneLogin'>;
  route: RouteProp<RootStackParamList, 'PhoneLogin'>;
}

// Component state
export interface IPhoneLoginState {
  selectedCountry: ICountry;
  phoneNumber: string;
  isLoading: boolean;
  error: string | null;
  isValidPhone: boolean;
}
```

## 🎨 UI Компоненты (используем установленные)

```typescript
// Используем установленные библиотеки из TOOLBOX.md
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import OtpEntry from 'react-native-otp-entry';
```

## ✅ Acceptance Criteria

### Функциональные требования:
- [ ] Пользователь может выбрать страну из списка
- [ ] Автоматическое определение страны по геолокации
- [ ] Валидация номера телефона в реальном времени
- [ ] Форматирование номера по маске страны
- [ ] Отображение флага выбранной страны
- [ ] Кнопка "Продолжить" активна только при валидном номере
- [ ] Показ ошибок валидации
- [ ] Поддержка 100+ стран через i18next
- [ ] Ссылки на Terms и Privacy Policy

### Нефункциональные требования:
- [ ] Загрузка экрана < 300ms
- [ ] 60 FPS при скролле списка стран
- [ ] Работа offline с кэшированным списком стран
- [ ] Доступность для screen readers

## 🧪 Test Scenarios

### Unit Tests (Jest + React Native Testing Library):
```typescript
describe('PhoneLogin Screen', () => {
  // 1. Валидация телефона
  it('should validate US phone number correctly', () => {
    const validUS = '+1 (555) 123-4567';
    expect(validatePhone(validUS, 'US')).toBe(true);
  });

  // 2. Некорректный формат
  it('should reject invalid phone format', () => {
    const invalid = '123';
    expect(validatePhone(invalid, 'US')).toBe(false);
  });

  // 3. Выбор страны
  it('should update country and format mask', () => {
    const { getByTestId } = render(<PhoneLogin />);
    selectCountry('RU');
    expect(getByTestId('phone-mask')).toBe('+7 (XXX) XXX-XX-XX');
  });

  // 4. Отправка OTP
  it('should send OTP on valid phone', async () => {
    const { getByText } = render(<PhoneLogin />);
    enterPhone('+1 555 123 4567');
    fireEvent.press(getByText('Continue'));
    await waitFor(() => {
      expect(navigation.navigate).toHaveBeenCalledWith('OTP');
    });
  });
});
```

### E2E Tests (Detox):
```gherkin
Feature: Phone Login
  
  Scenario: Successful phone entry with country selection
    Given I am on the Phone Login screen
    When I tap on country selector
    And I select "Russia" from the list
    Then I should see "+7" country code
    And I should see Russian flag
    When I enter "9161234567" as phone number
    Then I should see formatted number "+7 (916) 123-45-67"
    And "Continue" button should be enabled
    
  Scenario: Error handling for invalid number
    Given I am on the Phone Login screen
    When I enter "123" as phone number
    Then I should see error "Phone number too short"
    And "Continue" button should be disabled
```

## ⚡ Performance Metrics

```yaml
Target Metrics:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Screen Load: <300ms
Country List Render: <100ms
Search Filter: <50ms
Validation Check: <10ms
Memory Usage: <30MB
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 🔒 Security Checklist

- [ ] **Phone validation** - libphonenumber-js для проверки
- [ ] **Rate limiting** - макс 3 попытки за 5 минут
- [ ] **HTTPS only** - все API вызовы через SSL
- [ ] **No phone storage** - номер не сохраняется локально
- [ ] **Sanitization** - очистка input от SQL injection
- [ ] **Country whitelist** - только поддерживаемые страны
- [ ] **CAPTCHA ready** - подготовка для reCAPTCHA v3

## 🎯 Implementation Checklist

### Файловая структура:
```
/screens/002_PhoneLogin/
├── PhoneLogin.tsx           # UI компонент
├── PhoneLogin.logic.ts      # Бизнес-логика
├── PhoneLogin.types.ts      # TypeScript типы
├── PhoneLogin.styles.ts     # Стили
├── PhoneLogin.test.tsx      # Unit тесты
├── PhoneLogin.stories.tsx   # Storybook
└── components/
    ├── CountryPicker.tsx    # Выбор страны
    └── PhoneInput.tsx       # Ввод телефона
```

### Порядок реализации:
1. [ ] Создать TypeScript интерфейсы
2. [ ] Написать тесты (TDD)
3. [ ] Реализовать UI компонент
4. [ ] Добавить бизнес-логику
5. [ ] Интегрировать с PocketBase
6. [ ] Провести тестирование
7. [ ] Оптимизировать производительность
8. [ ] Документировать в Storybook

## 📱 Связанные экраны

**Переходы:**
- **От:** Screen 001 (Splash) - при отсутствии авторизации
- **К:** Screen 003 (OTP Verification) - после успешной отправки

**Shared компоненты:**
- AuthLayout - общий layout для auth экранов
- LoadingButton - кнопка с индикатором загрузки
- ErrorMessage - отображение ошибок

## 🔗 Полезные ссылки

- [libphonenumber-js документация](https://gitlab.com/catamphetamine/libphonenumber-js)
- [PocketBase Auth API](https://pocketbase.io/docs/authentication)
- [React Native OTP Entry](https://github.com/anday013/react-native-otp-entry)
- [Country Picker Modal](https://github.com/xcarpentier/react-native-country-picker-modal)

## 📝 Заметки для разработчика

1. **Используем установленные библиотеки** из TOOLBOX.md максимально
2. **OTP Entry уже установлен** - не нужно искать альтернативы
3. **Vector Icons есть** - 3000+ иконок доступно
4. **Linear Gradient готов** - для красивого фона
5. **i18next настроен** - локализация из коробки

---

**📌 Этот экран критически важен - это первое взаимодействие пользователя с приложением!**