import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useStore } from '../../../packages/state/store';
import { menuAPI } from '../../../packages/api-client/pocketbase';

type TMenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  discount_price?: number;
  images?: string[];
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  is_spicy?: boolean;
  is_popular?: boolean;
  calories?: number;
  preparation_time?: number;
};

export const Screen008_CategoryItems = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { categoryId, categoryName } = route.params as { categoryId: string; categoryName: string };
  
  const [items, setItems] = useState<TMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'popular' | 'price' | 'name'>('popular');
  const [filterVeg, setFilterVeg] = useState(false);
  
  const cartItems = useStore((state) => state.cartItems);
  const addToCart = useStore((state) => state.addToCart);

  useEffect(() => {
    loadMenuItems();
  }, [categoryId, sortBy, filterVeg]);

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      const result = await menuAPI.getMenuItems(categoryId);
      
      let filteredItems = result.items;
      
      // Apply filter
      if (filterVeg) {
        filteredItems = filteredItems.filter(item => item.is_vegetarian || item.is_vegan);
      }
      
      // Apply sort
      switch (sortBy) {
        case 'popular':
          filteredItems.sort((a, b) => (b.is_popular ? 1 : 0) - (a.is_popular ? 1 : 0));
          break;
        case 'price':
          filteredItems.sort((a, b) => a.price - b.price);
          break;
        case 'name':
          filteredItems.sort((a, b) => a.name.localeCompare(b.name));
          break;
      }
      
      setItems(filteredItems);
    } catch (error) {
      console.error('Failed to load menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemPress = (item: TMenuItem) => {
    navigation.navigate('Screen009_ItemDetail' as never, { 
      itemId: item.id 
    } as never);
  };

  const handleQuickAdd = (item: TMenuItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.discount_price || item.price,
      quantity: 1,
      modifiers: {}
    });
    // Show toast or feedback
  };

  const getItemInCart = (itemId: string) => {
    const item = cartItems.find(i => i.id === itemId);
    return item?.quantity || 0;
  };

  const renderItem = ({ item }: { item: TMenuItem }) => {
    const inCartQty = getItemInCart(item.id);
    const hasDiscount = item.discount_price && item.discount_price < item.price;
    
    return (
      <TouchableOpacity
        style={styles.itemCard}
        onPress={() => handleItemPress(item)}
        activeOpacity={0.8}
      >
        <View style={styles.itemContent}>
          {/* Image */}
          {item.images && item.images.length > 0 ? (
            <Image
              source={{ uri: `http://localhost:8090/api/files/menu_items/${item.images[0]}` }}
              style={styles.itemImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.itemImage, styles.imagePlaceholder]}>
              <Icon name="restaurant-menu" size={30} color="#CCC" />
            </View>
          )}
          
          {/* Info */}
          <View style={styles.itemInfo}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemName}>{item.name}</Text>
              {item.is_popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>Popular</Text>
                </View>
              )}
            </View>
            
            <Text style={styles.itemDescription} numberOfLines={2}>
              {item.description}
            </Text>
            
            {/* Tags */}
            <View style={styles.tags}>
              {item.is_vegetarian && (
                <View style={[styles.tag, styles.vegTag]}>
                  <Text style={styles.tagText}>🌱 Veg</Text>
                </View>
              )}
              {item.is_spicy && (
                <View style={[styles.tag, styles.spicyTag]}>
                  <Text style={styles.tagText}>🌶️ Spicy</Text>
                </View>
              )}
              {item.preparation_time && (
                <View style={styles.tag}>
                  <Text style={styles.tagText}>⏱️ {item.preparation_time}min</Text>
                </View>
              )}
            </View>
            
            {/* Price and Add Button */}
            <View style={styles.priceRow}>
              <View style={styles.priceContainer}>
                {hasDiscount ? (
                  <>
                    <Text style={styles.originalPrice}>${item.price.toFixed(2)}</Text>
                    <Text style={styles.discountPrice}>${item.discount_price!.toFixed(2)}</Text>
                  </>
                ) : (
                  <Text style={styles.price}>${item.price.toFixed(2)}</Text>
                )}
              </View>
              
              {inCartQty > 0 ? (
                <View style={styles.quantityControl}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => addToCart({ ...item, quantity: -1 })}
                  >
                    <Icon name="remove" size={20} color="#FF6B35" />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{inCartQty}</Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleQuickAdd(item)}
                  >
                    <Icon name="add" size={20} color="#FF6B35" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => handleQuickAdd(item)}
                >
                  <Icon name="add" size={20} color="#FFF" />
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const ListHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>
      
      <Text style={styles.categoryTitle}>{categoryName}</Text>
      
      {/* Filters */}
      <View style={styles.filters}>
        <TouchableOpacity
          style={[styles.filterChip, filterVeg && styles.filterChipActive]}
          onPress={() => setFilterVeg(!filterVeg)}
        >
          <Text style={[styles.filterText, filterVeg && styles.filterTextActive]}>
            🌱 Veg Only
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => {
            const options = ['popular', 'price', 'name'];
            const current = options.indexOf(sortBy);
            setSortBy(options[(current + 1) % 3] as any);
          }}
        >
          <Icon name="sort" size={20} color="#666" />
          <Text style={styles.sortText}>Sort: {sortBy}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>Loading items...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      
      {/* Cart Button */}
      {cartItems.length > 0 && (
        <TouchableOpacity
          style={styles.viewCartButton}
          onPress={() => navigation.navigate('Screen010_Cart' as never)}
        >
          <Icon name="shopping-cart" size={24} color="#FFF" />
          <Text style={styles.viewCartText}>
            View Cart ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
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
  header: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  filters: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  filterChip: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#FF6B35',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  filterTextActive: {
    color: '#FFF',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
  },
  sortText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  listContent: {
    paddingBottom: 100,
  },
  itemCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  itemContent: {
    flexDirection: 'row',
    padding: 12,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
  },
  imagePlaceholder: {
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1A1A1A',
    flex: 1,
  },
  popularBadge: {
    backgroundColor: '#FFE5DC',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  popularText: {
    fontSize: 10,
    color: '#FF6B35',
    fontFamily: 'Inter-SemiBold',
  },
  itemDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
  tags: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tag: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
  },
  vegTag: {
    backgroundColor: '#E8F5E9',
  },
  spicyTag: {
    backgroundColor: '#FFEBEE',
  },
  tagText: {
    fontSize: 11,
    color: '#666',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1A1A1A',
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  discountPrice: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FF6B35',
  },
  addButton: {
    backgroundColor: '#FF6B35',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 4,
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
  viewCartButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  viewCartText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
});

export default Screen008_CategoryItems;
