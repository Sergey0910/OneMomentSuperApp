import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useStore } from '../../../packages/state/store';
import { menuAPI } from '../../../packages/api-client/pocketbase';

type TMenuCategory = {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  itemCount?: number;
};

export const Screen007_MenuCategories = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<TMenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const currentRestaurant = useStore((state) => state.currentRestaurant);
  const cartItems = useStore((state) => state.cartItems);
  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      if (!currentRestaurant?.id) {
        throw new Error('No restaurant selected');
      }
      
      const result = await menuAPI.getCategories(currentRestaurant.id);
      
      // Get item counts for each category
      const categoriesWithCounts = await Promise.all(
        result.items.map(async (category) => {
          const items = await menuAPI.getMenuItems(category.id);
          return {
            id: category.id,
            name: category.name,
            description: category.description,
            icon: category.icon,
            itemCount: items.totalItems
          };
        })
      );
      
      setCategories(categoriesWithCounts);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadCategories();
  };

  const handleCategoryPress = (category: TMenuCategory) => {
    navigation.navigate('Screen008_CategoryItems' as never, { 
      categoryId: category.id,
      categoryName: category.name 
    } as never);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigation.navigate('Screen019_SearchResults' as never, { 
        query: searchQuery 
      } as never);
    }
  };

  const handleCartPress = () => {
    navigation.navigate('Screen010_Cart' as never);
  };

  const renderCategory = ({ item }: { item: TMenuCategory }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => handleCategoryPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.categoryContent}>
        <Text style={styles.categoryIcon}>{item.icon || '🍽️'}</Text>
        <View style={styles.categoryInfo}>
          <Text style={styles.categoryName}>{item.name}</Text>
          {item.description && (
            <Text style={styles.categoryDescription}>{item.description}</Text>
          )}
          <Text style={styles.itemCount}>
            {item.itemCount} {item.itemCount === 1 ? 'item' : 'items'}
          </Text>
        </View>
        <Icon name="chevron-right" size={24} color="#CCC" />
      </View>
    </TouchableOpacity>
  );

  const ListHeader = () => (
    <>
      {/* Restaurant Info */}
      <View style={styles.restaurantHeader}>
        <Text style={styles.restaurantName}>{currentRestaurant?.name}</Text>
        <Text style={styles.tableInfo}>
          Table {useStore.getState().currentSession?.tableNumber}
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={24} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search menu..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
      </View>

      {/* Promo Banner */}
      <TouchableOpacity style={styles.promoBanner} activeOpacity={0.9}>
        <View style={styles.promoContent}>
          <Text style={styles.promoTitle}>🎉 Today's Special</Text>
          <Text style={styles.promoDescription}>
            20% off on all pasta dishes!
          </Text>
          <Text style={styles.promoCode}>Use code: PASTA20</Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Menu Categories</Text>
    </>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>Loading menu...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#FF6B35']}
          />
        }
      />

      {/* Cart Badge */}
      {cartItemsCount > 0 && (
        <TouchableOpacity
          style={styles.cartBadge}
          onPress={handleCartPress}
          activeOpacity={0.9}
        >
          <Icon name="shopping-cart" size={24} color="#FFF" />
          <View style={styles.cartInfo}>
            <Text style={styles.cartCount}>{cartItemsCount} items</Text>
            <Text style={styles.cartTotal}>${cartTotal.toFixed(2)}</Text>
          </View>
          <Icon name="arrow-forward" size={20} color="#FFF" />
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
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontFamily: 'Inter-Regular',
  },
  listContent: {
    paddingBottom: 100,
  },
  restaurantHeader: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  restaurantName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  tableInfo: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#333',
  },
  promoBanner: {
    backgroundColor: 'linear-gradient(135deg, #FF6B35 0%, #FF8E53 100%)',
    backgroundColor: '#FF6B35',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  promoContent: {
    alignItems: 'center',
  },
  promoTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  promoDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  promoCode: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1A1A1A',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  categoryIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 4,
  },
  itemCount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
  cartBadge: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  cartInfo: {
    flex: 1,
    marginLeft: 12,
  },
  cartCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  cartTotal: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
});

export default Screen007_MenuCategories;
