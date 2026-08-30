# Quick Test Guide - Complete Lifecycle

## ✅ Ready to Test: http://localhost:5173/

---

## Test: Register → Cancel → Register Again

### Setup
- Login: `user@eventhub.com` / `password`
- Event: "Blockchain Summit 2027" (Event ID 4)
- Freighter: Unlocked on Testnet

---

### Step 1: Register
1. Open event → Click "Register for Event"
2. **EXPECT:** Freighter signing popup
3. Approve
4. **EXPECT:** Success modal with 64-char hash
5. Click "View on Stellar Expert →"
6. **VERIFY:** Function = `register_for_event`, Status = SUCCESS
7. **VERIFY:** "✓ You're registered" shown

### Step 2: Cancel
1. Click "Cancel Registration"
2. **EXPECT:** Freighter signing popup
3. Approve
4. **EXPECT:** Success modal with DIFFERENT 64-char hash
5. Click "View on Stellar Expert →"
6. **VERIFY:** Function = `cancel_registration`, Status = SUCCESS
7. **VERIFY:** "Register for Event" button shown (not registered anymore)

### Step 3: Register Again
1. Click "Register for Event" again
2. **EXPECT:** Freighter signing popup (proves blockchain allowed it)
3. Approve
4. **EXPECT:** Success modal with NEW 64-char hash (third unique hash)
5. **VERIFY:** "✓ You're registered" shown again

### Step 4: Reject Test
1. Navigate to different event
2. Click "Register for Event"
3. **REJECT** in Freighter popup
4. **VERIFY:** Error toast, NO success modal, NO hash, still unregistered

### Step 5: Refresh Test
1. Hard refresh page (Cmd+Shift+R)
2. **VERIFY:** "Blockchain Summit 2027" still shows registered
3. **VERIFY:** Rejected event still shows unregistered
4. **THIS PROVES:** Blockchain is source of truth

---

## Available Test Events

| ID | Title | Max Participants |
|----|-------|------------------|
| 1 | Event1 | 100 |
| 2 | Event2 | 100 |
| 3 | Event3 | 100 |
| 4 | Blockchain Summit 2027 | 300 |
| 5 | AI & Machine Learning Workshop | 50 |

Test the lifecycle with each event independently.

---

## What to Verify

### ✅ Freighter Popups
- Register → Freighter signing popup
- Cancel → Freighter signing popup
- Create Event → Freighter signing popup

### ✅ Success Modals
- Show after every approved transaction
- Display full 64-character hash
- "View on Stellar Expert →" link works
- Each transaction gets unique hash

### ✅ Stellar Expert Verification
- Status: SUCCESS (green)
- Contract: `CDWEYVU5IHLNZRVSJC7DFX2KARIOKKFBPROQOAHEH2BPLFVRYZSHGCXQ`
- Function: Matches action (register_for_event, cancel_registration, create_event)
- Your wallet address visible in parameters

### ✅ Blockchain as Source of Truth
- After cancel, can register again (blockchain allows it)
- After refresh, state is preserved (read from blockchain)
- localStorage cleared → state still correct (from blockchain)
- Rejected transactions don't fake success

---

## Contract Info

**New Contract ID:** `CDWEYVU5IHLNZRVSJC7DFX2KARIOKKFBPROQOAHEH2BPLFVRYZSHGCXQ`

**Functions:**
- ✅ `create_event` - Create event on-chain
- ✅ `register_for_event` - Register for event
- ✅ `cancel_registration` - Cancel registration (NEW)
- ✅ `is_registered` - Check if registered
- ✅ `get_all_events` - Get all events
- ✅ `get_event` - Get single event
- ✅ `get_user_registrations` - Get user's events
- ✅ `get_event_registrations` - Get event's participants

---

## Success Criteria

The lifecycle works correctly when:
1. ✅ Every write triggers Freighter signing popup
2. ✅ Every approved transaction returns REAL 64-char hash
3. ✅ Every hash verifiable on Stellar Expert
4. ✅ Can cancel and re-register for same event
5. ✅ Blockchain state survives refresh/localStorage clear
6. ✅ Rejected transactions show error, not fake success

**If all 6 criteria pass → Implementation is complete!**
