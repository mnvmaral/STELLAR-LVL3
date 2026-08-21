# EventHub - Stellar Event Management dApp

<div align="center">

### Build Status & Deployment

[![CI](https://github.com/mnvmaral/STELLAR-LVL3/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/mnvmaral/STELLAR-LVL3/actions/workflows/ci.yml)
[![Stellar Testnet](https://img.shields.io/badge/Stellar-Testnet-7C4DFF?logo=stellar&logoColor=white)](https://stellar.expert/explorer/testnet/contract/CB4W7MU5BDRSAIF4HVIY3JLSYQNBNVLICCAWAWUQ3AWKY4QIMDCFPQEE)
[![Contract Deployed](https://img.shields.io/badge/Contract-Deployed-success?logo=stellar&logoColor=white)](https://stellar.expert/explorer/testnet/contract/CB4W7MU5BDRSAIF4HVIY3JLSYQNBNVLICCAWAWUQ3AWKY4QIMDCFPQEE)

### Technology Stack

![Soroban](https://img.shields.io/badge/Soroban-Smart%20Contracts-7C4DFF?logo=stellar&logoColor=white)
![Rust](https://img.shields.io/badge/Rust-1.85+-orange?logo=rust&logoColor=white)
![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.3-38B2AC?logo=tailwind-css&logoColor=white)

### Project Info

![License](https://img.shields.io/badge/License-MIT-green?logo=opensourceinitiative&logoColor=white)
![Last Commit](https://img.shields.io/github/last-commit/mnvmaral/STELLAR-LVL3?logo=github)
![Tests](https://img.shields.io/badge/Tests-9%20Passing-success?logo=checkmarx&logoColor=white)

---

**A decentralized event management platform built on Stellar blockchain with Soroban smart contracts**

[View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CB4W7MU5BDRSAIF4HVIY3JLSYQNBNVLICCAWAWUQ3AWKY4QIMDCFPQEE) • [View Contract Transactions](https://stellar.expert/explorer/testnet/tx/f849e81a0277c166757b52314e261b39ef85fd697161c453b6cc0f68f75943a8)

</div>

---

## 📖 Table of Contents

- [About](#-about)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Technology Stack](#-technology-stack)
- [Smart Contract](#-smart-contract)
- [Stellar Testnet Deployment](#-stellar-testnet-deployment)
- [Wallet Integration](#-wallet-integration)
- [Frontend ↔ Soroban Integration](#-frontend--soroban-integration)
- [Transaction Flow](#-transaction-flow)
- [Error Handling](#-error-handling)
- [Testing](#-testing)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Project Structure](#-project-structure)
- [Local Development](#-local-development)
- [Environment Variables](#-environment-variables)
- [Level 3 Requirements Status](#-level-3-requirements-status)
- [Screenshots](#-screenshots)
- [Future Improvements](#-future-improvements)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## 🌟 About

**EventHub** is a production-ready decentralized application (dApp) for event management, leveraging the Stellar blockchain and Soroban smart contracts. Users can create, discover, and register for events with full on-chain verification, providing transparency, immutability, and decentralized trust.

The application features a modern React frontend with role-based authentication (admin and user), integrated with a robust Soroban smart contract deployed on the Stellar testnet. EventHub demonstrates advanced smart contract development, blockchain integration, and a professional SaaS-style user interface.

---

## ✨ Key Features

### Public Features
- 🏠 **Landing Page** - Hero section with gradient design and call-to-action
- 🔍 **Event Discovery** - Browse all events with search and category filters
- 📄 **Event Details** - View comprehensive event information
- 🔐 **User Authentication** - Secure email/password login and signup

### User Features
- 📊 **Dashboard** - Personal overview of registered and upcoming events
- 🎟️ **Event Registration** - Register for events via blockchain transactions
- 📅 **My Events** - Track all registered events
- 📈 **Activity Timeline** - View user activity history
- 👤 **Profile Management** - Update personal information

### Admin Features
- 📊 **Admin Dashboard** - System statistics (total events, registrations, participants)
- ➕ **Event Management** - Create, edit, and manage events (stored on-chain)
- 📋 **Registration Tracking** - View all event registrations
- 👥 **Participant Management** - Track and manage participants
- 📜 **Activity Logs** - System-wide activity monitoring
- ⚙️ **Admin Profile** - Manage admin account settings

### Blockchain Features
- ⛓️ **On-Chain Event Creation** - Events stored immutably on Stellar
- 🔒 **On-Chain Registrations** - Registration verification via smart contracts
- 💳 **Freighter Wallet Integration** - Secure transaction signing
- ✅ **Transaction Verification** - All transactions viewable on Stellar Expert
- 🎯 **Event Capacity Management** - Enforced on-chain with automatic validation
- 🚫 **Duplicate Registration Prevention** - Smart contract validation

---

## 🏗️ Architecture

EventHub follows a modern decentralized application architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                     EventHub Frontend                        │
│  (React 19 + TypeScript 6 + Vite 8 + Tailwind CSS 4)       │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Public     │  │     User     │  │    Admin     │     │
│  │    Pages     │  │   Dashboard  │  │   Dashboard  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Services Layer (Hybrid)                     │  │
│  │  • stellar-wallet.ts (Freighter Integration)         │  │
│  │  • stellar-blockchain.ts (Contract Interaction)      │  │
│  │  • events.ts (Blockchain + localStorage fallback)   │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ @stellar/stellar-sdk
                     │ @stellar/freighter-api
                     │
┌────────────────────▼────────────────────────────────────────┐
│                  Stellar Testnet                             │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         EventManager Smart Contract                   │  │
│  │         (Soroban / Rust)                             │  │
│  │                                                       │  │
│  │  Contract ID:                                        │  │
│  │  CB4W7MU5BDRSAIF4HVIY3JLSYQNBNVLICCAWAWUQ3AWKY4...  │  │
│  │                                                       │  │
│  │  Functions: create_event, get_event,                │  │
│  │             register_for_event, etc.                │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Data Storage: Instance Storage (On-Chain)                  │
│  Authorization: Address-based require_auth()                │
└──────────────────────────────────────────────────────────────┘
```

### Key Architectural Decisions

1. **Hybrid Data Layer**: Blockchain for critical operations (create, register), localStorage for UI state and caching
2. **Wallet-Only-When-Needed**: Email/password authentication for app access, wallet required only for blockchain transactions
3. **Transaction State Machine**: Built-in support for wallet connection, pending states, success/failure handling
4. **Role-Based Access Control**: Separate user and admin dashboards with protected routes
5. **Mobile-First Responsive**: Adapts to desktop, tablet, and mobile with collapsible navigation

---

## 🛠️ Technology Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.2.8 | UI library for component-based development |
| TypeScript | 6.0.2 | Type safety and developer experience |
| Vite | 8.2.0 | Build tool and development server |
| Tailwind CSS | 4.3.3 | Utility-first CSS framework |
| React Router | 7.18.2 | Client-side routing and navigation |
| @stellar/stellar-sdk | 16.2.0 | Stellar blockchain SDK |
| @stellar/freighter-api | 6.0.1 | Freighter wallet integration |

### Smart Contract
| Technology | Version | Purpose |
|-----------|---------|---------|
| Rust | 1.85+ | Smart contract programming language |
| Soroban SDK | 27.0 | Stellar smart contract SDK |
| soroban-cli | Latest | Contract deployment and management |

### Development Tools
| Tool | Purpose |
|------|---------|
| ESLint | Code linting and quality checks |
| TypeScript ESLint | TypeScript-specific linting rules |
| GitHub Actions | Continuous integration and deployment |
| Stellar CLI | Blockchain interaction and contract deployment |
| Stellar Lab | Contract testing and exploration |

---

## 🔷 Smart Contract

The **EventManager** smart contract is written in Rust using the Soroban SDK v27.0 and deployed on the Stellar testnet. It provides core event management functionality with on-chain storage and authorization.

### Contract Functions

| Function | Parameters | Returns | Description |
|----------|-----------|---------|-------------|
| **create_event** | `organizer: Address`<br>`title: String`<br>`description: String`<br>`category: String`<br>`date: String`<br>`time: String`<br>`location: String`<br>`max_participants: u32` | `u64` (event ID) | Create a new event. Requires organizer authorization. Validates max_participants > 0. Emits `event_created`. |
| **get_event** | `event_id: u64` | `Option<Event>` | Fetch a single event by ID. Read-only, no auth required. |
| **get_all_events** | None | `Vec<Event>` | Fetch all events from the contract. Read-only, no auth required. |
| **register_for_event** | `event_id: u64`<br>`participant: Address` | `bool` | Register for an event. Requires participant authorization. Prevents duplicate registrations and validates capacity. Emits `user_registered`. |
| **is_registered** | `event_id: u64`<br>`participant: Address` | `bool` | Check if a user is registered for an event. Read-only, no auth required. |
| **get_user_registrations** | `user: Address` | `Vec<u64>` (event IDs) | Get all event IDs a user is registered for. Read-only, no auth required. |
| **get_event_registrations** | `event_id: u64` | `Vec<Address>` | Get all participants registered for an event. Read-only, no auth required. |

### Contract Data Structures

**Event Struct:**
```rust
pub struct Event {
    pub id: u64,
    pub title: String,
    pub description: String,
    pub category: String,
    pub date: String,
    pub time: String,
    pub location: String,
    pub organizer: Address,
    pub max_participants: u32,
    pub current_participants: u32,
    pub status: String,
    pub created_at: u64,
}
```

**Registration Struct:**
```rust
pub struct Registration {
    pub event_id: u64,
    pub participant: Address,
    pub registered_at: u64,
}
```

### Contract Events

- **event_created**: Emitted when a new event is created (includes event ID and organizer)
- **user_registered**: Emitted when a user registers for an event (includes event ID and participant address)

### Authorization & Validation

- **Address-based Authorization**: Write operations (`create_event`, `register_for_event`) use `require_auth()` to verify transaction signatures
- **Input Validation**: max_participants must be > 0
- **Capacity Checks**: Prevents registration when `current_participants >= max_participants`
- **Duplicate Prevention**: Checks existing registrations to prevent double registration
- **Error Handling**: Panics with descriptive messages ("Event is full", "Already registered", "Event not found")

---

## 🌐 Stellar Testnet Deployment

The EventManager smart contract is deployed and verified on the **Stellar Testnet** with the following on-chain artifacts:

### Contract Information

| Property | Value |
|----------|-------|
| **Contract ID** | `CB4W7MU5BDRSAIF4HVIY3JLSYQNBNVLICCAWAWUQ3AWKY4QIMDCFPQEE` |
| **Network** | Stellar Testnet |
| **WASM Hash** | `90848d7eb2ff47653498e461a6a1367b59e90ff9d2eaa231cdf332ddeaf2463f` |

### Verified Transactions

| Transaction Type | Hash | Stellar Expert Link |
|-----------------|------|---------------------|
| **Upload WASM** | `192f167937fa1da96a4d53f6894b17121d0c47e71fd7e1346ffca4ae3a800cf7` | [View Transaction](https://stellar.expert/explorer/testnet/tx/192f167937fa1da96a4d53f6894b17121d0c47e71fd7e1346ffca4ae3a800cf7) |
| **Deploy Contract** | `bed09df241497575d057de0dbe313929925c10df279a7c21c24b73d51eeec496` | [View Transaction](https://stellar.expert/explorer/testnet/tx/bed09df241497575d057de0dbe313929925c10df279a7c21c24b73d51eeec496) |
| **Create Event (First)** | `f849e81a0277c166757b52314e261b39ef85fd697161c453b6cc0f68f75943a8` | [View Transaction](https://stellar.expert/explorer/testnet/tx/f849e81a0277c166757b52314e261b39ef85fd697161c453b6cc0f68f75943a8) |

### Verification

You can verify the deployment and interact with the contract using:

- **Stellar Expert**: [Contract Explorer](https://stellar.expert/explorer/testnet/contract/CB4W7MU5BDRSAIF4HVIY3JLSYQNBNVLICCAWAWUQ3AWKY4QIMDCFPQEE)
- **Stellar Lab**: [Contract Interface](https://lab.stellar.org/)

The first event created on-chain ("Blockchain Summit 2024") is confirmed with transaction hash `f849e81a...` and can be verified directly on the blockchain.

---

## 💳 Wallet Integration

EventHub integrates with **Freighter Wallet**, the leading Stellar wallet extension, to enable secure blockchain transaction signing.

### Wallet Service Features

- **Freighter Detection**: Automatic detection of installed wallet extension
- **Wallet Connection**: Seamless connection flow with user permission request
- **Address Retrieval**: Fetch user's public key for transaction signing
- **Transaction Signing**: Sign transactions securely via Freighter API
- **Network Configuration**: Configured for Stellar Testnet

### Wallet Flow

1. User attempts a blockchain operation (create event, register for event)
2. App checks for Freighter wallet installation
3. If not connected, prompts user to connect wallet
4. User approves connection in Freighter
5. Transaction is prepared and sent to wallet for signing
6. User reviews and signs transaction in Freighter
7. Signed transaction is submitted to Stellar network
8. App displays transaction status (pending → success/failed)

**Note**: Email/password authentication is used for app login. Wallet connection is only requested when performing blockchain operations.

---

## 🔗 Frontend ↔ Soroban Integration

The frontend communicates with the Soroban smart contract through a service layer architecture:

### Service Architecture

1. **stellar-wallet.ts**: Manages Freighter wallet connection, address retrieval, and transaction signing
2. **stellar-blockchain.ts**: Handles contract interaction (create_event, register_for_event, get_all_events, etc.)
3. **events.ts**: Hybrid service that coordinates blockchain calls with localStorage for UI state and caching

### Integration Flow

**Creating an Event:**
```typescript
User fills form → events.createEvent() → stellar-blockchain.createEvent() 
→ Prepare contract call → Request wallet signature → Submit to blockchain 
→ Transaction confirmed → UI updated
```

**Registering for Event:**
```typescript
User clicks register → events.registerForEvent() → Check wallet connection 
→ stellar-blockchain.registerForEvent() → Request signature → Submit transaction 
→ Update participant count → UI refresh
```

**Fetching Events:**
```typescript
Page loads → events.getEvents() → stellar-blockchain.getAllEvents() 
→ Fetch from contract (read-only) → Transform data → Display in UI
```

### SDK Configuration

The frontend uses:
- `@stellar/stellar-sdk` v16.2.0 for blockchain interaction
- `@stellar/freighter-api` v6.0.1 for wallet integration
- Environment variables for contract ID and network configuration

---

## 🔄 Transaction Flow

EventHub implements a comprehensive transaction state machine for blockchain operations:

### Transaction States

| State | Description | UI Behavior |
|-------|-------------|-------------|
| **idle** | No active transaction | Normal button state |
| **wallet-required** | Wallet needed for operation | Show "Connect Wallet" button |
| **wallet-selection** | Choosing wallet provider | Wallet selection modal |
| **waiting-for-wallet** | Awaiting user signature | Loading state with spinner |
| **user-rejected** | User declined in wallet | Error message, retry button |
| **pending** | Transaction submitted | Loading state, show TX hash |
| **success** | Transaction confirmed | Success message, confetti animation |
| **failed** | Transaction failed | Error message, retry button |
| **insufficient-balance** | Not enough XLM | Balance warning, fund wallet CTA |
| **wallet-unavailable** | Wallet not installed | Install Freighter prompt |

### Transaction Lifecycle

1. **Initiation**: User triggers blockchain operation
2. **Wallet Check**: App verifies wallet connection
3. **Transaction Preparation**: Contract call prepared with parameters
4. **User Signature**: Wallet prompts user to sign transaction
5. **Submission**: Signed transaction sent to Stellar network
6. **Confirmation**: Wait for ledger confirmation
7. **UI Update**: State updated based on success/failure

---

## 🛡️ Error Handling

EventHub implements comprehensive error handling across all layers:

### Smart Contract Error Handling

- **Validation Errors**: "Max participants must be greater than 0"
- **Authorization Errors**: Automatic panic if `require_auth()` fails
- **Business Logic Errors**: "Event is full", "Already registered", "Event not found"

### Frontend Error Handling

- **Wallet Errors**: Wallet not installed, user rejected transaction, network mismatch
- **Network Errors**: RPC timeout, connection failed, invalid response
- **UI Errors**: Form validation, empty states, loading skeletons
- **Transaction Errors**: Insufficient balance, transaction failed, contract panic

### Loading States

All async operations display appropriate loading states:
- Skeleton loaders for data fetching
- Spinner animations for transaction submission
- Progress indicators for multi-step operations
- Disabled buttons to prevent duplicate submissions

---

## 🧪 Testing

### Smart Contract Tests

**Location**: `eventhub-contract/contracts/event-manager/src/test.rs`

**Test Suite**: 9 comprehensive tests, **all passing**

| Test | Description | Status |
|------|-------------|--------|
| `test_create_event` | Verify event creation and data storage | ✅ Pass |
| `test_get_all_events` | Fetch multiple events correctly | ✅ Pass |
| `test_register_for_event` | Successful event registration | ✅ Pass |
| `test_duplicate_registration` | Prevent double registration (should panic) | ✅ Pass |
| `test_event_full` | Prevent registration when capacity reached | ✅ Pass |
| `test_invalid_max_participants` | Reject max_participants = 0 | ✅ Pass |
| `test_get_user_registrations` | Fetch user's event list | ✅ Pass |
| `test_get_event_registrations` | Fetch event's participant list | ✅ Pass |
| `test_register_for_nonexistent_event` | Reject invalid event ID | ✅ Pass |

**Run Tests:**
```bash
cd eventhub-contract
cargo test --package event-manager
```

**Test Output:**
```
test result: ok. 9 passed; 0 failed; 0 ignored; 0 measured
```

### Frontend Tests

Frontend testing is structured but not yet implemented. The CI pipeline validates:
- TypeScript compilation
- ESLint code quality checks
- Production build success

---

## 🔧 CI/CD Pipeline

EventHub includes a comprehensive **GitHub Actions CI pipeline** that runs automatically on every push and pull request to `main`, `master`, or `develop` branches.

### Workflow: Continuous Integration

**File**: `.github/workflows/ci.yml`

**Status**: [![CI](https://github.com/mnvmaral/STELLAR-LVL3/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/mnvmaral/STELLAR-LVL3/actions/workflows/ci.yml)

### Pipeline Jobs

#### 1. Frontend Build & Lint
- ✅ Setup Node.js 20 with npm caching
- ✅ Install dependencies with `npm ci`
- ✅ Run ESLint for code quality checks
- ✅ Build production bundle with Vite
- ✅ Upload build artifacts (retained for 7 days)

#### 2. Smart Contract Build & Test
- ✅ Setup Rust toolchain with `wasm32-unknown-unknown` target
- ✅ Cache Cargo dependencies for faster builds
- ✅ Install Soroban CLI
- ✅ Build contract to optimized WASM
- ✅ **Run all 9 contract tests** (must pass)
- ✅ Optimize WASM binary
- ✅ Upload WASM artifact (retained for 7 days)

#### 3. Integration Validation
- ✅ Verify `.env.example` configuration exists
- ✅ Check `DEPLOYMENT_SUMMARY.md` documentation
- ✅ Validate contract ID is configured
- ✅ Runs after both build jobs complete

### Continuous Deployment

**Current Status**: Manual deployment

- **Smart Contract**: Already deployed to Stellar Testnet (manual)
- **Frontend**: Not yet deployed (manual deployment to Vercel pending)

**Note**: CD workflow will be added when frontend deployment is configured.

---

## 📁 Project Structure

```
STELLAR-LVL3/
├── .github/
│   └── workflows/
│       └── ci.yml                    # CI/CD pipeline configuration
│
├── eventhub-contract/                # Soroban smart contracts
│   ├── contracts/
│   │   └── event-manager/
│   │       ├── src/
│   │       │   ├── lib.rs           # Contract implementation
│   │       │   └── test.rs          # Contract tests (9 tests)
│   │       ├── Cargo.toml           # Contract dependencies
│   │       └── Makefile             # Build commands
│   ├── Cargo.toml                   # Workspace configuration
│   └── README.md
│
├── eventhub-frontend/                # React frontend application
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── components/              # Reusable UI components (21 components)
│   │   │   ├── Button.tsx
│   │   │   ├── EventCard.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── ...
│   │   ├── pages/                   # Page components (18 pages)
│   │   │   ├── Landing.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Events.tsx
│   │   │   ├── user/               # User dashboard pages
│   │   │   └── admin/              # Admin dashboard pages
│   │   ├── services/                # Service layer
│   │   │   ├── auth.ts             # Authentication service
│   │   │   ├── events.ts           # Hybrid events service
│   │   │   ├── stellar-wallet.ts   # Freighter integration
│   │   │   └── stellar-blockchain.ts # Contract interaction
│   │   ├── context/
│   │   │   └── AuthContext.tsx     # Auth state management
│   │   ├── types/
│   │   │   └── index.ts            # TypeScript types
│   │   ├── App.tsx                 # Main app with routing
│   │   └── main.tsx                # Entry point
│   ├── .env.example                 # Environment template
│   ├── package.json                 # Frontend dependencies
│   ├── tailwind.config.js           # Tailwind configuration
│   ├── vite.config.ts               # Vite configuration
│   └── README.md
│
├── DEPLOYMENT_SUMMARY.md             # Detailed deployment documentation
├── LICENSE                           # MIT License
└── README.md                         # This file
```

---

## 🚀 Local Development

### Prerequisites

- **Node.js** 20+ and npm
- **Rust** 1.85+ with `wasm32-unknown-unknown` target
- **Soroban CLI** (for contract development)
- **Freighter Wallet** extension (for wallet testing)

### Frontend Setup

```bash
# Navigate to frontend directory
cd eventhub-frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

The frontend will be available at `http://localhost:5173`

### Smart Contract Setup

```bash
# Navigate to contract directory
cd eventhub-contract

# Build contract
cargo build --target wasm32-unknown-unknown --release --package event-manager

# Run tests
cargo test --package event-manager

# Optimize WASM (requires soroban-cli)
soroban contract optimize \
  --wasm target/wasm32-unknown-unknown/release/event_manager.wasm

# Deploy to testnet (requires funded account)
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/event_manager.wasm \
  --source <YOUR_SECRET_KEY> \
  --network testnet
```

### Test Credentials

For local testing with existing data:

**User Account:**
- Email: `user@eventhub.com`
- Password: any text

**Admin Account:**
- Email: `admin@eventhub.com`
- Password: any text

---

## 🔐 Environment Variables

Create a `.env` file in `eventhub-frontend/` with the following variables:

```bash
# Stellar Network Configuration
VITE_STELLAR_NETWORK=testnet
VITE_STELLAR_RPC_URL=https://soroban-testnet.stellar.org
VITE_STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org

# EventManager Contract
VITE_EVENT_CONTRACT_ID=CB4W7MU5BDRSAIF4HVIY3JLSYQNBNVLICCAWAWUQ3AWKY4QIMDCFPQEE
```

**Security Notes:**
- ⚠️ **NEVER commit private keys or secret keys**
- ⚠️ **NEVER commit `.env` files with secrets**
- ✅ Only public configuration (contract IDs, RPC URLs) in `.env.example`
- ✅ Add `.env` to `.gitignore`

---

## 📊 Level 3 Requirements Status

| Requirement | Status | Evidence |
|------------|--------|----------|
| **Advanced Smart Contract Development** | ✅ Complete | 7 contract functions, events, authorization, validation |
| **Inter-Contract Communication** | ⏸️ Not Started | Single contract architecture, not required for current scope |
| **Event Streaming / Real-Time Updates** | 🔶 Partial | Contract emits events (`event_created`, `user_registered`), frontend polling not yet implemented |
| **CI/CD Pipeline** | ✅ Complete | GitHub Actions with frontend build, contract build/test, integration checks |
| **Deployment Workflow** | ✅ Complete | Contract deployed to testnet with verified transactions, frontend ready for Vercel |
| **Mobile Responsive Frontend** | ✅ Complete | Mobile-first design with responsive navigation and layouts |
| **Error Handling & Loading States** | ✅ Complete | Transaction state machine, loading skeletons, error messages, wallet error handling |
| **Contract Tests** | ✅ Complete | 9/9 tests passing, covering all contract functions and edge cases |
| **Frontend Integration Tests** | ⏸️ Not Started | Frontend tests not yet implemented |
| **Production-Ready Architecture** | ✅ Complete | Service layer separation, hybrid data approach, security best practices |
| **Comprehensive Documentation** | ✅ Complete | README with architecture, deployment details, API tables, setup instructions |
| **Demo / Live Deployment** | 🔶 Partial | Contract live on testnet, frontend not yet deployed to Vercel |

**Legend:**
- ✅ Complete - Fully implemented and verified
- 🔶 Partial - Core functionality complete, enhancements pending
- ⏸️ Not Started - Not yet implemented

---

## 📸 Screenshots

### Landing Page
[PASTE SCREENSHOT HERE]

### Event Browsing
[PASTE SCREENSHOT HERE]

### Event Details
[PASTE SCREENSHOT HERE]

### User Dashboard
[PASTE SCREENSHOT HERE]

### Admin Dashboard
[PASTE SCREENSHOT HERE]

### Wallet Transaction Flow
[PASTE SCREENSHOT HERE]

### Stellar Expert Confirmation
[PASTE SCREENSHOT HERE]

---

## 🚀 Future Improvements

### Blockchain Enhancements
- [ ] Implement real-time event streaming from contract events
- [ ] Add update_event and cancel_event functions to contract
- [ ] Implement cancel_registration functionality
- [ ] Token-gated events (require specific token holdings)
- [ ] NFT certificates for event attendance
- [ ] On-chain voting for event proposals

### Frontend Enhancements
- [ ] Multi-wallet support (Freighter, Albedo, xBull)
- [ ] Event filtering by date range and location
- [ ] Event image upload to IPFS
- [ ] In-app notifications for registration confirmations
- [ ] QR code check-in system for events
- [ ] Export registrations to CSV

### Features
- [ ] Event ratings and reviews
- [ ] Recurring events support
- [ ] Event categories with custom metadata
- [ ] Social sharing integration
- [ ] Email reminders for upcoming events
- [ ] Analytics dashboard for organizers

### Testing & Quality
- [ ] Frontend unit and integration tests
- [ ] E2E tests with Playwright
- [ ] Contract fuzzing tests
- [ ] Load testing for scalability
- [ ] Security audit

### Deployment
- [ ] Deploy frontend to Vercel/Netlify
- [ ] Mainnet deployment preparation
- [ ] Custom domain configuration
- [ ] CDN for static assets

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Development Guidelines:**
- Follow existing code style and conventions
- Add tests for new functionality
- Update documentation for API changes
- Ensure CI pipeline passes before submitting PR

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Manav Maral**

- GitHub: [@mnvmaral](https://github.com/mnvmaral)
- Repository: [STELLAR-LVL3](https://github.com/mnvmaral/STELLAR-LVL3)

---

<div align="center">

**Built with ❤️ on Stellar**

[View Contract](https://stellar.expert/explorer/testnet/contract/CB4W7MU5BDRSAIF4HVIY3JLSYQNBNVLICCAWAWUQ3AWKY4QIMDCFPQEE) • [View Transactions](https://stellar.expert/explorer/testnet/tx/f849e81a0277c166757b52314e261b39ef85fd697161c453b6cc0f68f75943a8) • [Stellar Docs](https://developers.stellar.org/docs) • [Soroban Docs](https://soroban.stellar.org/docs)

</div>
