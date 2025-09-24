# 🏗️ OneMomentSuperApp: АРХИТЕКТУРА MODULE FEDERATION
> **Модульная архитектура для 81 экрана**
> **Версия:** 1.0 | **Дата:** 20.09.2025

## 📦 ОСНОВНАЯ КОНЦЕПЦИЯ

```
┌─────────────────────────────────────────────┐
│           OneMoment Host App (5MB)          │
│                                              │
│  ┌──────────────────────────────────────┐  │
│  │        Core Shell & Navigation       │  │
│  └──────────────────────────────────────┘  │
│                     ↓                        │
│  ┌──────────────────────────────────────┐  │
│  │     Module Federation Runtime        │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
                     ↓
    Динамическая загрузка по требованию
                     ↓
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ Restaurant  │    Hotel    │ Translator  │    eSIM     │
│   Module    │   Module    │   Module    │   Module    │
│    (2MB)    │    (2MB)    │    (1MB)    │    (1MB)    │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

## 🎯 КОНФИГУРАЦИЯ RE.PACK

### webpack.config.js
```javascript
const Repack = require('@callstack/repack');

module.exports = {
  entry: {
    app: './src/index.js',
  },
  plugins: [
    new Repack.plugins.ModuleFederationPluginV2({
      name: 'OneMomentHost',
      filename: 'remoteEntry.js',
      
      // Экспортируем для суб-приложений
      exposes: {
        './Navigation': './src/navigation/NavigationContainer',
        './Auth': './src/auth/AuthProvider',
        './UI': './src/shared/UIKit',
      },
      
      // Подключаем удалённые модули
      remotes: {
        restaurants: {
          external: `promise new Promise(resolve => {
            const script = loadScript('https://cdn.onemoment.app/restaurants/[version]/remoteEntry.js');
            script.onload = () => {
              resolve(window.restaurants);
            };
          })`,
        },
        hotels: {
          external: `promise new Promise(resolve => {
            const script = loadScript('https://cdn.onemoment.app/hotels/[version]/remoteEntry.js');
            script.onload = () => {
              resolve(window.hotels);
            };
          })`,
        },
        translator: {
          external: `promise new Promise(resolve => {
            const script = loadScript('https://cdn.onemoment.app/translator/[version]/remoteEntry.js');
            script.onload = () => {
              resolve(window.translator);
            };
          })`,
        },
        esim: {
          external: `promise new Promise(resolve => {
            const script = loadScript('https://cdn.onemoment.app/esim/[version]/remoteEntry.js');
            script.onload = () => {
              resolve(window.esim);
            };
          })`,
        },
      },
      
      // Общие зависимости
      shared: {
        'react': { 
          singleton: true, 
          eager: true,
          requiredVersion: '^18.2.0'
        },
        'react-native': { 
          singleton: true, 
          eager: true,
          requiredVersion: '^0.72.0'
        },
        '@apollo/client': {
          singleton: true,
          requiredVersion: '^3.8.0'
        },
        'zustand': {
          singleton: true,
          requiredVersion: '^4.4.0'
        },
      },
    }),
  ],
};
```

## 📱 СТРУКТУРА МОДУЛЕЙ

### Restaurant Module (28 экранов)
```javascript
// restaurants/webpack.config.js
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'restaurants',
      filename: 'remoteEntry.js',
      exposes: {
        './QRScanner': './src/screens/QRScanner',
        './MenuCategories': './src/screens/MenuCategories',
        './Cart': './src/screens/Cart',
        './Payment': './src/screens/Payment',
        // ... все 28 экранов
      },
      shared: {
        ...sharedDependencies,
      },
    }),
  ],
};
```

### Hotel Module (10 экранов)
```javascript
// hotels/webpack.config.js  
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'hotels',
      filename: 'remoteEntry.js',
      exposes: {
        './HotelSearch': './src/screens/HotelSearch',
        './RoomSelection': './src/screens/RoomSelection',
        './DigitalCheckin': './src/screens/DigitalCheckin',
        // ... все 10 экранов
      },
    }),
  ],
};
```

## 🔄 ДИНАМИЧЕСКАЯ ЗАГРУЗКА

### ModuleLoader Component
```typescript
import React, { Suspense, lazy, useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

interface ModuleLoaderProps {
  moduleName: 'restaurants' | 'hotels' | 'translator' | 'esim';
  screenName: string;
  fallback?: React.ComponentType;
}

export const ModuleLoader: React.FC<ModuleLoaderProps> = ({
  moduleName,
  screenName,
  fallback: Fallback,
}) => {
  const [Module, setModule] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const loadModule = async () => {
      try {
        // Проверяем кэш
        const cached = await AsyncStorage.getItem(`module_${moduleName}`);
        if (cached) {
          const CachedModule = JSON.parse(cached);
          setModule(() => CachedModule);
          return;
        }
        
        // Загружаем модуль
        const container = await import(moduleName);
        const factory = await container.get(`./${screenName}`);
        const Module = factory();
        
        // Кэшируем
        await AsyncStorage.setItem(
          `module_${moduleName}`,
          JSON.stringify(Module)
        );
        
        setModule(() => Module);
      } catch (err) {
        setError(err as Error);
        
        // Fallback на локальную версию
        if (Fallback) {
          setModule(() => Fallback);
        }
      }
    };
    
    loadModule();
  }, [moduleName, screenName]);
  
  if (error && !Fallback) {
    return <ErrorBoundary error={error} />;
  }
  
  if (!Module) {
    return <LoadingScreen />;
  }
  
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Module />
    </Suspense>
  );
};
```

## 🎨 НАВИГАЦИЯ МЕЖДУ МОДУЛЯМИ

### Navigation Setup
```typescript
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Core Screens */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Auth" component={AuthScreens} />
        
        {/* Restaurant Module */}
        <Stack.Screen 
          name="RestaurantQR"
          component={() => (
            <ModuleLoader 
              moduleName="restaurants" 
              screenName="QRScanner"
            />
          )}
        />
        
        {/* Hotel Module */}
        <Stack.Screen
          name="HotelSearch"
          component={() => (
            <ModuleLoader
              moduleName="hotels"
              screenName="HotelSearch"  
            />
          )}
        />
        
        {/* Translator Module */}
        <Stack.Screen
          name="Translator"
          component={() => (
            <ModuleLoader
              moduleName="translator"
              screenName="VoiceTranslator"
            />
          )}
        />
        
        {/* eSIM Module */}
        <Stack.Screen
          name="eSIM"
          component={() => (
            <ModuleLoader
              moduleName="esim"
              screenName="eSIMMarketplace"
            />
          )}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
