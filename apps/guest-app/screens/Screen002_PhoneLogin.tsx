import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import CountryPicker, { Country } from 'react-native-country-picker-modal';
import { parsePhoneNumber, isValidPhoneNumber, CountryCode } from 'libphonenumber-js';
import { z } from 'zod';
import { pb } from '../../../packages/api-client/pocketbase';

// ==================== TYPES ====================
const PhoneLoginSchema = z.object({
  countryCode: z.string().min(1, 'Country code required'),
  phoneNumber: z.string().min(6, 'Phone number too short'),
  fullNumber: z.string(),
  isValid: z.boolean(),
});

type TPhoneLoginData = z.infer<typeof PhoneLoginSchema>;

interface IPhoneLoginProps {
  navigation: any; // React Navigation prop
}

interface ICountryData {
  cca2: CountryCode;
  callingCode: string[];
  flag: string;
  name: string;
}

// ==================== CONSTANTS ====================
const GRADIENT_COLORS = ['#667eea', '#764ba2'] as const;
const INPUT_MAX_LENGTH = 15;
const API_TIMEOUT = 10000; // 10 seconds

// ==================== COMPONENT ====================
export const PhoneLoginScreen: React.FC<IPhoneLoginProps> = ({ navigation }) => {
  // ========== STATE ==========
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [countryCode, setCountryCode] = useState<CountryCode>('US');
  const [callingCode, setCallingCode] = useState<string>('+1');
  const [isCountryPickerVisible, setIsCountryPickerVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // ========== COMPUTED ==========
  const fullPhoneNumber = useMemo(() => {
    return `${callingCode}${phoneNumber}`;
  }, [callingCode, phoneNumber]);

  const isPhoneValid = useMemo(() => {
    if (!phoneNumber || phoneNumber.length < 6) return false;
    try {
      return isValidPhoneNumber(fullPhoneNumber, countryCode);
    } catch {
      return false;
    }
  }, [fullPhoneNumber, countryCode, phoneNumber]);

  const formattedPhoneNumber = useMemo(() => {
    if (!phoneNumber) return '';
    try {
      const parsed = parsePhoneNumber(fullPhoneNumber, countryCode);
      return parsed.formatInternational();
    } catch {
      return fullPhoneNumber;
    }
  }, [fullPhoneNumber, countryCode, phoneNumber]);

  // ========== HANDLERS ==========
  const handleCountrySelect = useCallback((country: Country) => {
    setCountryCode(country.cca2 as CountryCode);
    setCallingCode(`+${country.callingCode[0]}`);
    setIsCountryPickerVisible(false);
    setError('');
  }, []);

  const handlePhoneNumberChange = useCallback((text: string) => {
    // Remove non-numeric characters
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length <= INPUT_MAX_LENGTH) {
      setPhoneNumber(cleaned);
      setError('');
    }
  }, []);

  const validatePhoneData = useCallback((): TPhoneLoginData | null => {
    try {
      const data: TPhoneLoginData = {
        countryCode,
        phoneNumber,
        fullNumber: fullPhoneNumber,
        isValid: isPhoneValid,
      };
      
      const validated = PhoneLoginSchema.parse(data);
      
      if (!validated.isValid) {
        setError('Please enter a valid phone number');
        return null;
      }
      
      return validated;
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      }
      return null;
    }
  }, [countryCode, phoneNumber, fullPhoneNumber, isPhoneValid]);

  const sendOTP = useCallback(async () => {
    const phoneData = validatePhoneData();
    if (!phoneData) return;

    setIsLoading(true);
    setError('');

    try {
      // API call to PocketBase
      const response = await Promise.race([
        pb.send('/api/v1/auth/send-otp', {
          method: 'POST',
          body: {
            phone: phoneData.fullNumber,
            country_code: phoneData.countryCode,
          },
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), API_TIMEOUT)
        ),
      ]);

      // Navigate to OTP screen with phone data
      navigation.navigate('OTPVerification', {
        phone: phoneData.fullNumber,
        requestId: response.request_id,
        countryCode: phoneData.countryCode,
      });
    } catch (err: any) {
      console.error('Send OTP Error:', err);
      setError(err.message || 'Failed to send OTP. Please try again.');
      
      // Show alert for errors
      Alert.alert(
        'Error',
        err.message || 'Something went wrong. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  }, [validatePhoneData, navigation]);

  const handleContinue = useCallback(() => {
    if (isLoading) return;
    sendOTP();
  }, [isLoading, sendOTP]);

  // ========== RENDER ==========
  return (
    <LinearGradient colors={[...GRADIENT_COLORS]} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                disabled={isLoading}
              >
                <Icon name="arrow-left" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.title}>Enter Your Phone Number</Text>
              <Text style={styles.subtitle}>
                We'll send you a verification code
              </Text>
            </View>

            {/* Phone Input Section */}
            <View style={styles.inputContainer}>
              {/* Country Picker */}
              <TouchableOpacity
                style={styles.countryButton}
                onPress={() => setIsCountryPickerVisible(true)}
                disabled={isLoading}
              >
                <CountryPicker
                  countryCode={countryCode}
                  withFlag
                  withCallingCode
                  withFilter
                  withModal
                  visible={isCountryPickerVisible}
                  onSelect={handleCountrySelect}
                  onClose={() => setIsCountryPickerVisible(false)}
                  containerButtonStyle={styles.countryPickerButton}
                />
                <Text style={styles.callingCode}>{callingCode}</Text>
                <Icon name="chevron-down" size={20} color="#fff" />
              </TouchableOpacity>

              {/* Phone Number Input */}
              <TextInput
                style={[styles.phoneInput, error && styles.inputError]}
                placeholder="Phone number"
                placeholderTextColor="rgba(255,255,255,0.5)"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={handlePhoneNumberChange}
                editable={!isLoading}
                maxLength={INPUT_MAX_LENGTH}
                autoFocus
              />
            </View>

            {/* Formatted Number Display */}
            {phoneNumber.length > 0 && (
              <Text style={styles.formattedNumber}>
                {formattedPhoneNumber}
              </Text>
            )}

            {/* Error Message */}
            {error && (
              <View style={styles.errorContainer}>
                <Icon name="alert-circle" size={16} color="#ff6b6b" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Continue Button */}
            <TouchableOpacity
              style={[
                styles.continueButton,
                (!isPhoneValid || isLoading) && styles.buttonDisabled,
              ]}
              onPress={handleContinue}
              disabled={!isPhoneValid || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Continue</Text>
              )}
            </TouchableOpacity>

            {/* Terms and Privacy */}
            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                By continuing, you agree to our{' '}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Terms')}>
                <Text style={styles.termsLink}>Terms of Service</Text>
              </TouchableOpacity>
              <Text style={styles.termsText}> and </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Privacy')}>
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

// ==================== STYLES ====================
const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 40,
  },
  backButton: {
    marginBottom: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  countryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 15,
    borderRadius: 12,
    marginRight: 10,
    height: 56,
  },
  countryPickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callingCode: {
    color: '#fff',
    fontSize: 16,
    marginHorizontal: 8,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#fff',
    height: 56,
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#ff6b6b',
  },
  formattedNumber: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginBottom: 20,
    marginLeft: 5,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  errorText: {
    color: '#ff6b6b',
    marginLeft: 6,
    fontSize: 14,
  },
  continueButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  termsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 30,
    paddingHorizontal: 20,
  },
  termsText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  termsLink: {
    color: '#fff',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
});

export default PhoneLoginScreen;