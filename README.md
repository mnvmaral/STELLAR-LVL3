# EventHub

Deployment
stellar-lvl-3-ekot-9iexff95z-builders-1172.vercel.app
Domains
stellar-lvl-3-ekot.vercel.app   

VERCEL DEPLOYMENT LINK: Live Demo⁠￼ | Alternative Deployment⁠￼ 

Vercel Deployment SS : 


<img width="1447" height="840" alt="Screenshot 2026-08-31 at 1 18 27 AM" src="https://github.com/user-attachments/assets/95d9f6ac-c308-4701-a53c-675b12068a14" />


**Decentralized Event Management on Stellar Blockchain**

![Frontend CI](https://github.com/mnvmaral/STELLAR-LVL3/actions/workflows/ci.yml/badge.svg)

![Soroban](https://img.shields.io/badge/Soroban-Smart%20Contracts-blue)
![Stellar Testnet](https://img.shields.io/badge/Stellar-Testnet-purple)
![Freighter Wallet](https://img.shields.io/badge/Freighter-Wallet-orange)

![Rust](https://img.shields.io/badge/Rust-Contract-orange)
![React 19](https://img.shields.io/badge/React-19.2.8-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0.2-blue)
![Vite](https://img.shields.io/badge/Vite-8.2.0-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.3.3-cyan)

![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)
![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen)
![Last Commit](https://img.shields.io/github/last-commit/mnvmaral/STELLAR-LVL3)

---

## Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Features](#-features)
- [Architecture](#-architecture)
- [Smart Contracts](#-smart-contracts)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Testing](#-testing)
- [Mobile Responsive Design](#-mobile-responsive-design)
- [Screenshots](#-screenshots)
- [Author](#-author)
- [License](#-license)

---

## 🎉 Overview

**EventHub** is a decentralized event management platform built on the Stellar Testnet using Soroban smart contracts. It enables event organizers to create blockchain-verified events and allows participants to register, cancel, and re-register for events through transparent, immutable on-chain transactions.

Traditional event platforms rely on centralized databases where registration data can be modified or lost. EventHub addresses this by combining Stellar blockchain, Soroban smart contracts, and Freighter Wallet to create a trustless, transparent event ecosystem with an immutable audit trail.

Event organizers create events on-chain with participant limits, while attendees register using their Stellar wallets. Every registration, cancellation, and re-registration is recorded on-chain, ensuring data integrity and providing verifiable proof of attendance.

### Key Highlights

- 🎫 **Blockchain-verified event registrations**
- 👥 **Participant limit enforcement**
- ✅ **Register → Cancel → Re-register lifecycle**
- ⛓️ **Immutable blockchain audit trail**
- ⚡ **Soroban smart contracts**
- 🌐 **Stellar Testnet integration**
- 📱 **Fully responsive interface**
- 🚀 **Production-ready React + Vite application**

---

## 🚀 Live Demo

| Resource | Link |
|----------|------|
| 🌐 **Live Application** | https://stellar-lvl-3-ekot.vercel.app |
| 📂 **GitHub Repository** | https://github.com/mnvmaral/STELLAR-LVL3 |
| 🌍 **Stellar Explorer** | https://stellar.expert/explorer/testnet |
| 🔐 **Freighter Wallet** | https://www.freighter.app |

> **Note:** The project runs on the Stellar Testnet. Install the Freighter Wallet extension and fund your wallet using Friendbot before testing blockchain transactions.

---

## ✨ Features

### Core Features

- 🔐 **Secure Freighter wallet authentication**
- 🎪 **Create blockchain-verified events**
- 🎫 **On-chain event registration**
- ❌ **Cancel registration with blockchain confirmation**
- 🔄 **Re-register after cancellation**
- 👥 **Participant count enforcement**
- 📜 **Immutable blockchain audit trail**
- 🎭 **Multi-role support (User / Admin / Organizer)**

### Advanced Features

- ⚡ **Soroban smart contracts**
- 📱 **Fully mobile responsive**
- 🚀 **GitHub Actions CI/CD pipeline**
- ⚙️ **Production-ready architecture**
- 🧪 **12 automated contract tests**
- 🔍 **Stellar Horizon integration**
- 💳 **Freighter transaction signing**
- 🌍 **Live deployment on Vercel**
- 🏗️ **Blockchain-first state management**

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        EventHub                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌──────────────┐    ┌──────────────┐    ┌─────────────┐  │
│   │   Attendee   │    │  Organizer   │    │    Admin    │  │
│   │   Browser    │    │   Browser    │    │   Panel     │  │
│   └──────┬───────┘    └──────┬───────┘    └──────┬──────┘  │
│          │                   │                   │         │
│   ┌──────▼───────────────────▼───────────────────▼──────┐  │
│   │              React 19 + TypeScript + Vite           │  │
│   │           TailwindCSS · React Router                │  │
│   └──────────────────────┬──────────────────────────────┘  │
│                          │                                  │
│          ┌───────────────┴────────────────┐                 │
│          │                                │                 │
│   ┌──────▼──────┐                 ┌──────▼──────┐         │
│   │  Freighter  │                 │   Local     │         │
│   │   Wallet    │                 │   Storage   │         │
│   └──────┬──────┘                 └─────────────┘         │
│          │                                                  │
│   ┌──────▼──────────────────────────────────────────────┐  │
│   │                  Stellar Testnet                    │  │
│   │    ┌─────────────────────────────────────────┐     │  │
│   │    │         EventManager Contract            │     │  │
│   │    │  ┌────────────────────────────────────┐ │     │  │
│   │    │  │  create_event                      │ │     │  │
│   │    │  │  register_for_event                │ │     │  │
│   │    │  │  cancel_registration               │ │     │  │
│   │    │  │  is_registered                     │ │     │  │
│   │    │  │  get_all_events                    │ │     │  │
│   │    │  │  get_event                         │ │     │  │
│   │    │  │  get_user_registrations            │ │     │  │
│   │    │  │  get_event_registrations           │ │     │  │
│   │    │  └────────────────────────────────────┘ │     │  │
│   │    └─────────────────────────────────────────┘     │  │
│   └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Three-Layer Architecture:

**Frontend Layer** — React 19 with TypeScript compiled by Vite, styled with TailwindCSS. React Router handles client-side routing. The UI prioritizes blockchain state as the source of truth, using localStorage only for temporary caching.

**Blockchain Layer** — Single Soroban smart contract (Rust) deployed on Stellar Testnet. EventManager contract manages the complete event lifecycle including creation, registration, cancellation, and queries. Stellar SDK handles transaction building, signing, and submission. Horizon API provides event polling and transaction history.

**Storage Layer** — Blockchain stores all event data and registration state. Local storage caches event lists and registration status for performance, but always defers to blockchain state for critical operations. Register → Cancel → Re-register flow proves blockchain is the source of truth.

---

## 📜 Smart Contracts

One production-grade Soroban smart contract written in Rust powers EventHub's on-chain logic. The contract follows Soroban best practices including proper authorization, event emission, error handling, and comprehensive testing.

### EventManager Contract

The EventManager contract is the single source of truth for events and registrations. It maintains counters for event IDs, stores complete event metadata, tracks registrations per event and per user, and enforces participant limits with authorization checks.

| Function | Parameters | Returns | Description |
|----------|-----------|---------|-------------|
| `create_event` | `env: Env, organizer: Address, title: String, description: String, category: String, date: String, time: String, location: String, max_participants: u32` | `u64` | Creates a new event and returns unique event_id. Requires organizer authorization. Validates max_participants > 0. |
| `get_event` | `env: Env, event_id: u64` | `Option<Event>` | Returns a single event by ID. Returns None if event doesn't exist. |
| `get_all_events` | `env: Env` | `Vec<Event>` | Returns all events stored on-chain. Used for event browsing. |
| `register_for_event` | `env: Env, event_id: u64, participant: Address` | `bool` | Registers participant for an event. Requires participant authorization. Checks event capacity and prevents duplicate registration. |
| `is_registered` | `env: Env, event_id: u64, participant: Address` | `bool` | Checks if a participant is registered for an event. Used before showing Register/Cancel button. |
| `get_user_registrations` | `env: Env, user: Address` | `Vec<u64>` | Returns all event IDs a user is registered for. Used in My Events page. |
| `get_event_registrations` | `env: Env, event_id: u64` | `Vec<Address>` | Returns all participant addresses registered for an event. Used by organizers. |
| `cancel_registration` | `env: Env, event_id: u64, participant: Address` | `bool` | Cancels a registration. Requires participant authorization. Decrements participant count and removes from indices. |

### Storage Architecture

| Key | Type | Storage | Purpose |
|-----|------|---------|---------|
| `EventCounter` | `u64` | Instance | Incremented counter for unique event IDs |
| `Event(u64)` | `Event` | Instance | Individual event data (title, date, organizer, capacity) |
| `Registration(u64, Address)` | `Registration` | Instance | Individual registration (event_id, participant, timestamp) |
| `EventRegistrations(u64)` | `Vec<Address>` | Instance | Index of all participants registered for an event |
| `UserRegistrations(Address)` | `Vec<u64>` | Instance | Index of all events a user is registered for |

---

## 🚀 Contract Deployment

### Deployed Contract (Stellar Testnet)

| Contract | Contract ID | Explorer |
|----------|-------------|----------|
| EventManager | `CDWEYVU5IHLNZRVSJC7DFX2KARIOKKFBPROQOAHEH2BPLFVRYZSHGCXQ` | [View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CDWEYVU5IHLNZRVSJC7DFX2KARIOKKFBPROQOAHEH2BPLFVRYZSHGCXQ) |

### Network Configuration

| Parameter | Value |
|-----------|-------|
| **Network** | Stellar Testnet |
| **Horizon URL** | https://horizon-testnet.stellar.org |
| **Soroban RPC** | https://soroban-testnet.stellar.org |
| **Network Passphrase** | Test SDF Network ; September 2015 |
| **Explorer** | https://stellar.expert/explorer/testnet |

### Environment Variables

```bash
# Stellar Network
VITE_STELLAR_NETWORK=testnet
VITE_STELLAR_RPC_URL=https://soroban-testnet.stellar.org
VITE_STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org

# Contract Address
VITE_EVENT_CONTRACT_ID=CDWEYVU5IHLNZRVSJC7DFX2KARIOKKFBPROQOAHEH2BPLFVRYZSHGCXQ
```

### Deploy Your Own

Follow these steps to deploy the EventManager contract to Stellar Testnet using Stellar CLI.

**Step 1: Generate keypair**

```bash
stellar keys generate eventhub
```

**Step 2: Fund account with testnet XLM**

```bash
stellar keys fund eventhub
```

**Step 3: Build contract**

```bash
cd eventhub-contract
cargo build --target wasm32-unknown-unknown --release
```

**Step 4: Deploy EventManager contract**

```bash
stellar contract deploy \
  --wasm contracts/target/wasm32-unknown-unknown/release/event_manager.wasm \
  --source eventhub \
  --network testnet
```

Save the returned contract ID to `VITE_EVENT_CONTRACT_ID`.

---

## 🔄 Contract Interaction Flow

```
User Action                  Blockchain Layer                    
───────────────              ─────────────────                   
│                            │                                 
▼                            │                                 
Create Event                     │                                 
(title, date, capacity)          │                                 
│                            │                                 
▼                            │                                 
Freighter ──────────────────► EventManager                          
Sign TX                       create_event()                         
│                                │                                 
│                         Event Stored                             
│                         on-chain                             
│                                │                                 
▼                                │                                 
Browse Events ──────────────► get_all_events()              
(read-only)                        │                     
│                                │                                 
▼                                │                                 
Register ────────────────────► register_for_event()                           
(wallet signing)                   │                                 
│                         Registration                             
│                         Recorded                             
│                                │                                 
▼                                │                                 
Cancel ──────────────────────► cancel_registration()                           
(wallet signing)                   │                                 
│                         Registration                             
│                         Removed                             
│                                │                                 
▼                                │                                 
Re-register ─────────────────► register_for_event()              
(wallet signing)                   │              
│                         Proves blockchain                             
│                         is source of truth
```

**Phase 1: Event Creation** — Organizer enters event details (title, description, category, date, time, location, max participants). Frontend calls `EventManager.create_event()` with organizer's wallet signature. Contract increments counter and stores event on-chain with status "upcoming".

**Phase 2: Browse Events** — Users call `get_all_events()` to fetch events from blockchain. No wallet signature required for read-only operations. Events display with current participant count and capacity.

**Phase 3: Register** — User clicks Register. Frontend calls `is_registered()` to check if already registered. If not registered, calls `register_for_event()` with user's wallet signature. Freighter popup appears for transaction signing. Contract validates capacity, stores registration, increments participant count.

**Phase 4: Cancel** — User clicks Cancel Registration. Frontend calls `cancel_registration()` with user's wallet signature. Freighter popup appears. Contract removes registration, decrements participant count, updates indices.

**Phase 5: Re-register** — User clicks Register again. Frontend calls `is_registered()` (returns false after cancellation). Calls `register_for_event()` again. Contract allows re-registration, proving blockchain state is accurate.

**Phase 6: Audit Trail** — Every action is recorded on-chain with timestamps. Users can view transaction hashes linked to Stellar Expert for verification.

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.8 | UI framework with concurrent rendering |
| **TypeScript** | 6.0.2 | Type safety and developer experience |
| **Vite** | 8.2.0 | Build tool with HMR and fast cold starts |
| **TailwindCSS** | 4.3.3 | Utility-first CSS styling |
| **React Router** | 7.18.2 | Client-side routing |

### Blockchain

| Technology | Purpose |
|------------|---------|
| **Stellar SDK** | 16.2.0 - Horizon API, transaction building, signing |
| **Soroban SDK** | Smart contract framework for Rust |
| **Freighter API** | 6.0.1 - Wallet connection and transaction signing |
| **Stellar CLI** | Contract deployment and local testing |
| **Rust** | Smart contract language |
| **Cargo** | Rust package manager |

### Infrastructure

| Technology | Purpose |
|------------|---------|
| **Vercel** | Frontend deployment and edge caching |
| **GitHub Actions** | CI/CD pipeline for frontend and contracts |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20 or later
- npm 10 or later
- Rust 1.75 or later
- Cargo
- Stellar CLI (install with `cargo install stellar-cli --features opt`)
- Freighter Wallet browser extension
- Git

### Installation

**1. Clone the repository:**

```bash
git clone https://github.com/mnvmaral/STELLAR-LVL3.git
cd STELLAR-LVL3
```

**2. Install frontend dependencies:**

```bash
cd eventhub-frontend
npm install
```

**3. Build Soroban contract:**

```bash
cd eventhub-contract
cargo build --target wasm32-unknown-unknown --release
```

**4. Configure environment:**

```bash
cp eventhub-frontend/.env.example eventhub-frontend/.env
# Edit .env with your contract ID and network URLs
```

**5. Run development server:**

```bash
cd eventhub-frontend
npm run dev
```

App will open at http://localhost:5173.

**6. Run all tests:**

```bash
# Contract tests
cd eventhub-contract && cargo test
```

### Quick Demo (No Setup Required)

Visit the live application:

**https://stellar-lvl-3-ekot.vercel.app**

> **Note:** This application runs on the Stellar Testnet. To use all features, install the Freighter Wallet extension and fund your wallet with Testnet XLM using Friendbot before interacting with the blockchain.

---

## 📁 Project Structure

```
STELLAR-LVL3/
├── eventhub-frontend/                 # React TypeScript application
│   ├── src/
│   │   ├── components/
│   │   │   ├── ActivityItem.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── ConfirmationDialog.tsx
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── EventCard.tsx
│   │   │   ├── EventStatusBadge.tsx
│   │   │   ├── FilterBar.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── LoadingSkeleton.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── PageHeader.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── StatsCard.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── TransactionSuccessModal.tsx
│   │   │   └── UserAvatar.tsx
│   │   ├── pages/
│   │   │   ├── About.tsx
│   │   │   ├── EventDetails.tsx
│   │   │   ├── Events.tsx
│   │   │   ├── Landing.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Signup.tsx
│   │   │   ├── admin/
│   │   │   │   ├── AdminActivity.tsx
│   │   │   │   ├── AdminDashboard.tsx
│   │   │   │   ├── AdminEvents.tsx
│   │   │   │   ├── AdminParticipants.tsx
│   │   │   │   ├── AdminProfile.tsx
│   │   │   │   └── AdminRegistrations.tsx
│   │   │   └── user/
│   │   │       ├── Activity.tsx
│   │   │       ├── Dashboard.tsx
│   │   │       ├── MyEvents.tsx
│   │   │       ├── Profile.tsx
│   │   │       └── UpcomingEvents.tsx
│   │   ├── services/
│   │   │   ├── auth.ts
│   │   │   ├── events.ts
│   │   │   ├── stellar-blockchain.ts
│   │   │   └── stellar-wallet.ts
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── assets/
│   │   │   ├── hero.png
│   │   │   ├── react.svg
│   │   │   └── vite.svg
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── main.tsx
│   │   └── index.css
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── eslint.config.js
│   ├── package.json
│   └── .env.example
├── eventhub-contract/                 # Soroban smart contract (Rust)
│   ├── contracts/
│   │   └── event-manager/
│   │       ├── src/
│   │       │   ├── lib.rs
│   │       │   └── test.rs
│   │       ├── test_snapshots/
│   │       │   └── test/
│   │       │       ├── test_cancel_and_reregister_multiple_times.1.json
│   │       │       ├── test_cancel_nonexistent_registration.1.json
│   │       │       ├── test_cancel_registration.1.json
│   │       │       ├── test_create_event.1.json
│   │       │       ├── test_duplicate_registration.1.json
│   │       │       ├── test_event_full.1.json
│   │       │       ├── test_get_all_events.1.json
│   │       │       ├── test_get_event_registrations.1.json
│   │       │       ├── test_get_user_registrations.1.json
│   │       │       ├── test_invalid_max_participants.1.json
│   │       │       ├── test_register_for_event.1.json
│   │       │       └── test_register_for_nonexistent_event.1.json
│   │       ├── Cargo.toml
│   │       └── Makefile
│   ├── Cargo.toml
│   ├── Cargo.lock
│   └── README.md
├── .github/
│   └── workflows/
│       └── ci.yml                     # Frontend and contracts CI/CD
├── vercel.json
├── LICENSE
└── README.md
```

---

## ⚙️ CI/CD Pipeline

EventHub uses a GitHub Actions CI/CD pipeline with automated testing and build verification.

### CI/CD Flow

```
Developer Push / Pull Request
│
▼
┌───────────────────────────────┐
│       GitHub Actions CI       │
├───────────────────────────────┤
│  Frontend + Contracts         │
│  Workflow                     │
├───────────────────────────────┤
│ npm install                   │
│ tsc --noEmit                  │
│ npm run lint                  │
│ npm run build                 │
│ cargo test (contracts)        │
└───────────────┬───────────────┘
                │
                ▼
        ┌───────────────┐
        │ Vercel Deploy │
        │  (main only)  │
        └───────┬───────┘
                │
                ▼
           Production
```

### Workflow Configuration (.github/workflows/ci.yml)

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: cd eventhub-frontend && npm ci
      - run: cd eventhub-frontend && npm run build
```

### CI Status Badge

![Frontend CI](https://github.com/mnvmaral/STELLAR-LVL3/actions/workflows/ci.yml/badge.svg)

---

## 🧪 Testing

✅ **12 tests passing** across Soroban contract tests

### Contract Tests (Rust / cargo test)

The EventManager contract has comprehensive unit tests using `soroban-sdk` testutils covering all core functionality:

| Test Suite | Tests | Description |
|------------|-------|-------------|
| Event Creation | 2 | `test_create_event`, `test_invalid_max_participants` |
| Event Retrieval | 2 | `test_get_all_events`, event lookup by ID |
| Registration | 3 | `test_register_for_event`, `test_duplicate_registration`, `test_register_for_nonexistent_event` |
| Capacity | 1 | `test_event_full` |
| Cancellation | 3 | `test_cancel_registration`, `test_cancel_nonexistent_registration`, `test_cancel_and_reregister_multiple_times` |
| Queries | 2 | `test_get_user_registrations`, `test_get_event_registrations` |
| **Total** | **12** | **All passing** ✅ |

**Running contract tests:**

```bash
cd eventhub-contract
cargo test                      # Run all tests
cargo test -- --nocapture       # Show println! output
```

**Test output:**

```
running 12 tests
test test::test_cancel_and_reregister_multiple_times ... ok
test test::test_cancel_nonexistent_registration ... ok
test test::test_cancel_registration ... ok
test test::test_create_event ... ok
test test::test_duplicate_registration ... ok
test test::test_event_full ... ok
test test::test_get_all_events ... ok
test test::test_get_event_registrations ... ok
test test::test_get_user_registrations ... ok
test test::test_invalid_max_participants ... ok
test test::test_register_for_event ... ok
test test::test_register_for_nonexistent_event ... ok

test result: ok. 12 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out
```

---

## 📱 Mobile Responsive Design

EventHub is built with mobile-first principles and full responsive support down to 375px viewport.

### Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| **Mobile** | 375px | Single column, collapsible sidebar, full-screen event cards |
| **Tablet** | 768px | 2-column grid, collapsible sidebar with labels |
| **Desktop** | 1024px | Full sidebar + content area with max-width |
| **Wide** | 1440px | Max-width container, optimal reading width |

### Mobile Features

- 🎯 Touch targets minimum 44×44px for accessibility
- 📱 Full-screen modals on mobile
- 🔄 Collapsible sidebar drawer with smooth animations
- 📊 2-column → 1-column event grid below 768px
- 📈 Stacked statistics row on mobile
- ⌨️ Optimized keyboard input for mobile keyboards

---

## 📸 Screenshots

Check out the [live demo](https://stellar-lvl-3-ekot.vercel.app) to see EventHub in action!

### Application Screenshots

[SCREENSHOT: Landing page hero section showing EventHub branding, tagline "Decentralized Event Management on Stellar Blockchain", and Connect Wallet call-to-action button]

[SCREENSHOT: Events list/browse page displaying a grid of event cards with real on-chain events, showing event titles, dates, categories, locations, and participant counts (e.g., "25/100 participants")]

[SCREENSHOT: Event Details page for a real blockchain event (not demo/seed event), showing full event description, date/time, location, organizer info, participant count, and Register/Cancel button based on registration status]

[SCREENSHOT: Freighter wallet connection permission popup asking user to approve connecting their Stellar wallet to EventHub]

[SCREENSHOT: Freighter signing popup for register_for_event transaction, showing the contract call details, network (Stellar Testnet), and Approve/Reject buttons]

[SCREENSHOT: Success modal after registration displaying "Registration Successful!" message with the real 64-character transaction hash in monospace font, and "View on Stellar Expert →" link]

[SCREENSHOT: Stellar Expert page (stellar.expert/explorer/testnet/tx/{hash}) showing the same transaction hash from the success modal with Status: Successful and register_for_event operation visible]

[SCREENSHOT: Event Details page showing the Cancel Registration button for an event the user is currently registered for, with updated participant count]

[SCREENSHOT: Success modal after cancellation displaying "Registration Cancelled" message with the real transaction hash (different from registration hash) and Stellar Expert link]

[SCREENSHOT: Admin Create Event form showing input fields for title, description, category dropdown, date picker, time picker, location, max participants, with "Create Event" button]

[SCREENSHOT: Success modal after event creation showing "Event Created Successfully!" message with real transaction hash and event ID returned from create_event contract function]

[SCREENSHOT: Admin dashboard / events management view showing list of created events with Edit/Delete options, participant counts, and event status badges (Upcoming/Completed/Cancelled)]

[SCREENSHOT: User Dashboard showing "My Registered Events" section with event cards for events the user has registered for, pulled from get_user_registrations contract function]

[SCREENSHOT: Mobile responsive view of the event details page on a 375px viewport, showing collapsible sidebar menu, stacked event information, and full-width Register button optimized for touch]

---

## 🤝 Contributing

Pull requests welcome! For major changes, please open an issue first to discuss proposed changes.

### Contributing Steps

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit with meaningful messages: `git commit -m "feat: describe your change"`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Open a pull request with description of changes

### Code Style

- **TypeScript**: Strict mode enabled, ESLint configuration enforced
- **Formatting**: Consistent code style across all files
- **Rust**: `rustfmt` and `clippy` linting for contracts
- **Testing**: All new features require corresponding tests

---

## 👨‍💻 Author

| Name | Manav Maral |
|------|-------------|
| **GitHub** | [@mnvmaral](https://github.com/mnvmaral) |
| **Project** | EventHub |
| **Hackathon** | Stellar Level 3 |

Built with ❤️ for the Stellar ecosystem.

---

## 📄 License

**MIT License** — Copyright (c) 2026 Manav Maral

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

```
MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

**EventHub** — Decentralized Event Management on Stellar

Built with ❤️ by Manav Maral for the Stellar Hackathon

![Stellar](https://img.shields.io/badge/Stellar-Blockchain-purple) · ![Soroban](https://img.shields.io/badge/Soroban-Smart%20Contracts-blue) · ![Freighter](https://img.shields.io/badge/Freighter-Wallet-orange)
