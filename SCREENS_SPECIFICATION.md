# 📱 OneMomentSuperApp: ДЕТАЛЬНАЯ СПЕЦИФИКАЦИЯ 81 ЭКРАНА
> **Версия:** 1.0 | **Дата:** 20.09.2025

## 📊 СВОДНАЯ ТАБЛИЦА ПРИЛОЖЕНИЙ

| Приложение | Экранов | Платформа | Приоритет | Размер Bundle |
|------------|---------|-----------|-----------|---------------|
| **OneMoment Guest** | 51 | iOS/Android | P0 | 2-3MB |
| **OneMoment Waiter** | 7 | iOS/Android | P1 | 1MB |
| **OneMoment Kitchen** | 5 | Android Tablet | P1 | 1MB |
| **OneMoment Restaurant Admin** | 8 | Web/Mobile | P2 | 1.5MB |
| **OneMoment Concierge** | 4 | iOS/Android | P3 | 0.8MB |
| **OneMoment Housekeeping** | 4 | Android | P3 | 0.8MB |
| **OneMoment Room Service** | 2 | Android | P3 | 0.5MB |
| **ИТОГО** | **81** | Multi-platform | - | **~8MB** |

---

# 1️⃣ ONEMOMENT GUEST APP (51 ЭКРАН)

## 🔐 АВТОРИЗАЦИЯ (3 экрана)

### Screen 001: Splash Screen ✅ ГОТОВО
```typescript
type TSplashScreen = {
  logo: AnimatedLogo
  progressBar: ProgressBar
  version: string
  loadTime: <3sec
}
```
**Переходы:** → Screen 002 или Screen 004

### Screen 002: Phone Login ✅ ГОТОВО
```typescript
type TPhoneLogin = {
  countryPicker: CountrySelector
  phoneInput: PhoneNumberInput
  termsLink: string
  privacyLink: string
  validation: PhoneValidator
}
```
**API:** `POST /api/v1/auth/send-otp`

### Screen 003: OTP Verification ✅ ГОТОВО
```typescript
type TOTPScreen = {
  otpInputs: OTPInput[6]
  timer: CountdownTimer
  resendButton: ResendOTP
  autoSubmit: boolean
}
```
**API:** `POST /api/v1/auth/verify-otp`

## 🏠 ГЛАВНАЯ (1 экран)

### Screen 004: Home Dashboard ⏳ В РАЗРАБОТКЕ
```typescript
type THomeScreen = {
  userGreeting: PersonalizedGreeting
  modules: ServiceCard[]
  promotionBanner: PromoBanner
  bottomNav: NavigationBar
  quickActions: QuickActionButton[]
}
```
**Module Federation:** Загружает только ядро, модули по требованию

## 🍽️ RESTAURANT MODULE (28 экранов)

### Screen 005: QR Scanner
```typescript
type TQRScanner = {
  camera: CameraView
  qrFrame: QRFrame
  manualInput: ManualCodeInput
  flashlight: FlashlightToggle
}
```
**API:** `POST /api/v1/tables/verify`
**WebSocket:** Подключение к столу

### Screen 006: Table Confirmation
```typescript
type TTableConfirmation = {
  restaurantName: string
  tableNumber: string
  restaurantPhoto: Image
  confirmButton: Button
  rescanButton: Button
}
```

### Screen 007: Menu Categories
```typescript
type TMenuCategories = {
  searchBar: SearchInput
  promoBlock: PromoSection
  categories: CategoryGrid
  cartIndicator: CartBadge
}
```
**API:** `GET /api/v1/menu/categories`
**Cache:** IndexedDB для offline

### Screen 008: Category Items
```typescript
type TCategoryItems = {
  categoryTitle: string
  filters: FilterChips[]
  items: MenuItem[]
  sortOptions: SortSelector
}
```
**API:** `GET /api/v1/menu/items?category={id}`

