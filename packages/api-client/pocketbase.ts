import PocketBase from 'pocketbase';
import AsyncStorage from '@react-native-async-storage/async-storage';

// PocketBase instance
export const pb = new PocketBase('http://localhost:8090');

// Auto-refresh auth
pb.authStore.onChange((token, model) => {
  if (token) {
    AsyncStorage.setItem('pb_auth', JSON.stringify({ token, model }));
  } else {
    AsyncStorage.removeItem('pb_auth');
  }
});

// Load saved auth on startup
export const initAuth = async () => {
  try {
    const saved = await AsyncStorage.getItem('pb_auth');
    if (saved) {
      const { token, model } = JSON.parse(saved);
      pb.authStore.save(token, model);
    }
  } catch (error) {
    console.error('Failed to load auth:', error);
  }
};

// ============= AUTH API =============
export const authAPI = {
  // Send OTP
  sendOTP: async (phone: string) => {
    try {
      // In production, this would trigger SMS
      // For now, we'll use a mock OTP: 123456
      const mockOTP = '123456';
      await AsyncStorage.setItem('temp_otp', mockOTP);
      await AsyncStorage.setItem('temp_phone', phone);
      
      return { success: true, message: 'OTP sent' };
    } catch (error) {
      throw new Error('Failed to send OTP');
    }
  },

  // Verify OTP and create/login user
  verifyOTP: async (phone: string, otp: string) => {
    try {
      // Mock verification
      const savedOTP = await AsyncStorage.getItem('temp_otp');
      if (otp !== savedOTP) {
        throw new Error('Invalid OTP');
      }

      // Check if user exists or create new
      try {
        const users = await pb.collection('users').getList(1, 1, {
          filter: `phone = "${phone}"`
        });

        if (users.items.length > 0) {
          // Login existing user
          const user = users.items[0];
          pb.authStore.save('mock-token', user);
          return user;
        }
      } catch (e) {
        // User doesn't exist, create new
      }

      // Create new user
      const userData = {
        phone,
        name: `User ${phone.slice(-4)}`,
        username: phone.replace('+', ''),
        email: `${phone.replace('+', '')}@onemoment.app`,
        password: `${phone}${otp}`, // Temporary password
        passwordConfirm: `${phone}${otp}`,
        emailVisibility: false
      };

      const user = await pb.collection('users').create(userData);
      pb.authStore.save('mock-token', user);
      
      return user;
    } catch (error) {
      throw new Error('Failed to verify OTP');
    }
  },

  // Logout
  logout: () => {
    pb.authStore.clear();
    AsyncStorage.removeItem('pb_auth');
  },

  // Get current user
  getCurrentUser: () => pb.authStore.model,

  // Check if authenticated
  isAuthenticated: () => pb.authStore.isValid
};

// ============= RESTAURANT API =============
export const restaurantAPI = {
  // Get all restaurants
  getRestaurants: async () => {
    return await pb.collection('restaurants').getList(1, 50, {
      filter: 'is_active = true'
    });
  },

  // Get restaurant by ID
  getRestaurant: async (id: string) => {
    return await pb.collection('restaurants').getOne(id);
  },

  // Verify table QR code
  verifyTable: async (qrCode: string) => {
    const tables = await pb.collection('tables').getList(1, 1, {
      filter: `qr_code = "${qrCode}"`,
      expand: 'restaurant'
    });

    if (tables.items.length === 0) {
      throw new Error('Invalid QR code');
    }

    const table = tables.items[0];
    
    // Create session for the table
    const sessionId = `session_${Date.now()}`;
    await pb.collection('tables').update(table.id, {
      is_occupied: true,
      current_session: sessionId
    });

    return {
      table,
      restaurant: table.expand?.restaurant,
      sessionId
    };
  }
};

// ============= MENU API =============
export const menuAPI = {
  // Get menu categories for restaurant
  getCategories: async (restaurantId: string) => {
    return await pb.collection('menu_categories').getList(1, 50, {
      filter: `restaurant = "${restaurantId}" && is_active = true`,
      sort: 'sort_order'
    });
  },

  // Get menu items for category
  getMenuItems: async (categoryId: string) => {
    return await pb.collection('menu_items').getList(1, 100, {
      filter: `category = "${categoryId}" && is_available = true`,
      sort: 'sort_order'
    });
  },

  // Get single menu item
  getMenuItem: async (id: string) => {
    return await pb.collection('menu_items').getOne(id);
  },

  // Search menu items
  searchMenuItems: async (restaurantId: string, query: string) => {
    const categories = await pb.collection('menu_categories').getList(1, 50, {
      filter: `restaurant = "${restaurantId}"`
    });
    
    const categoryIds = categories.items.map(c => c.id);
    
    return await pb.collection('menu_items').getList(1, 100, {
      filter: `category ?~ "${categoryIds.join('||')}" && name ~ "${query}"`
    });
  }
};

// ============= ORDER API =============
export const orderAPI = {
  // Create new order
  createOrder: async (orderData: any) => {
    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;
    
    const order = await pb.collection('orders').create({
      ...orderData,
      order_number: orderNumber,
      status: 'pending',
      payment_status: 'pending',
      user: pb.authStore.model?.id
    });

    // Subscribe to order updates
    pb.collection('orders').subscribe(order.id, (e) => {
      console.log('Order updated:', e.record);
      // Handle real-time updates
    });

    return order;
  },

  // Get user's orders
  getMyOrders: async () => {
    const userId = pb.authStore.model?.id;
    if (!userId) throw new Error('Not authenticated');

    return await pb.collection('orders').getList(1, 50, {
      filter: `user = "${userId}"`,
      sort: '-created',
      expand: 'restaurant,table'
    });
  },

  // Get order by ID
  getOrder: async (id: string) => {
    return await pb.collection('orders').getOne(id, {
      expand: 'restaurant,table,user'
    });
  },

  // Update order (for staff)
  updateOrder: async (id: string, data: any) => {
    return await pb.collection('orders').update(id, data);
  }
};

// ============= REAL-TIME SUBSCRIPTIONS =============
export const subscriptions = {
  // Subscribe to order updates
  subscribeToOrder: (orderId: string, callback: (data: any) => void) => {
    return pb.collection('orders').subscribe(orderId, callback);
  },

  // Subscribe to table updates
  subscribeToTable: (tableId: string, callback: (data: any) => void) => {
    return pb.collection('tables').subscribe(tableId, callback);
  },

  // Unsubscribe
  unsubscribe: (subscription: any) => {
    pb.collection('orders').unsubscribe(subscription);
  }
};

// ============= PAYMENT API =============
export const paymentAPI = {
  // Process payment
  processPayment: async (orderId: string, method: string, details?: any) => {
    // In production, integrate with payment gateway
    // For now, mock payment success
    
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing
    
    return await pb.collection('orders').update(orderId, {
      payment_status: 'paid',
      payment_method: method,
      status: 'confirmed'
    });
  }
};

// Initialize on app start
initAuth();

export default pb;
