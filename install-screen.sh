#!/bin/bash

# 🚀 OneMoment SuperApp - Universal Screen Installer
# Usage: ./install-screen.sh [screen_number]

set -e

SCREEN_NUM=$1

if [ -z "$SCREEN_NUM" ]; then
    echo "❌ Usage: ./install-screen.sh [screen_number]"
    echo "Example: ./install-screen.sh 004"
    exit 1
fi

echo "🚀 Installing Screen $SCREEN_NUM..."

# Create directories if needed
mkdir -p apps/guest-app/screens
mkdir -p packages/api-client
mkdir -p packages/state

# Function to install dependencies
install_deps() {
    echo "📦 Installing dependencies..."
    npm install --legacy-peer-deps "$@" 2>/dev/null || true
}

# Screen definitions
case "$SCREEN_NUM" in
    "004")
        echo "📱 Creating Screen 004: Home Dashboard"
        
        # Install dependencies
        install_deps zustand @react-navigation/bottom-tabs react-native-gesture-handler
        
        # Create the screen file
        cat > apps/guest-app/screens/Screen004_Home.tsx << 'ENDOFFILE'
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
ENDOFFILE
        
        # Create zustand store
        cat > packages/state/store.ts << 'ENDOFFILE'
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
ENDOFFILE
        
        echo "✅ Screen 004: Home Dashboard installed!"
        ;;
        
    "005")
        echo "📱 Creating Screen 005: QR Scanner"
        
        # Install dependencies
        install_deps react-native-qr-code-scanner react-native-camera react-native-permissions
        
        # Create the screen file
        cat > apps/guest-app/screens/Screen005_QRScanner.tsx << 'ENDOFFILE'
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Vibration,
} from 'react-native';
import QRCodeScanner from 'react-native-qr-code-scanner';
import Icon from 'react-native-vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

export const QRScannerScreen = ({ navigation }: any) => {
  const [flashOn, setFlashOn] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);

  const onSuccess = useCallback((e: any) => {
    Vibration.vibrate(100);
    
    // Parse QR data
    const data = e.data;
    
    // Navigate to table confirmation
    navigation.navigate('TableConfirmation', {
      qrData: data,
      restaurantId: data.split('|')[0],
      tableId: data.split('|')[1],
    });
  }, [navigation]);

  const handleManualSubmit = useCallback(() => {
    if (manualCode.length < 4) {
      Alert.alert('Invalid Code', 'Please enter a valid table code');
      return;
    }
    
    navigation.navigate('TableConfirmation', {
      manualCode,
      isManual: true,
    });
  }, [manualCode, navigation]);

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <QRCodeScanner
          onRead={onSuccess}
          flashMode={flashOn ? 'torch' : 'off'}
          topContent={
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Icon name="arrow-left" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.title}>Scan QR Code</Text>
              <Text style={styles.subtitle}>Point camera at table QR code</Text>
            </View>
          }
          bottomContent={
            <View style={styles.bottomContent}>
              <TouchableOpacity
                style={styles.flashButton}
                onPress={() => setFlashOn(!flashOn)}
              >
                <Icon 
                  name={flashOn ? 'zap' : 'zap-off'} 
                  size={24} 
                  color="#fff" 
                />
                <Text style={styles.flashText}>Flash</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.manualButton}
                onPress={() => setShowManualInput(!showManualInput)}
              >
                <Icon name="edit" size={24} color="#fff" />
                <Text style={styles.manualText}>Enter Code</Text>
              </TouchableOpacity>
              
              {showManualInput && (
                <View style={styles.manualInputContainer}>
                  <TextInput
                    style={styles.manualInput}
                    placeholder="Enter table code"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    value={manualCode}
                    onChangeText={setManualCode}
                    autoCapitalize="characters"
                  />
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleManualSubmit}
                  >
                    <Text style={styles.submitText}>Go</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          }
        />
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
  header: {
    padding: 20,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginTop: 50,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
  bottomContent: {
    padding: 20,
    alignItems: 'center',
  },
  flashButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 15,
  },
  flashText: {
    color: '#fff',
    marginLeft: 10,
  },
  manualButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  manualText: {
    color: '#fff',
    marginLeft: 10,
  },
  manualInputContainer: {
    flexDirection: 'row',
    marginTop: 20,
    width: '100%',
  },
  manualInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    paddingHorizontal: 15,
    color: '#fff',
    height: 44,
  },
  submitButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 20,
    borderRadius: 10,
    justifyContent: 'center',
    marginLeft: 10,
  },
  submitText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default QRScannerScreen;
ENDOFFILE
        
        echo "✅ Screen 005: QR Scanner installed!"
        ;;
        
    "pb")
        echo "📦 Creating PocketBase client"
        
        # Install PocketBase
        install_deps pocketbase
        
        # Create PocketBase client
        cat > packages/api-client/pocketbase.ts << 'ENDOFFILE'
import PocketBase from 'pocketbase';
import AsyncStorage from '@react-native-async-storage/async-storage';

// PocketBase client configuration
const PB_URL = process.env.POCKETBASE_URL || 'http://localhost:8090';

class PocketBaseClient {
  private pb: PocketBase;
  
  constructor() {
    this.pb = new PocketBase(PB_URL);
    this.setupAuthStore();
  }
  
  private async setupAuthStore() {
    // Custom auth store with AsyncStorage
    this.pb.authStore.onChange(async (token, model) => {
      if (token) {
        await AsyncStorage.setItem('pb_auth', token);
        await AsyncStorage.setItem('pb_user', JSON.stringify(model));
      } else {
        await AsyncStorage.removeItem('pb_auth');
        await AsyncStorage.removeItem('pb_user');
      }
    });
    
    // Restore auth from storage
    const token = await AsyncStorage.getItem('pb_auth');
    const user = await AsyncStorage.getItem('pb_user');
    
    if (token && user) {
      this.pb.authStore.save(token, JSON.parse(user));
    }
  }
  
  // Auth methods
  async sendOTP(phone: string) {
    return await this.pb.send('/api/v1/auth/send-otp', {
      method: 'POST',
      body: { phone },
    });
  }
  
  async verifyOTP(phone: string, otp: string, requestId: string) {
    return await this.pb.send('/api/v1/auth/verify-otp', {
      method: 'POST',
      body: { phone, otp, request_id: requestId },
    });
  }
  
  async logout() {
    this.pb.authStore.clear();
  }
  
  // API methods
  get client() {
    return this.pb;
  }
  
  get user() {
    return this.pb.authStore.model;
  }
  
  get isAuthenticated() {
    return this.pb.authStore.isValid;
  }
}

// Export singleton instance
export const pb = new PocketBaseClient();
export default pb;
ENDOFFILE
        
        echo "✅ PocketBase client installed!"
        ;;
        
    *)
        echo "❌ Screen $SCREEN_NUM not found in database"
        echo "Available screens: 004, 005, pb"
        exit 1
        ;;
esac

echo ""
echo "🎉 Installation complete!"
echo "📍 Files created successfully"
echo "📦 Dependencies installed"
echo ""
echo "To use in Cursor:"
echo "1. Open Cursor"
echo "2. Press Cmd+O"
echo "3. Search for 'Screen$SCREEN_NUM'"
echo ""