### Screen 009: Item Detail
```typescript
type TItemDetail = {
  photoGallery: ImageCarousel
  itemInfo: ItemDescription
  modifiers: ModifierList
  quantity: QuantitySelector
  addToCartButton: AddToCartCTA
}
```
**3D Preview:** Three.js для премиум блюд

### Screen 010: Cart
```typescript
type TCart = {
  cartItems: CartItem[]
  promoCode: PromoCodeInput
  totalCalculation: PriceBreakdown
  paymentMethod: PaymentSelector
  checkoutButton: CheckoutCTA
}
```
**State:** Zustand для управления корзиной

### Screen 011: Payment Method Selection
```typescript
type TPaymentSelection = {
  bankCard: CardOption
  tonWallet: TONOption
  applePay: ApplePayOption
  googlePay: GooglePayOption
  cash: CashOption
  savedCards: SavedCard[]
}
```
**TON Integration:** TON Connect SDK

### Screen 012: Payment Process
```typescript
type TPaymentProcess = {
  cardForm?: CardInputForm
  tonConnect?: TONConnectWidget
  secureFrame?: ThreeDSecureFrame
  progressIndicator: PaymentProgress
}
```
**API:** `POST /api/v1/payments/process`
**Security:** PCI DSS Compliance

### Screen 013: Order Success
```typescript
type TOrderSuccess = {
  successAnimation: LottieAnimation
  orderNumber: string
  estimatedTime: TimeEstimate
  trackButton: Button
  continueButton: Button
}
```
**Push:** Firebase для уведомлений

### Screen 014-032: Дополнительные экраны ресторана
[Детальная спецификация продолжается...]

## 🏨 HOTEL MODULE (10 экранов)

### Screen 033-042: Hotel функционал
[Спецификация отельного модуля...]

## 🌐 eSIM MODULE (5 экранов)

### Screen 043-047: eSIM marketplace
[Спецификация eSIM модуля...]

## 🌍 TRANSLATOR MODULE (5 экранов)

### Screen 048-051: Translator функции
[Спецификация переводчика...]

---

# 2️⃣ ONEMOMENT WAITER APP (7 ЭКРАНОВ)

### Screen 052-058: Интерфейс официанта
[Спецификация для официантов...]

---

# 3️⃣ ONEMOMENT KITCHEN APP (5 ЭКРАНОВ)

### Screen 059-063: Кухонный дисплей
[Спецификация для кухни...]

---

# 4️⃣ ONEMOMENT RESTAURANT ADMIN (8 ЭКРАНОВ)

### Screen 064-071: Админ панель
[Спецификация админки...]

---

# 5️⃣ ONEMOMENT CONCIERGE (4 ЭКРАНА)

### Screen 072-075: Консьерж сервис
[Спецификация консьержа...]

---

# 6️⃣ ONEMOMENT HOUSEKEEPING (4 ЭКРАНА)

### Screen 076-079: Управление уборкой
[Спецификация хаускипинга...]

---

# 7️⃣ ONEMOMENT ROOM SERVICE (2 ЭКРАНА)

### Screen 080-081: Room service
[Спецификация рум-сервиса...]

---

## 🎯 ТЕХНИЧЕСКИЕ ТРЕБОВАНИЯ

### Производительность:
- Запуск: <3 сек
- Переходы: <300ms
- FPS: 60
- Bundle: <20MB total

### Offline Mode:
- Базовые функции работают offline
- Синхронизация при восстановлении связи
- IndexedDB для кэширования

### Security:
- JWT токены с refresh
- Биометрия
- E2E шифрование для платежей

---

## ✅ MVP ЧЕКЛИСТ (21 ЭКРАН)

### Готово (3/21):
- [x] Screen 001: Splash
- [x] Screen 002: Phone Login  
- [x] Screen 003: OTP

### В разработке (1/21):
- [ ] Screen 004: Home

### Нужно сделать (17/21):
- [ ] Screens 005-013: Restaurant core
- [ ] Screens 052-055: Waiter basic
- [ ] Screens 059-061: Kitchen basic

---

**📌 Следующий шаг:** Реализация Screen 004 (Home Dashboard)