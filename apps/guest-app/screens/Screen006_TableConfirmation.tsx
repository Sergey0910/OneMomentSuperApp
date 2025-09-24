import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useStore } from '../../../packages/state/store';
import { restaurantAPI } from '../../../packages/api-client/pocketbase';

type TTableConfirmation = {
  restaurantName: string;
  restaurantImage?: string;
  tableNumber: string;
  seats: number;
  sessionId: string;
};

export const Screen006_TableConfirmation = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { qrCode } = route.params as { qrCode: string };
  
  const [loading, setLoading] = React.useState(true);
  const [tableData, setTableData] = React.useState<TTableConfirmation | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  
  const setCurrentSession = useStore((state) => state.setCurrentSession);
  const setCurrentRestaurant = useStore((state) => state.setCurrentRestaurant);

  useEffect(() => {
    verifyTable();
  }, [qrCode]);

  const verifyTable = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await restaurantAPI.verifyTable(qrCode);
      
      const confirmation: TTableConfirmation = {
        restaurantName: result.restaurant.name,
        restaurantImage: result.restaurant.image,
        tableNumber: result.table.number,
        seats: result.table.seats,
        sessionId: result.sessionId
      };
      
      setTableData(confirmation);
      
      // Save to global state
      setCurrentSession({
        sessionId: result.sessionId,
        tableId: result.table.id,
        tableNumber: result.table.number,
        restaurantId: result.restaurant.id
      });
      
      setCurrentRestaurant(result.restaurant);
      
    } catch (err) {
      setError('Invalid QR code or table not available');
      console.error('Table verification failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    navigation.navigate('Screen007_MenuCategories' as never);
  };

  const handleRescan = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>Verifying table...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Icon name="error-outline" size={80} color="#FF3B30" />
          <Text style={styles.errorTitle}>Oops!</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.rescanButton} onPress={handleRescan}>
            <Icon name="qr-code-scanner" size={24} color="#FFF" />
            <Text style={styles.rescanButtonText}>Scan Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!tableData) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Restaurant Image */}
        <View style={styles.imageContainer}>
          {tableData.restaurantImage ? (
            <Image
              source={{ uri: `http://localhost:8090/api/files/restaurants/${tableData.restaurantImage}` }}
              style={styles.restaurantImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.restaurantImage, styles.imagePlaceholder]}>
              <Icon name="restaurant" size={60} color="#CCC" />
            </View>
          )}
        </View>

        {/* Success Icon */}
        <View style={styles.successIcon}>
          <Icon name="check-circle" size={80} color="#4CAF50" />
        </View>

        {/* Restaurant & Table Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.restaurantName}>{tableData.restaurantName}</Text>
          
          <View style={styles.tableInfo}>
            <View style={styles.tableRow}>
              <Icon name="table-restaurant" size={24} color="#666" />
              <Text style={styles.tableText}>Table {tableData.tableNumber}</Text>
            </View>
            
            <View style={styles.tableRow}>
              <Icon name="people" size={24} color="#666" />
              <Text style={styles.tableText}>{tableData.seats} Seats</Text>
            </View>
          </View>

          <Text style={styles.welcomeText}>
            Welcome! You're all set to browse the menu and place your order.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.confirmButton}
            onPress={handleConfirm}
            activeOpacity={0.8}
          >
            <Text style={styles.confirmButtonText}>View Menu</Text>
            <Icon name="arrow-forward" size={24} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.rescanLink}
            onPress={handleRescan}
          >
            <Text style={styles.rescanLinkText}>Wrong table? Scan again</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontFamily: 'Inter-Regular',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  restaurantImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIcon: {
    marginTop: -40,
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    padding: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  infoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  restaurantName: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 20,
  },
  tableInfo: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  tableText: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: '#333',
    marginLeft: 12,
  },
  welcomeText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
  },
  confirmButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  confirmButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginRight: 8,
  },
  rescanLink: {
    marginTop: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  rescanLinkText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FF6B35',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1A1A1A',
    marginTop: 20,
    marginBottom: 12,
  },
  errorMessage: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  rescanButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rescanButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});

export default Screen006_TableConfirmation;
