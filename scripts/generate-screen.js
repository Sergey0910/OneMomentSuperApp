#!/usr/bin/env node

/**
 * 🚀 OneMoment Screen Generator with Shadcn MCP
 * Автоматически создаёт экраны с нужными компонентами
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Компонентная карта из components-research.md
const COMPONENT_MAP = {
  "001": {
    name: "Splash",
    components: ["magic-ui/animated-logo", "aceternity/aurora-background", "shadcn/progress"]
  },
  "002": {
    name: "PhoneLogin", 
    components: ["shadcn/input", "shadcn/button", "ray-ui/phone-input"]
  },
  "003": {
    name: "OTPVerification",
    components: ["shadcn/input-otp", "magic-ui/animated-numbers", "shadcn/button"]
  },
  "004": {
    name: "HomeDashboard",
    components: ["ray-ui/dashboard-layout", "tremor/kpi-cards", "magic-ui/bento-grid"]
  },
  "005": {
    name: "QRScanner",
    components: ["ray-ui/camera-view", "magic-ui/scan-animation", "shadcn/alert"]
  },
  "006": {
    name: "TableConfirmation",
    components: ["shadcn/card", "shadcn/button", "magic-ui/confetti-button"]
  },
  "007": {
    name: "MenuCategories",
    components: ["ray-ui/category-grid", "shadcn/search", "magic-ui/shimmer-cards"]
  },
  "008": {
    name: "CategoryItems",
    components: ["ray-ui/item-cards", "shadcn/scroll-area", "aceternity/hover-cards"]
  },
  "009": {
    name: "ItemDetail",
    components: ["shadcn/carousel", "ray-ui/modifiers-list", "magic-ui/animated-badge"]
  },
  "010": {
    name: "Cart",
    components: ["ray-ui/drawer", "shadcn/separator", "magic-ui/animated-counter"]
  },
  "011": {
    name: "PaymentMethodSelection",
    components: ["shadcn/radio-group", "ray-ui/payment-cards", "ton-connect/wallet-button"]
  },
  "012": {
    name: "PaymentProcess",
    components: ["shadcn/form", "magic-ui/loading-dots", "tremor/progress-bar"]
  },
  "013": {
    name: "OrderSuccess",
    components: ["magic-ui/confetti", "lottie-react-native", "shadcn/alert"]
  }
};

/**
 * Установка компонентов через Shadcn CLI
 */
async function installComponents(components) {
  console.log('📦 Устанавливаем компоненты...');
  
  for (const component of components) {
    const [registry, name] = component.split('/');
    
    try {
      if (registry === 'shadcn') {
        console.log(`   Installing: ${name}`);
        execSync(`npx shadcn@latest add ${name}`, { stdio: 'inherit' });
      } else if (registry === 'ray-ui') {
        console.log(`   Installing Ray UI: ${name}`);
        execSync(`npx ray-ui add ${name}`, { stdio: 'inherit' });
      } else if (registry === 'magic-ui') {
        console.log(`   Installing Magic UI: ${name}`);
        execSync(`npx magic-ui add ${name}`, { stdio: 'inherit' });
      } else if (registry === 'tremor') {
        console.log(`   Installing Tremor: ${name}`);
        execSync(`npx tremor add ${name}`, { stdio: 'inherit' });
      } else if (registry === 'aceternity') {
        console.log(`   Installing Aceternity: ${name}`);
        execSync(`npx aceternity add ${name}`, { stdio: 'inherit' });
      }
    } catch (error) {
      console.warn(`   ⚠️ Не удалось установить ${component}, пропускаем...`);
    }
  }
}

/**
 * Генерация шаблона экрана
 */
function generateScreenTemplate(screenNumber, screenName, components) {
  const componentImports = components.map(comp => {
    const [registry, name] = comp.split('/');
    const componentName = name.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
    
    if (registry === 'shadcn') {
      return `import { ${componentName} } from "@/components/ui/${name}"`;
    } else if (registry === 'ton-connect') {
      return `import { TonConnectButton } from "@ton/connect-ui-react"`;
    } else {
      return `import { ${componentName} } from "@/components/${registry}/${name}"`;
    }
  }).join('\n');

  return `/**
 * Screen ${screenNumber}: ${screenName}
 * Generated with Shadcn MCP Server
 * 
 * @module OneMoment/Guest
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '@/store';
import { cn } from '@/lib/utils';

// Generated Component Imports
${componentImports}

// Types
type T${screenName}Props = {
  route?: any;
  navigation?: any;
};

/**
 * Screen ${screenNumber}: ${screenName}
 * ${getScreenDescription(screenNumber)}
 */
export const ${screenName}Screen: React.FC<T${screenName}Props> = ({ route, navigation }) => {
  const [loading, setLoading] = useState(false);
  const store = useStore();
  
  useEffect(() => {
    // Initialize screen
    initializeScreen();
  }, []);
  
  const initializeScreen = async () => {
    setLoading(true);
    try {
      // TODO: Implement initialization logic
      console.log('Initializing ${screenName}...');
    } catch (error) {
      console.error('Error initializing ${screenName}:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <View className="flex-1 bg-background">
      {/* TODO: Implement screen layout using imported components */}
      <Text className="text-2xl font-bold text-foreground">
        Screen ${screenNumber}: ${screenName}
      </Text>
    </View>
  );
};

export default ${screenName}Screen;
`;
}

