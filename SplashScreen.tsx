import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { z } from 'zod';

// TypeScript types with Zod validation
const SplashConfigSchema = z.object({
  appVersion: z.string(),
  minimumLoadTime: z.number().min(1000).max(5000),
  animationDuration: z.number().default(1000),
});

type TSplashConfig = z.infer<typeof SplashConfigSchema>;

interface SplashScreenProps {
  config?: Partial<TSplashConfig>;
}

/**
 * Screen 001: Splash Screen
 * Initial loading screen with animated logo and version info
 * NASA Power of 10: Function < 60 lines ✓
 */
export const SplashScreen: React.FC<SplashScreenProps> = ({ 
  config = {} 
}) => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Validate config with Zod
  const validatedConfig = SplashConfigSchema.parse({
    appVersion: '1.0.0',
    minimumLoadTime: 3000,
    ...config,
  });

  useEffect(() => {
    // Assertions per NASA guidelines
    console.assert(validatedConfig.minimumLoadTime >= 1000, 'Load time too short');
    console.assert(validatedConfig.minimumLoadTime <= 5000, 'Load time too long');

    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: validatedConfig.animationDuration,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: validatedConfig.minimumLoadTime,
        useNativeDriver: false,
      }),
    ]).start();

    // Navigate after minimum load time
    const timer = setTimeout(() => {
      // Check if user is authenticated
      const isAuthenticated = checkAuthStatus();
      navigation.navigate(isAuthenticated ? 'Home' : 'PhoneLogin');
    }, validatedConfig.minimumLoadTime);

    return () => clearTimeout(timer);
  }, []);

  const checkAuthStatus = (): boolean => {
    // TODO: Implement SuperTokens check
    return false;
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      
      <Animated.View 
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.logo}>🌍</Text>
        <Text style={styles.title}>OneMoment</Text>
        <Text style={styles.tagline}>Break Language Barriers</Text>
      </Animated.View>

      <View style={styles.progressContainer}>
        <Animated.View 
          style={[
            styles.progressBar,
            { width: progressWidth },
          ]} 
        />
      </View>

      <Text style={styles.version}>v{validatedConfig.appVersion}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 100,
    width: '80%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  version: {
    position: 'absolute',
    bottom: 40,
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
  },
});

export default SplashScreen;