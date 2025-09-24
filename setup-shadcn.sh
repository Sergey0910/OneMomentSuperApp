#!/bin/bash

# 🚀 OneMoment SuperApp - Shadcn MCP Setup Script
# Быстрая настройка всех компонентов для MVP

echo "🎨 OneMoment SuperApp - Shadcn/ui MCP Server Setup"
echo "================================================"
echo ""

# Проверяем наличие Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не установлен. Установите Node.js 18+ и попробуйте снова."
    exit 1
fi

# Проверяем наличие pnpm
if ! command -v pnpm &> /dev/null; then
    echo "📦 Устанавливаем pnpm..."
    npm install -g pnpm
fi

echo "📦 Шаг 1: Установка зависимостей..."
pnpm install

echo ""
echo "🎨 Шаг 2: Инициализация Shadcn/ui..."
npx shadcn@latest init -y

echo ""
echo "📱 Шаг 3: Установка React Native компонентов..."
pnpm add react-native-reusables nativewind@^4.0.0

echo ""
echo "🚀 Шаг 4: Установка базовых Shadcn компонентов для MVP..."
npx shadcn@latest add \
  button card input form select \
  dialog drawer sheet tabs accordion \
  alert badge checkbox radio-group \
  carousel separator progress toast \
  input-otp scroll-area navigation-menu

echo ""
echo "✨ Шаг 5: Установка дополнительных библиотек компонентов..."

# Ray UI
echo "Installing Ray UI components..."
npm install @ray-ui/core

# Magic UI
echo "Installing Magic UI components..."
npm install @magic-ui/core

# Tremor
echo "Installing Tremor components..."
npm install @tremor/react

# TON Connect
echo "Installing TON Connect..."
npm install @tonconnect/ui-react @tonconnect/sdk

echo ""
echo "🏗️ Шаг 6: Создание структуры проекта..."

# Создаём необходимые директории
mkdir -p src/components/ui
mkdir -p src/components/ray-ui
mkdir -p src/components/magic-ui
mkdir -p src/components/tremor
mkdir -p src/components/aceternity
mkdir -p src/screens
mkdir -p src/store
mkdir -p src/hooks
mkdir -p apps/guest-app
mkdir -p apps/waiter-app
mkdir -p apps/kitchen-app
mkdir -p packages/shared-ui

echo ""
echo "🔧 Шаг 7: Настройка Module Federation..."
cat > webpack.config.js << 'EOF'
const { ModuleFederationPlugin } = require('@callstack/repack');

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'OneMomentHost',
      filename: 'remoteEntry.js',
      remotes: {
        restaurants: 'restaurants@dynamic',
        hotels: 'hotels@dynamic',
        translator: 'translator@dynamic',
        esim: 'esim@dynamic',
      },
      shared: {
        'react': { singleton: true },
        'react-native': { singleton: true },
        '@radix-ui/*': { singleton: true },
      },
    }),
  ],
};
EOF

echo ""
echo "📝 Шаг 8: Создание примера экрана с Shadcn компонентами..."
cat > src/screens/Example.tsx << 'EOF'
import React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function ExampleScreen() {
  return (
    <View className="flex-1 p-4 bg-background">
      <Card>
        <CardHeader>
          <CardTitle>OneMoment SuperApp</CardTitle>
        </CardHeader>
        <CardContent>
          <Text className="text-foreground">
            Shadcn/ui MCP Server успешно настроен!
          </Text>
          <Button className="mt-4">
            Начать разработку
          </Button>
        </CardContent>
      </Card>
    </View>
  );
}
EOF

echo ""
echo "✅ Настройка завершена!"
echo ""
echo "🎯 Следующие шаги:"
echo "  1. Запустите генератор экранов: node scripts/generate-screen.js 004"
echo "  2. Или сгенерируйте все MVP экраны: node scripts/generate-screen.js all"
echo "  3. Запустите приложение: pnpm dev"
echo ""
echo "📚 Документация:"
echo "  - Компоненты: components-research.md"
echo "  - Shadcn/ui: https://ui.shadcn.com"
echo "  - React Native Reusables: https://github.com/mrzachnugent/react-native-reusables"
echo ""
echo "🚀 Готово к разработке 81 экрана!"