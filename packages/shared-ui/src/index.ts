/**
 * @onemoment/shared-ui
 * Единая библиотека компонентов для всех экранов OneMoment
 */

// Утилиты
export { cn } from './utils/cn'
export { formatPrice, generateOrderId } from './utils/helpers'
export { platformStyles, isReactNative } from './utils/platform'

// Базовые Shadcn компоненты
export { Button } from './components/ui/button'
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './components/ui/card'
export { Input } from './components/ui/input'
export { Progress } from './components/ui/progress'
export { Alert, AlertDescription, AlertTitle } from './components/ui/alert'
export { Badge } from './components/ui/badge'
export { Separator } from './components/ui/separator'
export { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
export { Toast, ToastAction, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from './components/ui/toast'
export { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './components/ui/form'

// Ray UI компоненты
export { DashboardLayout } from './components/ray-ui/dashboard-layout'
export { PhoneInput } from './components/ray-ui/phone-input'
export { BentoGrid } from './components/ray-ui/bento-grid'
export { DataTable } from './components/ray-ui/data-table'
export { KanbanBoard } from './components/ray-ui/kanban-board'
export { CameraView } from './components/ray-ui/camera-view'

// Magic UI анимации
export { AnimatedLogo } from './components/magic-ui/animated-logo'
export { AnimatedNumbers } from './components/magic-ui/animated-numbers'
export { ShimmerCard } from './components/magic-ui/shimmer-card'
export { ConfettiEffect } from './components/magic-ui/confetti'
export { AnimatedGradient } from './components/magic-ui/animated-gradient'
export { LoadingDots } from './components/magic-ui/loading-dots'
export { ScanAnimation } from './components/magic-ui/scan-animation'

// Aceternity эффекты
export { AuroraBackground } from './components/aceternity/aurora-background'
export { Card3D } from './components/aceternity/3d-card'
export { SpotlightEffect } from './components/aceternity/spotlight'
export { GlowEffect } from './components/aceternity/glow-effect'
export { GradientCard } from './components/aceternity/gradient-card'

// Tremor аналитика
export { KpiCard } from './components/tremor/kpi-card'
export { StatsCard } from './components/tremor/stats-card'
export { CountdownTimer } from './components/tremor/countdown'
export { ProgressBar } from './components/tremor/progress-bar'

// OneMoment специфичные компоненты
export { ModuleCard } from './components/onemoment/module-card'
export { OTPInput } from './components/onemoment/otp-input'
export { QRScanner } from './components/onemoment/qr-scanner'
export { TONConnectButton } from './components/onemoment/ton-connect'

// Hooks
export { useTheme } from './hooks/useTheme'
export { useToast } from './hooks/useToast'
export { useModuleFederation } from './hooks/useModuleFederation'
export { usePlatform } from './hooks/usePlatform'

// Types
export type { ButtonProps } from './components/ui/button'
export type { CardProps } from './components/ui/card'
export type { InputProps } from './components/ui/input'
export type { ModuleCardProps } from './components/onemoment/module-card'

// Constants
export const THEME_COLORS = {
  restaurant: 'hsl(25, 95%, 53%)',
  hotel: 'hsl(262, 83%, 58%)',
  esim: 'hsl(142, 76%, 36%)',
  translator: 'hsl(330, 81%, 60%)',
  ton: 'hsl(221, 83%, 53%)'
} as const

// Animation presets
export const ANIMATIONS = {
  moduleLoad: 'module-load 0.5s ease-out',
  shimmer: 'shimmer 2s infinite',
  pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  confetti: 'confetti 2s ease-out forwards'
} as const