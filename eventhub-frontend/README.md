# EventHub Frontend

A modern event management platform built with React, TypeScript, Vite, and Tailwind CSS.

## 🎯 Overview

EventHub is a UI-only event management application (Phase 1 - no blockchain integration). This phase focuses on creating a complete, professional SaaS-style dashboard for managing events, registrations, and participants.

## 🚀 Tech Stack

- **React 19** - UI library
- **TypeScript 6** - Type safety
- **Vite 8** - Build tool
- **Tailwind CSS 4** - Styling
- **React Router 7** - Routing

## 📋 Features

### Public Features
- Landing page with hero section
- Browse all events with search and filters
- Detailed event pages
- User authentication (email/password only)

### User Features
- Personal dashboard with upcoming events
- Event registration (UI flow simulation)
- My Events tracking
- Activity timeline
- Profile management

### Admin Features
- Admin dashboard with statistics
- Complete event management (CRUD operations)
- Registrations and participants tracking
- System-wide activity timeline
- Admin profile management

## 🎨 Design System

### Design Tokens
- **Primary Gradient**: indigo → purple → blue (hero/headers)
- **Backgrounds**: white / light gray
- **Accent Pastels**: soft purple, orange, green, pink, blue, yellow
- **Border Radius**: 14-18px
- **Shadows**: soft shadows
- **Typography**: clean modern sans-serif

### Design Philosophy
- Professional SaaS dashboard aesthetic (Linear/Vercel-inspired)
- Generous spacing and restrained animations
- Mobile-first responsive design
- Accessible and touch-friendly UI

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔑 Test Credentials

### User Account
- **Email**: user@eventhub.com
- **Password**: any text

### Admin Account
- **Email**: admin@eventhub.com
- **Password**: any text

## 🗂️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── EventCard.tsx
│   ├── Sidebar.tsx
│   └── ...
├── pages/              # Page components
│   ├── Landing.tsx
│   ├── Login.tsx
│   ├── Events.tsx
│   ├── user/          # User-specific pages
│   └── admin/         # Admin-specific pages
├── services/          # Data layer (mock API)
│   ├── auth.ts
│   └── events.ts
├── context/           # React context
│   └── AuthContext.tsx
├── types/             # TypeScript types
│   └── index.ts
└── App.tsx            # Main app with routing
```

## 🛣️ Routes

### Public Routes
- `/` - Landing page
- `/login` - User/Admin login
- `/signup` - User registration
- `/events` - Browse events
- `/events/:id` - Event details
- `/about` - About page

### User Routes (Protected)
- `/dashboard` - User dashboard
- `/my-events` - My registrations
- `/upcoming-events` - Upcoming events
- `/activity` - User activity
- `/profile` - User profile

### Admin Routes (Protected)
- `/admin` - Admin dashboard
- `/admin/events` - Events management
- `/admin/registrations` - All registrations
- `/admin/participants` - All participants
- `/admin/activity` - System activity
- `/admin/profile` - Admin profile

## 📊 Data Architecture

### Mock Services
All data is stored in `localStorage` and managed through service layers:
- `authService` - Authentication and user management
- `eventsService` - Events, registrations, and activities

### Seed Data
- 2 events (Cultural and Sports) dated in August 2026
- 2 default users (admin and regular user)
- No fake statistics or activity history

### Transaction State Machine
Built-in support for future blockchain integration with states:
- `idle` - No transaction
- `wallet-required` - Wallet needed
- `wallet-selection` - Choosing wallet
- `waiting-for-wallet` - Awaiting wallet confirmation
- `user-rejected` - User cancelled
- `pending` - Processing
- `success` - Completed successfully
- `failed` - Transaction failed
- `insufficient-balance` - Not enough funds
- `wallet-unavailable` - Wallet not available

## 🔐 Authentication Model

**Critical**: Email/password authentication only. No wallet connection at login.

- Users log in with email and password
- Wallet is requested only for blockchain-requiring actions (future phase)
- Role-based access control (user vs admin)
- Protected routes with automatic redirection

## 📱 Responsive Design

- Desktop: Full sidebar navigation
- Tablet: Collapsible sidebar
- Mobile: Bottom-right floating menu button, drawer navigation
- All forms and tables adapt to single-column layouts
- Touch-friendly button sizes

## 🎭 Component Highlights

### Shared Components
All components built from scratch with Tailwind (no external UI library):
- `Button` - With transaction state support
- `Input` / `Select` - Form controls with validation
- `Modal` - Accessible modal dialogs
- `Toast` - Toast notifications
- `EventCard` - Reusable event cards
- `ActivityItem` - Activity timeline items
- `EmptyState` - Empty state placeholders
- `LoadingSkeleton` - Loading states
- `SearchBar` / `FilterBar` - Search and filtering

## 🚧 Not Implemented (Future Phases)

The following are intentionally NOT included in this UI-only phase:
- Wallet integration
- Soroban smart contracts
- Stellar blockchain calls
- IPFS storage
- Payment processing
- Certificates/NFTs
- Chat features
- AI recommendations
- Email notifications
- Real analytics

## ✅ Definition of Done

- [x] All pages reachable via navigation
- [x] Full user flow: Landing → Login → Dashboard → Events → Register (UI)
- [x] Full admin flow: Login → Dashboard → Events → Create/Edit → Registrations
- [x] No hardcoded data beyond 2 seed events
- [x] Role-based route protection
- [x] Mobile responsive design
- [x] Consistent component reuse
- [x] Centralized data layer
- [x] Transaction state machine prepared for blockchain

## 🔮 Next Phase: Stellar/Soroban Integration

The application is architected to plug in blockchain functionality without component rewrites:

1. **Service Layer**: Replace mock functions in `services/` with actual Soroban SDK calls
2. **Transaction States**: Wire up the existing state machine to wallet libraries
3. **Smart Contracts**: Deploy Soroban contracts for event management
4. **Storage**: Integrate IPFS for event metadata and images

## 📝 License

MIT

## 👨‍💻 Development

Built with attention to:
- Clean code architecture
- Type safety
- Component reusability
- Performance optimization
- Accessibility standards
- Professional UX patterns

---

**Ready for Stellar/Soroban integration when you are!** 🚀
