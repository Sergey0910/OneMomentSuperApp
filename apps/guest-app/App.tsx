import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

// Import screens
import Screen002_PhoneLogin from './screens/Screen002_PhoneLogin';
import Screen003_OTPVerification from './screens/Screen003_OTPVerification';
import Screen004_Home from './screens/Screen004_Home';
import Screen005_QRScanner from './screens/Screen005_QRScanner';

// For now, we'll use a simple state to navigate between screens
// Later this will be replaced with React Navigation

const App = () => {
  const [currentScreen, setCurrentScreen] = React.useState('menu');
  const [phoneNumber, setPhoneNumber] = React.useState('');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return (
          <Screen002_PhoneLogin
            onSuccess={(phone) => {
              setPhoneNumber(phone);
              setCurrentScreen('otp');
            }}
          />
        );
      
      case 'otp':
        return (
          <Screen003_OTPVerification
            phoneNumber={phoneNumber}
            onSuccess={() => setCurrentScreen('home')}
          />
        );
      
      case 'home':
        return (
          <Screen004_Home
            onNavigate={(screen) => setCurrentScreen(screen)}
          />
        );
      
      case 'qr':
        return (
          <Screen005_QRScanner
            onSuccess={() => setCurrentScreen('menu')}
          />
        );
      
      default:
        return (
          <ScrollView style={styles.menu}>
            <Text style={styles.title}>🚀 OneMoment SuperApp</Text>
            <Text style={styles.subtitle}>MVP Test Menu</Text>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Available Screens:</Text>
              
              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => setCurrentScreen('login')}
              >
                <Text style={styles.buttonText}>📱 Phone Login</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => setCurrentScreen('home')}
              >
                <Text style={styles.buttonText}>🏠 Home Dashboard</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => setCurrentScreen('qr')}
              >
                <Text style={styles.buttonText}>📷 QR Scanner</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.info}>
              <Text style={styles.infoTitle}>Test Credentials:</Text>
              <Text style={styles.infoText}>Phone: +1234567890</Text>
              <Text style={styles.infoText}>OTP: 123456</Text>
              <Text style={styles.infoText}>QR: QR_TABLE_1</Text>
            </View>
          </ScrollView>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {renderScreen()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  menu: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  menuButton: {
    backgroundColor: '#FF6B35',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  info: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
});

export default App;
