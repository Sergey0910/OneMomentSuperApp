# 🎨 COMPONENT RESEARCH MAP для OneMomentSuperApp

## MVP - 21 экран с готовыми компонентами

### Guest App (13 экранов)

#### Screen 001: Splash Screen ✅
```typescript
Components:
- magic-ui/animated-logo
- aceternity/aurora-background
- shadcn/progress

Implementation:
import { AnimatedLogo } from "@/components/magic-ui/animated-logo"
import { AuroraBackground } from "@/components/aceternity/aurora-background"
import { Progress } from "@/components/ui/progress"
```

#### Screen 002: Phone Login ✅
```typescript
Components:
- shadcn/input
- shadcn/button
- ray-ui/phone-input
- magic-ui/animated-gradient

Implementation:
import { PhoneInput } from "@/components/ray-ui/phone-input"
import { Button } from "@/components/ui/button"
```

#### Screen 003: OTP Verification ✅
```typescript
Components:
- shadcn/input-otp
- magic-ui/animated-numbers
- shadcn/button
- tremor/countdown

Implementation:
import { InputOTP } from "@/components/ui/input-otp"
import { AnimatedNumbers } from "@/components/magic-ui/animated-numbers"
```

#### Screen 004: Home Dashboard ⏳
```typescript
Components:
- ray-ui/dashboard-layout
- tremor/kpi-cards
- shadcn/navigation-menu
- magic-ui/bento-grid
- aceternity/3d-cards

Implementation:
import { DashboardLayout } from "@/components/ray-ui/dashboard-layout"
import { KpiCard } from "@/components/tremor/kpi-card"
import { BentoGrid } from "@/components/magic-ui/bento-grid"
```

#### Screen 005: QR Scanner
```typescript
Components:
- ray-ui/camera-view
- magic-ui/scan-animation
- shadcn/alert
- aceternity/spotlight

Implementation:
import { CameraView } from "@/components/ray-ui/camera-view"
import { ScanAnimation } from "@/components/magic-ui/scan-animation"
```

#### Screen 006: Table Confirmation
```typescript
Components:
- shadcn/card
- shadcn/button
- tremor/badge
- magic-ui/confetti-button

Implementation:
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ConfettiButton } from "@/components/magic-ui/confetti-button"
```

#### Screen 007: Menu Categories
```typescript
Components:
- ray-ui/category-grid
- shadcn/search
- magic-ui/shimmer-cards
- tremor/tab-list

Implementation:
import { CategoryGrid } from "@/components/ray-ui/category-grid"
import { ShimmerCards } from "@/components/magic-ui/shimmer-cards"
```

#### Screen 008: Category Items
```typescript
Components:
- ray-ui/item-cards
- shadcn/scroll-area
- tremor/multi-select
- aceternity/hover-cards

Implementation:
import { ItemCards } from "@/components/ray-ui/item-cards"
import { HoverCards } from "@/components/aceternity/hover-cards"
```

#### Screen 009: Item Detail
```typescript
Components:
- shadcn/carousel
- ray-ui/modifiers-list
- shadcn/radio-group
- magic-ui/animated-badge
- tremor/number-ticker

Implementation:
import { Carousel } from "@/components/ui/carousel"
import { ModifiersList } from "@/components/ray-ui/modifiers-list"
```

#### Screen 010: Cart
```typescript
Components:
- ray-ui/drawer
- shadcn/separator
- tremor/bar-list
- magic-ui/animated-counter

Implementation:
import { Drawer } from "@/components/ray-ui/drawer"
import { AnimatedCounter } from "@/components/magic-ui/animated-counter"
```

#### Screen 011: Payment Method Selection
```typescript
Components:
- shadcn/radio-group
- ray-ui/payment-cards
- ton-connect/wallet-button
- aceternity/gradient-cards

Implementation:
import { PaymentCards } from "@/components/ray-ui/payment-cards"
import { TonConnectButton } from "@ton/connect-ui-react"
```

#### Screen 012: Payment Process
```typescript
Components:
- shadcn/form
- magic-ui/loading-dots
- tremor/progress-bar
- ray-ui/secure-input

Implementation:
import { Form } from "@/components/ui/form"
import { LoadingDots } from "@/components/magic-ui/loading-dots"
```

#### Screen 013: Order Success
```typescript
Components:
- magic-ui/confetti
- lottie-react-native/animation
- shadcn/alert
- tremor/callout

Implementation:
import { Confetti } from "@/components/magic-ui/confetti"
import LottieView from "lottie-react-native"
```

### Waiter App (4 экрана)

#### Screen 052: Waiter Login
```typescript
Components:
- shadcn/input-pin
- ray-ui/num-pad
- magic-ui/gradient-text
```

#### Screen 053: Orders Dashboard
```typescript
Components:
- ray-ui/data-table
- tremor/stats-cards
- shadcn/tabs
- magic-ui/live-indicator
```

#### Screen 054: Table Management  
```typescript
Components:
- ray-ui/grid-view
- tremor/badge
- shadcn/popover
```

#### Screen 055: Order Details
```typescript
Components:
- shadcn/timeline
- shadcn/badge
- ray-ui/action-sheet
```

### Kitchen App (3 экрана)

#### Screen 059: Kitchen Login
```typescript
Components:
- shadcn/select
- ray-ui/station-picker
```

#### Screen 060: Orders Queue
```typescript
Components:
- ray-ui/kanban-board
- tremor/timer
- magic-ui/pulse-badge
```

#### Screen 061: Order Kitchen Details
```typescript
Components:
- shadcn/accordion
- shadcn/checkbox
- ray-ui/timer-display
```

## 🎯 Установка компонентов через MCP

### Batch установка для MVP:
```bash
# Основные Shadcn компоненты
npx shadcn@latest add button card input form select \
  dialog drawer sheet tabs accordion \
  alert badge checkbox radio-group \
  carousel separator progress toast

# Ray UI компоненты
npx ray-ui add dashboard-layout data-table \
  category-grid item-cards drawer \
  kanban-board grid-view

# Magic UI анимации
npx magic-ui add animated-logo confetti \
  shimmer-cards loading-dots \
  animated-counter animated-numbers

# Tremor аналитика
npx tremor add kpi-card stats-cards \
  bar-list progress-bar timer

# Aceternity эффекты
npx aceternity add aurora-background \
  3d-cards hover-cards gradient-cards
```

## 📱 React Native адаптация

Все компоненты автоматически адаптируются через:
- `react-native-reusables` - порт Shadcn для RN
- `nativewind` v4 - Tailwind для React Native
- Работает с нашим Module Federation!

## ⚡ Генератор экранов

```javascript
// scripts/generate-screen.js
const generateScreen = async (screenNumber, screenName) => {
  const components = COMPONENT_MAP[`Screen_${screenNumber}`];
  
  // Автоматически устанавливаем компоненты
  for (const component of components) {
    await exec(`npx shadcn@latest add ${component}`);
  }
  
  // Генерируем файл экрана
  return createScreenTemplate(screenName, components);
};
```