/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  // ============= USERS COLLECTION (extended) =============
  const users = new Collection({
    id: "users",
    name: "users",
    type: "auth",
    system: false,
    schema: [
      {
        name: "name",
        type: "text",
        required: true,
        options: { min: 2, max: 100 }
      },
      {
        name: "phone",
        type: "text",
        required: true,
        unique: true,
        options: { 
          pattern: "^\\+[1-9]\\d{1,14}$" // E.164 format
        }
      },
      {
        name: "avatar",
        type: "file",
        required: false,
        options: { 
          maxSelect: 1, 
          maxSize: 5242880,
          mimeTypes: ["image/jpeg", "image/png", "image/webp"]
        }
      },
      {
        name: "language",
        type: "select",
        required: false,
        options: {
          values: ["en", "ru", "es", "fr", "de", "it", "zh", "ja", "ar"],
          maxSelect: 1
        }
      },
      {
        name: "ton_wallet",
        type: "text",
        required: false,
        options: { pattern: "^[a-zA-Z0-9_-]{48}$" }
      }
    ]
  });

  // ============= RESTAURANTS COLLECTION =============
  const restaurants = new Collection({
    id: "restaurants",
    name: "restaurants",
    type: "base",
    system: false,
    schema: [
      {
        name: "name",
        type: "text",
        required: true,
        options: { min: 2, max: 200 }
      },
      {
        name: "description",
        type: "text",
        required: false,
        options: { max: 1000 }
      },
      {
        name: "image",
        type: "file",
        required: false,
        options: { 
          maxSelect: 1,
          maxSize: 10485760,
          mimeTypes: ["image/jpeg", "image/png", "image/webp"]
        }
      },
      {
        name: "location",
        type: "json",
        required: true,
        options: {}
      },
      {
        name: "cuisine_type",
        type: "select",
        required: true,
        options: {
          values: ["italian", "japanese", "chinese", "french", "mexican", "american", "indian", "thai", "mediterranean", "other"],
          maxSelect: 3
        }
      },
      {
        name: "price_range",
        type: "select",
        required: true,
        options: {
          values: ["$", "$$", "$$$", "$$$$"],
          maxSelect: 1
        }
      },
      {
        name: "opening_hours",
        type: "json",
        required: true,
        options: {}
      },
      {
        name: "tables_count",
        type: "number",
        required: true,
        options: { min: 1, max: 500 }
      },
      {
        name: "is_active",
        type: "bool",
        required: false,
        options: {}
      },
      {
        name: "features",
        type: "json",
        required: false,
        options: {}
      }
    ]
  });

  // ============= MENU_CATEGORIES COLLECTION =============
  const menuCategories = new Collection({
    id: "menu_categories",
    name: "menu_categories",
    type: "base",
    system: false,
    schema: [
      {
        name: "restaurant",
        type: "relation",
        required: true,
        options: {
          collectionId: "restaurants",
          maxSelect: 1,
          cascadeDelete: true
        }
      },
      {
        name: "name",
        type: "text",
        required: true,
        options: { min: 2, max: 100 }
      },
      {
        name: "description",
        type: "text",
        required: false,
        options: { max: 500 }
      },
      {
        name: "icon",
        type: "text",
        required: false,
        options: { max: 50 }
      },
      {
        name: "sort_order",
        type: "number",
        required: true,
        options: { min: 0, max: 999 }
      },
      {
        name: "is_active",
        type: "bool",
        required: false,
        options: {}
      }
    ]
  });

  // ============= MENU_ITEMS COLLECTION =============
  const menuItems = new Collection({
    id: "menu_items",
    name: "menu_items",
    type: "base",
    system: false,
    schema: [
      {
        name: "category",
        type: "relation",
        required: true,
        options: {
          collectionId: "menu_categories",
          maxSelect: 1,
          cascadeDelete: true
        }
      },
      {
        name: "name",
        type: "text",
        required: true,
        options: { min: 2, max: 200 }
      },
      {
        name: "description",
        type: "text",
        required: false,
        options: { max: 1000 }
      },
      {
        name: "images",
        type: "file",
        required: false,
        options: { 
          maxSelect: 5,
          maxSize: 5242880,
          mimeTypes: ["image/jpeg", "image/png", "image/webp"]
        }
      },
      {
        name: "price",
        type: "number",
        required: true,
        options: { min: 0, max: 99999 }
      },
      {
        name: "discount_price",
        type: "number",
        required: false,
        options: { min: 0, max: 99999 }
      },
      {
        name: "ingredients",
        type: "json",
        required: false,
        options: {}
      },
      {
        name: "allergens",
        type: "select",
        required: false,
        options: {
          values: ["gluten", "dairy", "eggs", "nuts", "soy", "fish", "shellfish"],
          maxSelect: 7
        }
      },
      {
        name: "calories",
        type: "number",
        required: false,
        options: { min: 0, max: 9999 }
      },
      {
        name: "preparation_time",
        type: "number",
        required: false,
        options: { min: 0, max: 180 }
      },
      {
        name: "is_vegetarian",
        type: "bool",
        required: false,
        options: {}
      },
      {
        name: "is_vegan",
        type: "bool",
        required: false,
        options: {}
      },
      {
        name: "is_spicy",
        type: "bool",
        required: false,
        options: {}
      },
      {
        name: "is_popular",
        type: "bool",
        required: false,
        options: {}
      },
      {
        name: "is_available",
        type: "bool",
        required: false,
        options: {}
      },
      {
        name: "modifiers",
        type: "json",
        required: false,
        options: {}
      },
      {
        name: "sort_order",
        type: "number",
        required: true,
        options: { min: 0, max: 999 }
      }
    ]
  });

  // ============= TABLES COLLECTION =============
  const tables = new Collection({
    id: "tables",
    name: "tables",
    type: "base",
    system: false,
    schema: [
      {
        name: "restaurant",
        type: "relation",
        required: true,
        options: {
          collectionId: "restaurants",
          maxSelect: 1,
          cascadeDelete: true
        }
      },
      {
        name: "number",
        type: "text",
        required: true,
        options: { min: 1, max: 20 }
      },
      {
        name: "qr_code",
        type: "text",
        required: true,
        unique: true,
        options: { min: 10, max: 100 }
      },
      {
        name: "seats",
        type: "number",
        required: true,
        options: { min: 1, max: 20 }
      },
      {
        name: "is_occupied",
        type: "bool",
        required: false,
        options: {}
      },
      {
        name: "current_session",
        type: "text",
        required: false,
        options: {}
      }
    ]
  });

  // ============= ORDERS COLLECTION =============
  const orders = new Collection({
    id: "orders",
    name: "orders",
    type: "base",
    system: false,
    schema: [
      {
        name: "user",
        type: "relation",
        required: true,
        options: {
          collectionId: "users",
          maxSelect: 1
        }
      },
      {
        name: "restaurant",
        type: "relation",
        required: true,
        options: {
          collectionId: "restaurants",
          maxSelect: 1
        }
      },
      {
        name: "table",
        type: "relation",
        required: false,
        options: {
          collectionId: "tables",
          maxSelect: 1
        }
      },
      {
        name: "order_number",
        type: "text",
        required: true,
        unique: true,
        options: { min: 6, max: 20 }
      },
      {
        name: "items",
        type: "json",
        required: true,
        options: {}
      },
      {
        name: "status",
        type: "select",
        required: true,
        options: {
          values: ["pending", "confirmed", "preparing", "ready", "delivered", "completed", "cancelled"],
          maxSelect: 1
        }
      },
      {
        name: "type",
        type: "select",
        required: true,
        options: {
          values: ["dine_in", "takeaway", "delivery"],
          maxSelect: 1
        }
      },
      {
        name: "subtotal",
        type: "number",
        required: true,
        options: { min: 0, max: 999999 }
      },
      {
        name: "tax",
        type: "number",
        required: true,
        options: { min: 0, max: 99999 }
      },
      {
        name: "tip",
        type: "number",
        required: false,
        options: { min: 0, max: 99999 }
      },
      {
        name: "total",
        type: "number",
        required: true,
        options: { min: 0, max: 999999 }
      },
      {
        name: "payment_method",
        type: "select",
        required: false,
        options: {
          values: ["card", "cash", "ton", "apple_pay", "google_pay"],
          maxSelect: 1
        }
      },
      {
        name: "payment_status",
        type: "select",
        required: true,
        options: {
          values: ["pending", "processing", "paid", "failed", "refunded"],
          maxSelect: 1
        }
      },
      {
        name: "notes",
        type: "text",
        required: false,
        options: { max: 500 }
      },
      {
        name: "estimated_time",
        type: "number",
        required: false,
        options: { min: 0, max: 180 }
      }
    ]
  });

  // Create all collections
  return [
    db.save(users),
    db.save(restaurants),
    db.save(menuCategories),
    db.save(menuItems),
    db.save(tables),
    db.save(orders)
  ];
}, (db) => {
  // Rollback
  const collections = ['orders', 'tables', 'menu_items', 'menu_categories', 'restaurants', 'users'];
  collections.forEach(name => {
    const collection = db.findCollectionByNameOrId(name);
    if (collection) {
      db.delete(collection);
    }
  });
});
