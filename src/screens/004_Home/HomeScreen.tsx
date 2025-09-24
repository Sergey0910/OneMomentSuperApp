/**
 * Screen 004: Home Dashboard
 * Главный экран с 4 модулями и QR Scanner
 * 
 * @module OneMoment/Guest
 */

import React, { useState, useCallback, useEffect } from 'react';
import { 
  View, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet,
  Dimensions,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '@/store';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';

// Импорты из @onemoment/shared-ui
import {
  DashboardLayout,
  BentoGrid,
  Card3D,
  KpiCard,
  Button,
  Badge,
  cn,
  THEME_COLORS,
  ANIMATIONS,
  useModuleFederation,
  formatPrice
} from '@onemoment/shared-ui';

// Иконки
import { 
  QrCode, 
  Utensils, 
  Hotel, 
  Sim, 
  Languages,
  Sparkles,
  TrendingUp,
  Star
} from 'lucide-react-native';

// Framer Motion
import { motion, AnimatePresence } from 'framer-motion';

// Types
const ModuleSchema = z.object({
  id: z.enum(['restaurant', 'hotel', 'esim', 'translator']),
  title: z.string(),
  description: z.string(),
  icon: z.any(),
  color: z.string(),
  route: z.string(),
  isActive: z.boolean().default(true),
  badge: z.string().optional(),
  stats: z.object({
    usage: z.number(),
    rating: z.number(),
    trend: z.enum(['up', 'down', 'stable'])
  }).optional()
});

type TModule = z.infer<typeof ModuleSchema>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

/**
 * Home Dashboard с 4 основными модулями и QR Scanner
 */
export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, settings } = useStore();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const { loadModule, isModuleLoaded } = useModuleFederation();

  // Загружаем данные пользователя
  const { data: userData } = useQuery({
    queryKey: ['user', 'profile'],
    queryFn: async () => {
      // GraphQL запрос для профиля
      return {
        name: 'Сергей',
        lastOrder: '2 часа назад',
        savedAmount: 15420,
        visits: 23
      };
    }
  });

  // Конфигурация 4 модулей
  const modules: TModule[] = [
    {
      id: 'restaurant',
      title: 'Рестораны',
      description: 'Заказ еды без языкового барьера',
      icon: Utensils,
      color: THEME_COLORS.restaurant,
      route: 'RestaurantQR',
      isActive: true,
      badge: 'HOT',
      stats: {
        usage: 1247,
        rating: 4.8,
        trend: 'up'
      }
    },
    {
      id: 'hotel',
      title: 'Отели',
      description: 'Бронирование и digital check-in',
      icon: Hotel,
      color: THEME_COLORS.hotel,
      route: 'HotelSearch',
      isActive: true,
      stats: {
        usage: 523,
        rating: 4.6,
        trend: 'up'
      }
    },
    {
      id: 'esim',
      title: 'eSIM',
      description: 'Интернет в любой стране',
      icon: Sim,
      color: THEME_COLORS.esim,
      route: 'eSIMMarketplace',
      isActive: true,
      badge: 'NEW',
      stats: {
        usage: 89,
        rating: 4.9,
        trend: 'up'
      }
    },
    {
      id: 'translator',
      title: 'Переводчик',
      description: 'Голосовой перевод в реальном времени',
      icon: Languages,
      color: THEME_COLORS.translator,
      route: 'TranslatorVoice',
      isActive: true,
      stats: {
        usage: 2103,
        rating: 4.7,
        trend: 'stable'
      }
    }
  ];

  // Обработчик нажатия на модуль
  const handleModulePress = useCallback(async (module: TModule) => {
    setSelectedModule(module.id);
    
    // Загружаем модуль через Module Federation
    if (!isModuleLoaded(module.id)) {
      try {
        await loadModule(module.id);
      } catch (error) {
        console.error(`Failed to load module ${module.id}:`, error);
      }
    }
    
    // Навигация к модулю
    // @ts-ignore
    navigation.navigate(module.route);
    
    // Сброс выделения
    setTimeout(() => setSelectedModule(null), 500);
  }, [navigation, loadModule, isModuleLoaded]);

  // Обработчик QR Scanner
  const handleQRScanner = () => {
    // @ts-ignore
    navigation.navigate('QRScanner');
  };

  return (
    <DashboardLayout
      className="flex-1 bg-background"
      header={{
        title: `Привет, ${userData?.name || 'Путешественник'}! 👋`,
        subtitle: 'Что будем делать сегодня?'
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* KPI Карточки */}
        <View style={styles.kpiContainer} className="mb-6">
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.kpiScroll}
          >
            <KpiCard
              title="Сэкономлено"
              value={formatPrice(userData?.savedAmount || 0)}
              trend="up"
              trendValue="+12%"
              className="mr-3"
              style={{ width: CARD_WIDTH }}
            />
            <KpiCard
              title="Посещений"
              value={userData?.visits || 0}
              trend="up"
              trendValue="+3"
              className="mr-3"
              style={{ width: CARD_WIDTH }}
            />
            <KpiCard
              title="Рейтинг"
              value="4.9"
              icon={<Star size={16} color="#FFB800" />}
              className="mr-3"
              style={{ width: CARD_WIDTH }}
            />
          </ScrollView>
        </View>

        {/* QR Scanner Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <TouchableOpacity
            onPress={handleQRScanner}
            activeOpacity={0.9}
            style={styles.qrButton}
            className="mb-6"
          >
            <View className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-white text-xl font-bold mb-1">
                  Сканировать QR
                </Text>
                <Text className="text-white/80 text-sm">
                  Быстрый доступ к меню ресторана
                </Text>
              </View>
              <View className="bg-white/20 rounded-xl p-3">
                <QrCode size={32} color="white" />
              </View>
            </View>
            <Sparkles 
              size={24} 
              color="#FFB800" 
              style={styles.sparkleIcon}
              className="absolute top-2 right-2"
            />
          </TouchableOpacity>
        </motion.div>

        {/* Основные модули в Bento Grid */}
        <BentoGrid columns={2} gap={16}>
          {modules.map((module) => (
            <AnimatePresence key={module.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                <TouchableOpacity
                  onPress={() => handleModulePress(module)}
                  activeOpacity={0.95}
                  style={[
                    styles.moduleCard,
                    selectedModule === module.id && styles.selectedCard
                  ]}
                >
                  <Card3D
                    className="relative overflow-hidden"
                    style={{
                      backgroundColor: module.color + '10',
                      borderColor: module.color + '30'
                    }}
                  >
                    {/* Badge если есть */}
                    {module.badge && (
                      <Badge 
                        className="absolute top-3 right-3 z-10"
                        variant={module.badge === 'HOT' ? 'destructive' : 'default'}
                      >
                        {module.badge}
                      </Badge>
                    )}

                    {/* Контент карточки */}
                    <View className="p-5">
                      {/* Иконка */}
                      <View 
                        className="w-12 h-12 rounded-xl items-center justify-center mb-4"
                        style={{ backgroundColor: module.color + '20' }}
                      >
                        <module.icon size={24} color={module.color} />
                      </View>

                      {/* Заголовок и описание */}
                      <Text className="text-foreground text-lg font-semibold mb-2">
                        {module.title}
                      </Text>
                      <Text className="text-muted-foreground text-sm mb-4" numberOfLines={2}>
                        {module.description}
                      </Text>

                      {/* Статистика */}
                      {module.stats && (
                        <View className="flex-row items-center justify-between pt-3 border-t border-border">
                          <View className="flex-row items-center">
                            <Star size={14} color="#FFB800" />
                            <Text className="text-xs text-muted-foreground ml-1">
                              {module.stats.rating}
                            </Text>
                          </View>
                          <View className="flex-row items-center">
                            <TrendingUp 
                              size={14} 
                              color={module.stats.trend === 'up' ? '#10B981' : '#6B7280'}
                            />
                            <Text className="text-xs text-muted-foreground ml-1">
                              {module.stats.usage} сегодня
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>

                    {/* Градиентный оверлей для красоты */}
                    <View 
                      className="absolute bottom-0 left-0 right-0 h-1"
                      style={{ backgroundColor: module.color }}
                    />
                  </Card3D>
                </TouchableOpacity>
              </motion.div>
            </AnimatePresence>
          ))}
        </BentoGrid>

        {/* Быстрые действия */}
        <View style={styles.quickActions} className="mt-6">
          <Text className="text-lg font-semibold text-foreground mb-3">
            Быстрые действия
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
          >
            <Button variant="outline" className="mr-3">
              <Hotel size={16} className="mr-2" />
              Мои брони
            </Button>
            <Button variant="outline" className="mr-3">
              <Utensils size={16} className="mr-2" />
              История заказов
            </Button>
            <Button variant="outline" className="mr-3">
              <Languages size={16} className="mr-2" />
              Разговорник
            </Button>
          </ScrollView>
        </View>
      </ScrollView>
    </DashboardLayout>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100
  },
  kpiContainer: {
    marginTop: 16
  },
  kpiScroll: {
    paddingRight: 16
  },
  qrButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sparkleIcon: {
    position: 'absolute',
    top: 8,
    right: 8
  },
  moduleCard: {
    marginBottom: 16,
  },
  selectedCard: {
    transform: [{ scale: 0.97 }]
  },
  quickActions: {
    marginBottom: 20
  }
});

// Text компонент для React Native
const Text: React.FC<{ 
  className?: string; 
  style?: any; 
  children: React.ReactNode;
  numberOfLines?: number;
}> = ({ className, style, children, numberOfLines }) => {
  const RNText = require('react-native').Text;
  return (
    <RNText 
      style={style} 
      className={className}
      numberOfLines={numberOfLines}
    >
      {children}
    </RNText>
  );
};

export default HomeScreen;