/**
 * Получение описания экрана
 */
function getScreenDescription(screenNumber) {
  const descriptions = {
    "001": "Splash screen с анимированным логотипом",
    "002": "Вход по номеру телефона",
    "003": "Верификация OTP кода",
    "004": "Главный экран с модулями",
    "005": "Сканирование QR кода стола",
    "006": "Подтверждение стола",
    "007": "Категории меню ресторана",
    "008": "Блюда в категории",
    "009": "Детали блюда с модификаторами",
    "010": "Корзина заказа",
    "011": "Выбор способа оплаты",
    "012": "Процесс оплаты",
    "013": "Успешный заказ"
  };
  return descriptions[screenNumber] || "Экран приложения OneMoment";
}

/**
 * Главная функция
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🚀 OneMoment Screen Generator

Использование:
  node generate-screen.js <screen-number>
  node generate-screen.js all       # Генерирует все MVP экраны
  node generate-screen.js 001-013   # Генерирует диапазон экранов

Примеры:
  node generate-screen.js 004       # Генерирует Home Dashboard
  node generate-screen.js all       # Генерирует все 13 экранов MVP
    `);
    return;
  }
  
  const screenArg = args[0];
  
  if (screenArg === 'all') {
    // Генерируем все экраны MVP
    for (const [number, data] of Object.entries(COMPONENT_MAP)) {
      await generateScreen(number, data);
    }
  } else if (screenArg.includes('-')) {
    // Генерируем диапазон экранов
    const [start, end] = screenArg.split('-').map(n => parseInt(n));
    for (let i = start; i <= end; i++) {
      const number = i.toString().padStart(3, '0');
      if (COMPONENT_MAP[number]) {
        await generateScreen(number, COMPONENT_MAP[number]);
      }
    }
  } else {
    // Генерируем один экран
    const number = screenArg.padStart(3, '0');
    if (COMPONENT_MAP[number]) {
      await generateScreen(number, COMPONENT_MAP[number]);
    } else {
      console.error(`❌ Экран ${number} не найден в карте компонентов`);
    }
  }
}

/**
 * Генерация одного экрана
 */
async function generateScreen(number, data) {
  console.log(`\n🎨 Генерируем Screen ${number}: ${data.name}`);
  
  // 1. Устанавливаем компоненты
  await installComponents(data.components);
  
  // 2. Создаём директорию для экрана
  const screenDir = path.join(process.cwd(), 'src', 'screens', `${number}_${data.name}`);
  if (!fs.existsSync(screenDir)) {
    fs.mkdirSync(screenDir, { recursive: true });
  }
  
  // 3. Генерируем файл экрана
  const screenContent = generateScreenTemplate(number, data.name, data.components);
  fs.writeFileSync(path.join(screenDir, `${data.name}.tsx`), screenContent);
  
  // 4. Генерируем тесты
  const testContent = generateTestTemplate(number, data.name);
  fs.writeFileSync(path.join(screenDir, `${data.name}.test.tsx`), testContent);
  
  // 5. Генерируем типы
  const typesContent = generateTypesTemplate(data.name);
  fs.writeFileSync(path.join(screenDir, `${data.name}.types.ts`), typesContent);
  
  console.log(`✅ Screen ${number}: ${data.name} успешно создан!`);
}

/**
 * Генерация шаблона тестов
 */
function generateTestTemplate(screenNumber, screenName) {
  return `import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ${screenName}Screen } from './${screenName}';

describe('Screen ${screenNumber}: ${screenName}', () => {
  it('renders correctly', () => {
    const { getByText } = render(<${screenName}Screen />);
    expect(getByText(/Screen ${screenNumber}/i)).toBeTruthy();
  });
  
  it('handles user interactions', async () => {
    // TODO: Add interaction tests
  });
  
  it('validates data correctly', () => {
    // TODO: Add validation tests
  });
});
`;
}

/**
 * Генерация типов
 */
function generateTypesTemplate(screenName) {
  return `/**
 * Types for ${screenName} Screen
 */

export type T${screenName}Props = {
  route?: any;
  navigation?: any;
};

export type T${screenName}State = {
  loading: boolean;
  error: string | null;
  data: any;
};

export type T${screenName}Actions = {
  initialize: () => Promise<void>;
  submit: () => Promise<void>;
  reset: () => void;
};
`;
}

// Запускаем генератор
main().catch(console.error);