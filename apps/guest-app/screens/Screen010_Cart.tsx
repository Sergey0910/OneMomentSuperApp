import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useStore } from '../../../packages/state/store';
import { orderAPI } from '../../../packages/api-client/pocketbase';

type TCartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  modifiers?: Record<string, any>;
};

export const Screen010_Cart = () => {
  const navigation = useNavigation();
  const [promoCode, setPromoCode] = useState('');
  const [notes, setNotes] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const cartItems = useStore((state) => state.cartItems);
  const updateCartItem = useStore((state) => state.updateCartItem);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const clearCart = useStore((state) => state.clearCart);
  const currentSession = useStore((state) => state.currentSession);
  const currentRestaurant = useStore((state) => state.currentRestaurant);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const discount = promoDiscount;
  const total = subtotal + tax - discount;

  const handleQuantityChange = (itemId: string, change: number) => {
    const item = cartItems.find(i => i.id === itemId);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity <= 0) {
        removeFromCart(itemId);
      } else {
        updateCartItem(itemId, { quantity: newQuantity });
      }
    }
  };

  const handleApplyPromo = () => {
    // Mock promo code validation
    if (promoCode.toUpperCase() === 'PASTA20') {
      const pastaItems = cartItems.filter(item => 
        item.name.toLowerCase().includes('pasta')
      );
      const pastaTotal = pastaItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      setPromoDiscount(pastaTotal * 0.2);
      Alert.alert('Success', 'Promo code applied!');
    } else {
      Alert.alert('Invalid Code', 'This promo code is not valid');
      setPromoDiscount(0);
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart');
      return;
    }

    try {
      setIsProcessing(true);
      
      // Create order
      const orderData = {
        restaurant: currentRestaurant?.id,
        table: currentSession?.tableId,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          modifiers: item.modifiers,
        })),
        type: 'dine_in',
        subtotal,
        tax,
        discount,
        total,
        notes,
      };

      const order = await orderAPI.createOrder(orderData);
      
      // Navigate to payment
      navigation.navigate('Screen011_PaymentSelection' as never, { 
        orderId: order.id,
        total: total 
      } as never);
      
    } catch (error) {
      Alert.alert('Error', 'Failed to create order. Please try again.');
      console.error('Checkout failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderCartItem = (item: TCartItem) => (
    <View key={item.id} style={styles.cartItem}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        {item.modifiers && Object.entries(item.modifiers).map(([key, value]: [string, any]) => (
          <Text key={key} style={styles.modifierText}>
            + {value.name} {value.price > 0 && `(+$${value.price.toFixed(2)})`}
          </Text>
        ))}
        <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
      </View>
      
      <View style={styles.quantityControl}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => handleQuantityChange(item.id, -1)}
        >
          <Icon name="remove" size={20} color="#FF6B35" />
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => handleQuantityChange(item.id, 1)}
        >
          <Icon name="add" size={20} color="#FF6B35" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Cart</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <View style={styles.emptyContainer}>
          <Icon name="shopping-cart" size={80} color="#CCC" />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>Add some delicious items from the menu!</Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => navigation.navigate('Screen007_MenuCategories' as never)}
          >
            <Text style={styles.browseButtonText}>Browse Menu</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Cart</Text>
        <TouchableOpacity onPress={clearCart}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Restaurant Info */}
        <View style={styles.restaurantInfo}>
          <Text style={styles.restaurantName}>{currentRestaurant?.name}</Text>
          <Text style={styles.tableNumber}>Table {currentSession?.tableNumber}</Text>
        </View>

        {/* Cart Items */}
        <View style={styles.itemsContainer}>
          <Text style={styles.sectionTitle}>Order Items ({cartItems.length})</Text>
          {cartItems.map(renderCartItem)}
        </View>

        {/* Special Instructions */}
        <View style={styles.notesContainer}>
          <Text style={styles.sectionTitle}>Special Instructions</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Add any special requests..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Promo Code */}
        <View style={styles.promoContainer}>
          <Text style={styles.sectionTitle}>Promo Code</Text>
          <View style={styles.promoInputContainer}>
            <TextInput
              style={styles.promoInput}
              placeholder="Enter promo code"
              value={promoCode}
              onChangeText={setPromoCode}
              autoCapitalize="characters"
            />
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApplyPromo}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Price Breakdown */}
        <View style={styles.priceBreakdown}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Subtotal</Text>
            <Text style={styles.priceValue}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Tax (8%)</Text>
            <Text style={styles.priceValue}>${tax.toFixed(2)}</Text>
          </View>
          {discount > 0 && (
            <View style={styles.priceRow}>
              <Text style={[styles.priceLabel, styles.discountLabel]}>Discount</Text>
              <Text style={[styles.priceValue, styles.discountValue]}>
                -${discount.toFixed(2)}
              </Text>
            </View>
          )}
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Payment Methods Preview */}
        <View style={styles.paymentPreview}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>
          <View style={styles.paymentOptions}>
            <View style={styles.paymentOption}>
              <Icon name="credit-card" size={24} color="#666" />
              <Text style={styles.paymentOptionText}>Card</Text>
            </View>
            <View style={styles.paymentOption}>
              <Icon name="account-balance-wallet" size={24} color="#666" />
              <Text style={styles.paymentOptionText}>TON</Text>
            </View>
            <View style={styles.paymentOption}>
              <Icon name="phone-iphone" size={24} color="#666" />
              <Text style={styles.paymentOptionText}>Apple Pay</Text>
            </View>
            <View style={styles.paymentOption}>
              <Icon name="attach-money" size={24} color="#666" />
              <Text style={styles.paymentOptionText}>Cash</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Checkout Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.checkoutButton, isProcessing && styles.disabledButton]}
          onPress={handleCheckout}
          disabled={isProcessing}
        >
          <Text style={styles.checkoutButtonText}>
            {isProcessing ? 'Processing...' : `Proceed to Payment • $${total.toFixed(2)}`}
          </Text>
          <Icon name="arrow-forward" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1A1A1A',
  },
  clearText: {
    fontSize: 14,
    color: '#FF6B35',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1A1A1A',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  browseButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  restaurantInfo: {
    backgroundColor: '#FFF',
    padding: 16,
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  tableNumber: {
    fontSize: 14,
    color: '#666',
  },
  itemsContainer: {
    backgroundColor: '#FFF',
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  modifierText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#FF6B35',
    marginTop: 4,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
  },
  quantityButton: {
    padding: 8,
  },
  quantityText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1A1A1A',
    marginHorizontal: 12,
  },
  notesContainer: {
    backgroundColor: '#FFF',
    padding: 16,
    marginBottom: 8,
  },
  notesInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
    textAlignVertical: 'top',
  },
  promoContainer: {
    backgroundColor: '#FFF',
    padding: 16,
    marginBottom: 8,
  },
  promoInputContainer: {
    flexDirection: 'row',
  },
  promoInput: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    marginRight: 8,
  },
  applyButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 20,
    justifyContent: 'center',
    borderRadius: 8,
  },
  applyButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  priceBreakdown: {
    backgroundColor: '#FFF',
    padding: 16,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceValue: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#333',
  },
  discountLabel: {
    color: '#4CAF50',
  },
  discountValue: {
    color: '#4CAF50',
    fontFamily: 'Inter-SemiBold',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingTop: 8,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1A1A1A',
  },
  totalValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FF6B35',
  },
  paymentPreview: {
    backgroundColor: '#FFF',
    padding: 16,
    marginBottom: 100,
  },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  paymentOption: {
    alignItems: 'center',
  },
  paymentOptionText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  checkoutButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  checkoutButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginRight: 8,
  },
});

export default Screen010_Cart;
