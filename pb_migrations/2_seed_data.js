/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  // Sample Restaurant
  const restaurant = db.save(new Record(db.findCollectionByNameOrId("restaurants"), {
    name: "La Bella Italia",
    description: "Authentic Italian cuisine in the heart of the city",
    cuisine_type: ["italian", "mediterranean"],
    price_range: "$$",
    location: {
      lat: 40.7128,
      lng: -74.0060,
      address: "123 Main St, New York, NY 10001",
      city: "New York",
      country: "USA"
    },
    opening_hours: {
      monday: { open: "11:00", close: "22:00" },
      tuesday: { open: "11:00", close: "22:00" },
      wednesday: { open: "11:00", close: "22:00" },
      thursday: { open: "11:00", close: "23:00" },
      friday: { open: "11:00", close: "23:00" },
      saturday: { open: "12:00", close: "23:00" },
      sunday: { open: "12:00", close: "21:00" }
    },
    tables_count: 20,
    is_active: true,
    features: {
      wifi: true,
      parking: true,
      outdoor_seating: true,
      delivery: true,
      takeaway: true,
      reservations: true
    }
  }));

  // Categories
  const categories = [
    { name: "Starters", icon: "🥗", sort_order: 1 },
    { name: "Pizza", icon: "🍕", sort_order: 2 },
    { name: "Pasta", icon: "🍝", sort_order: 3 },
    { name: "Main Courses", icon: "🍖", sort_order: 4 },
    { name: "Desserts", icon: "🍰", sort_order: 5 },
    { name: "Beverages", icon: "🥤", sort_order: 6 }
  ];

  const savedCategories = {};
  categories.forEach(cat => {
    const category = db.save(new Record(db.findCollectionByNameOrId("menu_categories"), {
      restaurant: restaurant.id,
      name: cat.name,
      icon: cat.icon,
      sort_order: cat.sort_order,
      is_active: true
    }));
    savedCategories[cat.name] = category.id;
  });

  // Sample Menu Items
  const menuItems = [
    // Starters
    {
      category: savedCategories["Starters"],
      name: "Bruschetta",
      description: "Toasted bread with fresh tomatoes, basil, and garlic",
      price: 8.99,
      calories: 180,
      preparation_time: 10,
      is_vegetarian: true,
      is_vegan: true,
      is_available: true,
      sort_order: 1
    },
    {
      category: savedCategories["Starters"],
      name: "Caesar Salad",
      description: "Crisp romaine lettuce, parmesan, croutons, Caesar dressing",
      price: 12.99,
      calories: 350,
      preparation_time: 10,
      is_vegetarian: false,
      is_available: true,
      sort_order: 2
    },
    // Pizza
    {
      category: savedCategories["Pizza"],
      name: "Margherita",
      description: "San Marzano tomatoes, fresh mozzarella, basil",
      price: 16.99,
      calories: 800,
      preparation_time: 20,
      is_vegetarian: true,
      is_popular: true,
      is_available: true,
      sort_order: 1,
      modifiers: {
        size: [
          { name: "Small (10\")", price: 0 },
          { name: "Medium (14\")", price: 3 },
          { name: "Large (18\")", price: 6 }
        ],
        extra_toppings: [
          { name: "Extra Cheese", price: 2 },
          { name: "Mushrooms", price: 1.5 },
          { name: "Pepperoni", price: 2.5 }
        ]
      }
    },
    {
      category: savedCategories["Pizza"],
      name: "Pepperoni",
      description: "Tomato sauce, mozzarella, pepperoni",
      price: 18.99,
      calories: 950,
      preparation_time: 20,
      is_popular: true,
      is_available: true,
      sort_order: 2
    },
    // Pasta
    {
      category: savedCategories["Pasta"],
      name: "Spaghetti Carbonara",
      description: "Eggs, pancetta, pecorino romano, black pepper",
      price: 15.99,
      calories: 650,
      preparation_time: 15,
      is_available: true,
      sort_order: 1
    },
    {
      category: savedCategories["Pasta"],
      name: "Penne Arrabbiata",
      description: "Spicy tomato sauce with garlic and red chili",
      price: 13.99,
      calories: 520,
      preparation_time: 15,
      is_vegetarian: true,
      is_vegan: true,
      is_spicy: true,
      is_available: true,
      sort_order: 2
    },
    // Desserts
    {
      category: savedCategories["Desserts"],
      name: "Tiramisu",
      description: "Classic Italian dessert with coffee-soaked ladyfingers",
      price: 7.99,
      calories: 450,
      preparation_time: 5,
      is_vegetarian: true,
      is_popular: true,
      is_available: true,
      sort_order: 1
    },
    // Beverages
    {
      category: savedCategories["Beverages"],
      name: "Coca Cola",
      description: "330ml can",
      price: 3.99,
      calories: 140,
      preparation_time: 0,
      is_available: true,
      sort_order: 1
    },
    {
      category: savedCategories["Beverages"],
      name: "Fresh Orange Juice",
      description: "Freshly squeezed orange juice",
      price: 5.99,
      calories: 110,
      preparation_time: 5,
      is_vegetarian: true,
      is_vegan: true,
      is_available: true,
      sort_order: 2
    }
  ];

  menuItems.forEach(item => {
    db.save(new Record(db.findCollectionByNameOrId("menu_items"), item));
  });

  // Create Tables with QR codes
  for (let i = 1; i <= 10; i++) {
    db.save(new Record(db.findCollectionByNameOrId("tables"), {
      restaurant: restaurant.id,
      number: i.toString(),
      qr_code: `QR_TABLE_${restaurant.id}_${i}`,
      seats: i <= 4 ? 2 : i <= 8 ? 4 : 6,
      is_occupied: false
    }));
  }

  return true;
}, (db) => {
  // Rollback - data will be deleted with collections
});
