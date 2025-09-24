/**
 * Screen 001: Splash Screen
 * Рефакторинг с использованием Shadcn/ui компонентов
 * 
 * @module OneMoment/Guest
 */

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { z } from 'zod';

// Импорты из @onemoment/shared-ui
import {
  AnimatedLogo,
  AuroraBackground,
  Progress,
  cn,
  THEME_COLORS,
  ANIMATIONS
} from '@onemoment/shared-ui';

// Tremor компоненты
import { LoadingSpinner } from '@tremor/react';

// Framer Motion для анимаций
import { motion } from 'framer-motion';

// Types с Zod валидацией
const SplashConfigSchema = z.object({
  minDisplayTime: z.number().min(1000).max(5000).default(2000),
  fadeOutDuration: z.number().default(500),
  logoScale: z.number().min(0.5).max(2).default(1.2),
  progressSteps: z.number().min(3).max(10).default(5)
});

type TSplashConfig = z.infer<typeof SplashConfigSchema>;

/**
 * Splash Screen с унифицированными Shadcn компонентами
 * Использует Module Federation для проверки загрузки модулей
 */
export const SplashScreen: React.FC = () => {
  const navigation = useNavigation();
  const [progress, setProgress] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Инициализация...');

  const config: TSplashConfig = SplashConfigSchema.parse({
    minDisplayTime: 2000,
    fadeOutDuration: 500,
    logoScale: 1.2,
    progressSteps: 5
  });

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    const steps = [
      { progress: 20, message: 'Загрузка конфигурации...', action: loadConfig },
      { progress: 40, message: 'Проверка авторизации...', action: checkAuth },
      { progress: 60, message: 'Загрузка модулей...', action: loadModules },
      { progress: 80, message: 'Инициализация UI...', action: initializeUI },
      { progress: 100, message: 'Готово!', action: finishLoading }
    ];

    for (const step of steps) {
      setProgress(step.progress);
      setLoadingMessage(step.message);
      await step.action();
      await delay(config.minDisplayTime / config.progressSteps);
    }
  };

  const loadConfig = async () => {
    try {
      // Загружаем конфигурацию из AsyncStorage
      const config = await AsyncStorage.getItem('@onemoment/config');
      if (config) {
        console.log('Config loaded:', JSON.parse(config));
      }
    } catch (error) {
      console.error('Error loading config:', error);
    }
  };

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('@onemoment/token');
      if (token) {
        // Валидируем токен через Zod
        const TokenSchema = z.string().min(1);
        TokenSchema.parse(token);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  };

  const loadModules = async () => {
    try {
      // Проверяем доступность Module Federation модулей
      if (typeof __webpack_require__ !== 'undefined') {
        // Предзагружаем критичные модули
        const modules = ['restaurants', 'hotels', 'translator', 'esim'];
        for (const module of modules) {
          console.log(`Preloading module: ${module}`);
        }
      }
    } catch (error) {
      console.error('Module loading failed:', error);
    }
  };

  const initializeUI = async () => {
    // Инициализируем UI компоненты
    setIsInitialized(true);
  };

  const finishLoading = async () => {
    await delay(config.fadeOutDuration);
    
    // Проверяем, есть ли сохранённый токен
    const token = await AsyncStorage.getItem('@onemoment/token');
    
    if (token) {
      // @ts-ignore - навигация типизируется отдельно
      navigation.replace('Home');
    } else {
      // @ts-ignore
      navigation.replace('PhoneLogin');
    }
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  return (
    <View style={styles.container} className="flex-1">
      {/* Aurora фоновый эффект из Aceternity */}
      <AuroraBackground 
        className="absolute inset-0"
        colors={[THEME_COLORS.restaurant, THEME_COLORS.hotel, THEME_COLORS.esim]}
      />
      
      {/* Центральный контейнер с логотипом */}
      <View style={styles.content} className="items-center justify-center">
        {/* Анимированный логотип из Magic UI */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: config.logoScale, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        >
          <AnimatedLogo 
            size={120}
            className="mb-8"
            animation={ANIMATIONS.pulse}
          />
        </motion.div>
        
        {/* Прогресс бар из Shadcn */}
        <View style={styles.progressContainer} className="w-64">
          <Progress 
            value={progress} 
            className={cn(
              "h-2 bg-white/20",
              progress === 100 && "bg-green-500"
            )}
          />
        </View>
        
        {/* Текст загрузки с анимацией */}
        <motion.div
          key={loadingMessage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4"
        >
          <View className="flex-row items-center">
            {progress < 100 && (
              <LoadingSpinner 
                size="small" 
                color="white"
                className="mr-2"
              />
            )}
            <Text className="text-white text-sm font-medium">
              {loadingMessage}
            </Text>
          </View>
        </motion.div>
        
        {/* Версия приложения */}
        <View style={styles.version} className="absolute bottom-8">
          <Text className="text-white/60 text-xs">
            OneMoment v1.0.0 • Build 2025.09.21
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  progressContainer: {
    width: 250,
    marginTop: 40,
  },
  version: {
    position: 'absolute',
    bottom: 30,
  },
});

// Компонент Text для React Native совместимости
const Text: React.FC<{ className?: string; style?: any; children: React.ReactNode }> = ({ 
  className, 
  style, 
  children 
}) => {
  const RNText = require('react-native').Text;
  return <RNText style={style} className={className}>{children}</RNText>;
};

export default SplashScreen;