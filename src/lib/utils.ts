import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function для объединения классов Tailwind
 * Используется во всех Shadcn компонентах
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Форматирование цены для ресторанного меню
 */
export function formatPrice(price: number, currency: string = "₽"): string {
  return `${currency}${price.toLocaleString()}`
}

/**
 * Генерация уникального ID для заказов
 */
export function generateOrderId(): string {
  return `OM-${Date.now().toString(36).toUpperCase()}`
}

/**
 * Проверка поддержки Module Federation
 */
export function isModuleFederationSupported(): boolean {
  return typeof __webpack_require__ !== 'undefined' && 
         typeof __webpack_require__.federation !== 'undefined'
}

/**
 * Динамическая загрузка модуля
 */
export async function loadRemoteModule<T = any>(
  scope: string,
  module: string
): Promise<T> {
  try {
    // @ts-ignore
    await __webpack_init_sharing__('default');
    // @ts-ignore
    const container = window[scope];
    // @ts-ignore
    await container.init(__webpack_share_scopes__.default);
    // @ts-ignore
    const factory = await container.get(module);
    const Module = factory();
    return Module;
  } catch (error) {
    console.error(`Failed to load module ${scope}/${module}:`, error);
    throw error;
  }
}

/**
 * React Native платформа detection
 */
export function isReactNative(): boolean {
  return typeof navigator !== 'undefined' && 
         navigator.product === 'ReactNative'
}

/**
 * Адаптивные стили для RN и Web
 */
export function platformStyles(web: string, native: string): string {
  return isReactNative() ? native : web
}