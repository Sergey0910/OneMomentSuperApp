#!/bin/bash

echo "🚀 Starting Mock Backend (No Docker Required)"
echo ""

# Create simple Node.js server
cat > mock-server.js << 'EOF'
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8090;

app.use(cors());
app.use(express.json());

// Mock data
const mockData = {
  restaurants: [{
    id: '1',
    name: 'La Bella Italia',
    description: 'Authentic Italian cuisine',
    tables: 10
  }],
  
  menuCategories: [
    { id: '1', name: 'Starters', icon: '🥗' },
    { id: '2', name: 'Pizza', icon: '🍕' },
    { id: '3', name: 'Pasta', icon: '🍝' },
    { id: '4', name: 'Desserts', icon: '🍰' }
  ],
  
  menuItems: [
    { id: '1', categoryId: '2', name: 'Margherita', price: 16.99, description: 'Classic pizza' },
    { id: '2', categoryId: '2', name: 'Pepperoni', price: 18.99, description: 'With pepperoni' },
    { id: '3', categoryId: '3', name: 'Carbonara', price: 15.99, description: 'Creamy pasta' },
    { id: '4', categoryId: '4', name: 'Tiramisu', price: 7.99, description: 'Italian dessert' }
  ]
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/v1/auth/send-otp', (req, res) => {
  console.log('📱 OTP sent to:', req.body.phone);
  res.json({ success: true, message: 'OTP sent (use 123456)' });
});

app.post('/api/v1/auth/verify-otp', (req, res) => {
  if (req.body.otp === '123456') {
    res.json({ 
      success: true, 
      token: 'mock-jwt-token',
      user: { id: '1', phone: req.body.phone }
    });
  } else {
    res.status(400).json({ success: false, message: 'Invalid OTP' });
  }
});

app.post('/api/v1/tables/verify', (req, res) => {
  if (req.body.qrCode === 'QR_TABLE_1') {
    res.json({
      success: true,
      table: { id: '1', number: '1' },
      restaurant: mockData.restaurants[0]
    });
  } else {
    res.status(400).json({ success: false, message: 'Invalid QR code' });
  }
});

app.get('/api/v1/menu/categories', (req, res) => {
  res.json(mockData.menuCategories);
});

app.get('/api/v1/menu/items', (req, res) => {
  const categoryId = req.query.category;
  const items = categoryId 
    ? mockData.menuItems.filter(i => i.categoryId === categoryId)
    : mockData.menuItems;
  res.json(items);
});

app.listen(PORT, () => {
  console.log(`✅ Mock backend running on http://localhost:${PORT}`);
  console.log('');
  console.log('📝 Test endpoints:');
  console.log(`   GET  http://localhost:${PORT}/api/health`);
  console.log(`   POST http://localhost:${PORT}/api/v1/auth/send-otp`);
  console.log(`   POST http://localhost:${PORT}/api/v1/auth/verify-otp`);
  console.log('');
  console.log('Press Ctrl+C to stop');
});
EOF

# Install dependencies
echo "📦 Installing mock server dependencies..."
npm install express cors --save-dev --legacy-peer-deps

# Start server
echo ""
echo "🚀 Starting mock server..."
node mock-server.js
