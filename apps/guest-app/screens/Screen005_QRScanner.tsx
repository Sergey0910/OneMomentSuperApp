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
