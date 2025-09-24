import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useStore } from '../../../packages/state/store';
import { menuAPI } from '../../../packages/api-client/pocketbase';

const { width } = Dimensions.get('window');

type TMenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  discount_price?: number;
  images?: string[];
  ingredients?: string[];
  allergens?: string[];
  calories?: number;
  preparation_time?: number;
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  is_spicy?: boolean;
  modifiers?: any;
};

type TModifier = {
  name: string;
  options: { name: string; price: number }[];
  required?: boolean;
  maxSelect?: number;
};

export const Screen009_ItemDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { itemId } = route.params as { itemId: string };
  
  const [item, setItem] = useState<TMenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedModifiers, setSelectedModifiers] = useState<Record<string, any>>({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const addToCart = useStore((state) => state.addToCart);

  useEffect(() => {
    loadItemDetails();
  }, [itemId]);

  const loadItemDetails = async () => {
    try {
      setLoading(true);
      const itemData = await menuAPI.getMenuItem(itemId);
      setItem(itemData);
    } catch (error) {
      console.error('Failed to load item details:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = () => {
    if (!item) return 0;
    
    const basePrice = item.discount_price || item.price;
    let modifierPrice = 0;
    
    Object.values(selectedModifiers).forEach((modifier: any) => {
      if (typeof modifier === 'object' && modifier.price) {
        modifierPrice += modifier.price;
      }
    });
    
    return (basePrice + modifierPrice) * quantity;
  };

  const handleAddToCart = () => {
    if (!item) return;
    
    addToCart({
      id: item.id,
      name: item.name,
      price: item.discount_price || item.price,
      quantity: quantity,
      modifiers: selectedModifiers,
    });
    
    navigation.goBack();
  };

  const toggleModifier = (groupName: string, option: any) => {
    setSelectedModifiers(prev => ({
      ...prev,
      [groupName]: prev[groupName]?.name === option.name ? null : option
    }));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>Loading details...</Text>
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Item not found</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.goBackText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View style={styles.imageContainer}>
          {item.images && item.images.length > 0 ? (
            <>
              <Image
                source={{ uri: `http://localhost:8090/api/files/menu_items/${item.images[currentImageIndex]}` }}
                style={styles.image}
                resizeMode="cover"
              />
              {item.images.length > 1 && (
                <View style={styles.imageDots}>
                  {item.images.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.dot,
                        index === currentImageIndex && styles.activeDot
                      ]}
                    />
                  ))}
                </View>
              )}
            </>
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]}>
              <Icon name="restaurant-menu" size={60} color="#CCC" />
            </View>
          )}
          
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Item Info */}
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.itemName}>{item.name}</Text>
            <View style={styles.priceContainer}>
              {item.discount_price ? (
                <>
                  <Text style={styles.originalPrice}>${item.price.toFixed(2)}</Text>
                  <Text style={styles.price}>${item.discount_price.toFixed(2)}</Text>
                </>
              ) : (
                <Text style={styles.price}>${item.price.toFixed(2)}</Text>
              )}
            </View>
          </View>

          {/* Tags */}
          <View style={styles.tags}>
            {item.is_vegetarian && (
              <View style={[styles.tag, styles.vegTag]}>
                <Text style={styles.tagText}>🌱 Vegetarian</Text>
              </View>
            )}
            {item.is_vegan && (
              <View style={[styles.tag, styles.veganTag]}>
                <Text style={styles.tagText}>🥬 Vegan</Text>
              </View>
            )}
            {item.is_spicy && (
              <View style={[styles.tag, styles.spicyTag]}>
                <Text style={styles.tagText}>🌶️ Spicy</Text>
              </View>
            )}
          </View>

          {/* Description */}
          <Text style={styles.description}>{item.description}</Text>

          {/* Info Grid */}
          <View style={styles.infoGrid}>
            {item.calories && (
              <View style={styles.infoItem}>
                <Icon name="local-fire-department" size={20} color="#666" />
                <Text style={styles.infoText}>{item.calories} cal</Text>
              </View>
            )}
            {item.preparation_time && (
              <View style={styles.infoItem}>
                <Icon name="schedule" size={20} color="#666" />
                <Text style={styles.infoText}>{item.preparation_time} min</Text>
              </View>
            )}
          </View>

          {/* Ingredients */}
          {item.ingredients && item.ingredients.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ingredients</Text>
              <Text style={styles.ingredientsText}>
                {item.ingredients.join(', ')}
              </Text>
            </View>
          )}

          {/* Allergens */}
          {item.allergens && item.allergens.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Allergen Information</Text>
              <View style={styles.allergenTags}>
                {item.allergens.map((allergen, index) => (
                  <View key={index} style={styles.allergenTag}>
                    <Text style={styles.allergenText}>{allergen}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Modifiers */}
          {item.modifiers && Object.keys(item.modifiers).length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Customize Your Order</Text>
              {Object.entries(item.modifiers).map(([groupName, options]: [string, any]) => (
                <View key={groupName} style={styles.modifierGroup}>
                  <Text style={styles.modifierGroupName}>{groupName}</Text>
                  {options.map((option: any, index: number) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.modifierOption}
                      onPress={() => toggleModifier(groupName, option)}
                    >
                      <View style={styles.modifierCheckbox}>
                        {selectedModifiers[groupName]?.name === option.name && (
                          <Icon name="check" size={16} color="#FF6B35" />
                        )}
                      </View>
                      <Text style={styles.modifierName}>{option.name}</Text>
                      {option.price > 0 && (
                        <Text style={styles.modifierPrice}>+${option.price.toFixed(2)}</Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>
          )}

          {/* Quantity Selector */}
          <View style={styles.quantitySection}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.quantitySelector}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Icon name="remove" size={24} color="#FF6B35" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Icon name="add" size={24} color="#FF6B35" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Add to Cart Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddToCart}
        >
          <Icon name="shopping-cart" size={24} color="#FFF" />
          <Text style={styles.addToCartText}>
            Add to Cart - ${calculatePrice().toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  goBackText: {
    fontSize: 16,
    color: '#FF6B35',
  },
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  image: {
    width: width,
    height: 300,
  },
  imagePlaceholder: {
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageDots: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#FFF',
    width: 24,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itemName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1A1A1A',
    flex: 1,
    marginRight: 12,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#FF6B35',
  },
  originalPrice: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
    marginBottom: 4,
  },
  tags: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  vegTag: {
    backgroundColor: '#E8F5E9',
  },
  veganTag: {
    backgroundColor: '#C8E6C9',
  },
  spicyTag: {
    backgroundColor: '#FFEBEE',
  },
  tagText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#666',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#666',
    marginBottom: 20,
  },
  infoGrid: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  infoText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  ingredientsText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
  },
  allergenTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  allergenTag: {
    backgroundColor: '#FFE5DC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  allergenText: {
    fontSize: 12,
    color: '#D84315',
    fontFamily: 'Inter-Medium',
  },
  modifierGroup: {
    marginBottom: 16,
  },
  modifierGroupName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
    marginBottom: 8,
  },
  modifierOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  modifierCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#DDD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modifierName: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  modifierPrice: {
    fontSize: 14,
    color: '#FF6B35',
    fontFamily: 'Inter-Medium',
  },
  quantitySection: {
    marginBottom: 24,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    alignSelf: 'flex-start',
    padding: 4,
  },
  quantityButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1A1A1A',
    marginHorizontal: 20,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  addToCartButton: {
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
  addToCartText: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
});

export default Screen009_ItemDetail;
