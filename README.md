# 🚀 OneMomentSuperApp

> Revolutionary travel super app with 81 screens for seamless travel experience

[![React Native](https://img.shields.io/badge/React%20Native-0.72-blue)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Module Federation](https://img.shields.io/badge/Module%20Federation-Ready-green)](https://module-federation.github.io/)
[![TON Blockchain](https://img.shields.io/badge/TON-Payments-blue)](https://ton.org/)

## 📱 Features

### 🍽️ Restaurant Module (28 screens)
- QR code table ordering
- Real-time order tracking
- TON blockchain payments
- Multi-language menus

### 🏨 Hotel Module (10 screens)
- Smart booking system
- Digital check-in/out
- Digital room keys
- Room service integration

### 🌍 Translator Module (5 screens)
- Voice translation
- Camera text recognition
- Conversation mode
- Offline phrasebook

### 📶 eSIM Module (5 screens)
- Instant eSIM purchase
- Global coverage
- TON payments
- Auto-activation

## 🏗️ Architecture

```
OneMomentSuperApp/
├── apps/
│   ├── guest-app/      # Main app (51 screens)
│   ├── waiter-app/     # Waiter interface (7 screens)
│   ├── kitchen-app/    # Kitchen display (5 screens)
│   └── admin-app/      # Admin panel (8 screens)
├── backend/
│   ├── pocketbase/     # Database
│   ├── graphql/        # API Federation
│   └── websocket/      # Real-time
└── modules/
    ├── restaurant/
    ├── hotel/
    ├── translator/
    └── esim/
```

## ⚡ Tech Stack

- **Frontend:** React Native + TypeScript
- **State:** MobX-State-Tree
- **Offline:** WatermelonDB
- **Backend:** PocketBase + GraphQL
- **Payments:** TON Blockchain + Stripe
- **Module Federation:** Re.Pack v5
- **Architecture:** Clean Architecture + Module Federation

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/Sergey0910/OneMomentSuperApp.git
cd OneMomentSuperApp

# Install dependencies
npm install

# iOS
npx pod-install
npx react-native run-ios

# Android
npx react-native run-android

# Start backend
cd backend && docker-compose up
```

## 📊 Project Status

- ✅ Architecture defined
- ✅ 10/81 screens completed
- 🚧 Restaurant module in progress
- 📅 MVP: October 2025
- 🎯 Launch: November 2025

## 🤝 Contributors

- Sergey - Founder & Vision (97%)
- Claude AI - Technical Architecture (3%)

## 📜 License

MIT License - see LICENSE file

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Sergey0910/OneMomentSuperApp&type=Date)](https://star-history.com/#Sergey0910/OneMomentSuperApp&Date)

---

**Built with ❤️ for travelers worldwide**