```

## 📊 ВЕРСИОНИРОВАНИЕ МОДУЛЕЙ

### Version Management
```typescript
interface ModuleVersion {
  module: string;
  version: string;
  minVersion: string;
  releaseDate: Date;
  features: string[];
}

const MODULE_VERSIONS: ModuleVersion[] = [
  {
    module: 'restaurants',
    version: '1.2.0',
    minVersion: '1.0.0',
    releaseDate: new Date('2025-09-01'),
    features: ['QR', 'TON', 'Reviews']
  },
  {
    module: 'hotels',
    version: '1.1.0',
    minVersion: '1.0.0',
    releaseDate: new Date('2025-09-10'),
    features: ['Booking', 'DigitalKey']
  },
  // ...
];

// A/B Testing разных версий
const getModuleVersion = (module: string, userId: string): string => {
  const hash = hashCode(userId);
  
  // 10% пользователей получают beta версию
  if (hash % 10 === 0) {
    return `${module}@beta`;
  }
  
  // 90% получают stable
  return `${module}@stable`;
};
```

## 🔐 БЕЗОПАСНОСТЬ

### Security Measures
```typescript
// Проверка подписи модулей
const verifyModuleSignature = async (
  moduleUrl: string,
  signature: string
): Promise<boolean> => {
  const publicKey = await getPublicKey();
  const moduleContent = await fetch(moduleUrl).then(r => r.text());
  
  return crypto.subtle.verify(
    'RSA-SHA256',
    publicKey,
    signature,
    moduleContent
  );
};

// Sandbox для модулей
const createModuleSandbox = (moduleCode: string) => {
  return new Function(
    'window',
    'document',
    'require',
    `
      'use strict';
      const sandbox = Object.create(null);
      ${moduleCode}
      return sandbox.exports;
    `
  )({}, {}, secureRequire);
};
```

## 📈 МЕТРИКИ И МОНИТОРИНГ

### Performance Tracking
```typescript
interface ModuleMetrics {
  loadTime: number;
  bundleSize: number;
  cacheHitRate: number;
  errorRate: number;
  userEngagement: number;
}

const trackModulePerformance = (
  moduleName: string,
  metrics: ModuleMetrics
): void => {
  // Отправляем в аналитику
  analytics.track('module_performance', {
    module: moduleName,
    ...metrics,
  });
  
  // Алерт если медленно
  if (metrics.loadTime > 3000) {
    Sentry.captureMessage(
      `Slow module load: ${moduleName} (${metrics.loadTime}ms)`
    );
  }
};
```

## 🚀 ОПТИМИЗАЦИИ

### Предзагрузка
```typescript
// Предзагружаем популярные модули
const preloadModules = async () => {
  const popularModules = ['restaurants', 'hotels'];
  
  for (const module of popularModules) {
    // Загружаем в фоне
    requestIdleCallback(() => {
      import(module).then(container => {
        // Кэшируем
        cacheModule(module, container);
      });
    });
  }
};
```

### Chunk Splitting
```javascript
// Разделяем большие модули на чанки
optimization: {
  splitChunks: {
    chunks: 'async',
    minSize: 20000,
    maxSize: 244000,
    cacheGroups: {
      restaurant: {
        test: /[\\/]restaurants[\\/]/,
        name: 'restaurant-vendor',
        priority: 10,
      },
      hotel: {
        test: /[\\/]hotels[\\/]/,
        name: 'hotel-vendor',
        priority: 10,
      },
    },
  },
}
```

## ✅ ПРЕИМУЩЕСТВА АРХИТЕКТУРЫ

1. **Независимое развёртывание** - обновляем модули без пересборки
2. **Малый размер** - загружаем только нужное
3. **A/B тестирование** - разные версии для разных пользователей
4. **Fallback** - работает даже если CDN недоступен
5. **Масштабируемость** - легко добавлять новые модули

---

**📌 Эта архитектура позволяет держать приложение под 20MB при 81 экране!**