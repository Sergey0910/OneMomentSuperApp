# OneMomentSuperApp - Codex Agent Configuration

## Project Overview
Super-app for travelers with 81 screens total. Module Federation architecture for optimal performance.
- **Tech Stack:** React Native 0.72, TypeScript, Zustand, PocketBase
- **Current Progress:** 10/13 MVP screens completed
- **Repository:** /Users/whysophie/Desktop/OneMomentSuperApp

## Architecture Guidelines
```
/apps
  /guest-app      # Main app (51 screens)
    /screens      # All screen components
  /waiter-app     # Staff app (7 screens)
  /kitchen-app    # Kitchen display (5 screens)
/packages
  /api-client     # PocketBase integration
  /state          # Zustand stores
  /shared-ui      # Reusable components
```

## Code Standards
- **TypeScript:** Strict mode with 19 flags enabled
- **Functions:** Maximum 60 lines per function
- **Testing:** Minimum 85% coverage required
- **Components:** .tsx files with corresponding .test.tsx
- **State:** Zustand only, NO localStorage/sessionStorage
- **Styling:** Inline styles or StyleSheet.create()
- **Navigation:** React Navigation v6

## Current Priority Tasks

### 1. Payment Flow (Screens 011-013)
- **Screen 011:** Payment Method Selection
  - Card, TON wallet, Apple/Google Pay, Cash options
  - Saved cards display
  - Integration with payment gateways
  
- **Screen 012:** Payment Processing
  - Card input form with validation
  - TON Connect integration
  - 3D Secure frame
  - Loading states and error handling
  
- **Screen 013:** Order Success
  - Success animation (Lottie)
  - Order number display
  - Estimated time
  - Track order button

### 2. API Endpoints
```typescript
// Payment endpoints
POST /api/v1/payments/process
POST /api/v1/payments/validate
GET  /api/v1/payments/methods
POST /api/v1/orders/confirm

// Order tracking
GET  /api/v1/orders/{orderId}/status
POST /api/v1/orders/{orderId}/track
```

### 3. State Management (Zustand)
```typescript
// Payment store structure
interface PaymentStore {
  selectedMethod: PaymentMethod;
  savedCards: Card[];
  processing: boolean;
  setPaymentMethod: (method: PaymentMethod) => void;
  processPayment: (orderId: string) => Promise<void>;
}
```

## Test Data
- Phone: +1234567890
- OTP: 123456  
- QR Code: QR_TABLE_1
- Test Card: 4242 4242 4242 4242
- TON Wallet: Mock connection

## Module Dependencies
- react-native-payments (Stripe/Apple Pay)
- @tonconnect/sdk (TON blockchain)
- react-native-lottie (Animations)
- react-native-credit-card-input

## Performance Requirements
- Screen load: <300ms
- Payment processing: <3s
- Animation: 60 FPS
- Bundle size per screen: <500KB

## Error Handling
- Network failures: Retry with exponential backoff
- Payment failures: Clear error messages
- Validation: Real-time field validation
- Fallbacks: Offline mode support

## Security Requirements
- PCI DSS compliance for card handling
- No storing of card numbers locally
- Secure token transmission
- SSL/TLS for all API calls

## Testing Checklist
- [ ] Unit tests for all functions
- [ ] Integration tests for API calls
- [ ] E2E tests for payment flow
- [ ] Performance benchmarks
- [ ] Security audit

## Notes for Codex
- Follow existing patterns from screens 001-010
- Use TypeScript interfaces from /packages/types
- Import shared components from /packages/shared-ui
- All async operations must have loading states
- Error boundaries on every screen
