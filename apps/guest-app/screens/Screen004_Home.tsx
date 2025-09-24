import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { useStore } from '../../../packages/state/store';

const { width } = Dimensions.get('window');

// Service modules data
const SERVICES = [
  {
    id: 'restaurant',
    name: 'Restaurant',
    icon: 'coffee',
    color: '#FF6B6B',
    description: 'Order food & drinks',
    route: 'RestaurantQR',
  },
  {
    id: 'hotel',
    name: 'Hotel',
    icon: 'home',
    color: '#4ECDC4',
    description: 'Book & check-in',
    route: 'HotelSearch',
  },
  {
    id: 'esim',
    name: 'eSIM',
    icon: 'wifi',
    color: '#45B7D1',
    description: 'Mobile data plans',
    route: 'eSIMMarketplace',
  },
  {
    id: 'translator',
    name: 'Translator',
    icon: 'globe',
    color: '#96CEB4',
    description: 'Voice & text translation',
    route: 'Translator',
  },
];

export const HomeScreen = ({ navigation }: any) => {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = useStore((state) => state.user);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Refresh user data
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  }, []);

  const handleServicePress = useCallback((service: any) => {
    setLoading(true);
    // Module Federation lazy load simulation
    setTimeout(() => {
      setLoading(false);
      navigation.navigate(service.route);
    }, 500);
  }, [navigation]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#fff"
            />
          }
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.greeting}>{getGreeting()},</Text>
              <Text style={styles.userName}>{user?.name || 'Traveler'}</Text>
            </View>
            <TouchableOpacity style={styles.profileButton}>
              <Icon name="user" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Promo Banner */}
          <View style={styles.promoBanner}>
            <LinearGradient
              colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
              style={styles.promoGradient}
            >
              <Text style={styles.promoTitle}>Welcome to OneMoment! 🎉</Text>
              <Text style={styles.promoText}>
                Your all-in-one travel companion
              </Text>
            </LinearGradient>
          </View>

          {/* Service Cards */}
          <Text style={styles.sectionTitle}>Services</Text>
          <View style={styles.servicesGrid}>
            {SERVICES.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={styles.serviceCard}
                onPress={() => handleServicePress(service)}
                activeOpacity={0.8}
              >
                <View
                  style={[styles.iconContainer, { backgroundColor: service.color }]}
                >
                  <Icon name={service.icon} size={28} color="#fff" />
                </View>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceDescription}>{service.description}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Quick Actions */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickActionButton}>
              <Icon name="clock" size={20} color="#fff" />
              <Text style={styles.quickActionText}>Recent Orders</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton}>
              <Icon name="heart" size={20} color="#fff" />
              <Text style={styles.quickActionText}>Favorites</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton}>
              <Icon name="help-circle" size={20} color="#fff" />
              <Text style={styles.quickActionText}>Support</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Loading Overlay */}
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Loading module...</Text>
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  promoBanner: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
  },
  promoGradient: {
    borderRadius: 16,
    padding: 20,
  },
  promoTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 5,
  },
  promoText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 20,
    marginBottom: 15,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    marginBottom: 30,
  },
  serviceCard: {
    width: (width - 40) / 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 20,
    margin: 5,
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 5,
  },
  serviceDescription: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  quickActionButton: {
    alignItems: 'center',
    padding: 10,
  },
  quickActionText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
});

export default HomeScreen;
