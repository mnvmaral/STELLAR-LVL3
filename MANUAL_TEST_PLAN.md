# Manual Test Plan - Freighter Wallet Integration

## Prerequisites
- Freighter wallet extension installed in Chrome
- Wallet configured for Stellar Testnet
- Test wallet address: GCN3LGJ6NTUM7BMYEI7UEY5D234CRMBO2DEP2TF4C5D7RIXD74J324T2 (funded with 10,000 Testnet XLM)
- Frontend running at http://localhost:5173/

## Test Scenarios

### 1. Login/Browse Without Wallet Popup ✓
**Expected**: No Freighter popup should appear during login or browsing

**Steps**:
1. Open http://localhost:5173/
2. Click "Login" button
3. Enter credentials: `user@eventhub.com` / any password
4. Click "Login"
5. Browse to "Dashboard"
6. Browse to "Events"
7. Click on any event to view details

**Success Criteria**:
- No Freighter popup at any point
- You can navigate freely through all read-only pages
- Event details display correctly

---

### 2. Register for Event - Happy Path ✅
**Expected**: Freighter permission popup → signing popup → confirmed transaction

**Steps**:
1. Log in as user: `user@eventhub.com`
2. Navigate to "Events"
3. Click on any event (e.g., "Summer Cultural Festival 2026")
4. Click "Register for Event" button
5. **Freighter Permission Popup** should appear if first time
   - Click "Approve" or "Connect"
6. **Freighter Network Check** happens automatically
   - If wrong network, error message: "Wrong network selected. Please switch to Stellar Testnet"
7. **Freighter Signing Popup** appears showing transaction details
   - Review the transaction
   - Click "Sign" to approve
8. App shows "pending" state with spinner
9. Transaction is submitted to Stellar Testnet
10. App polls for confirmation (may take 5-10 seconds)
11. Success message displays: "Successfully registered for event!"
12. Transaction hash should be visible in browser console or activity log

**Success Criteria**:
- Freighter popup appears for permission (first time only)
- Freighter signing popup appears with transaction details
- After approval, success message shows
- Participant count increases by 1
- Registration persists after page refresh
- Transaction hash can be verified on Stellar Expert: https://stellar.expert/explorer/testnet/tx/{HASH}

**Error Handling to Verify**:
- If you reject the permission request: "Wallet connection rejected" error
- If you reject the signing request: "Transaction rejected" error
- If wallet is locked: "Wallet is locked. Please unlock Freighter" error

---

### 3. Register for Event - User Rejection ❌→✓
**Expected**: Clear failure state, then retry works

**Steps**:
1. Log in as user: `user@eventhub.com`
2. Navigate to a different event than Test 2
3. Click "Register for Event"
4. When Freighter signing popup appears, click **"Reject"** or close the popup
5. Verify error message: "Transaction rejected. Please approve the transaction in Freighter to complete registration."
6. Verify registration did NOT complete (participant count unchanged)
7. Click "Register for Event" button again
8. This time, **approve** the transaction in Freighter
9. Verify success message appears
10. Verify registration completed successfully

**Success Criteria**:
- Rejection shows clear error message
- State does not update on rejection
- Retry works immediately without page refresh
- Approval after rejection succeeds normally

---

### 4. Create Event (Admin) - Happy Path ✅
**Expected**: Freighter permission → signing popup → confirmed on-chain event

**Steps**:
1. Log out if logged in
2. Log in as admin: `admin@eventhub.com` / any password
3. Navigate to "Admin Dashboard" → "Events"
4. Click "Create Event" button
5. Fill in form:
   - Title: "Test Blockchain Event {timestamp}"
   - Description: "Testing blockchain integration"
   - Category: "Tech"
   - Date: Select a future date
   - Time: "18:00"
   - Location: "Test Location"
   - Organizer: "Test Organizer"
   - Max Participants: 50
6. Click "Create Event" button
7. **Freighter Permission Popup** (if first time as admin)
8. **Freighter Signing Popup** appears
   - Review transaction
   - Click "Sign"
9. App shows "pending" state
10. Transaction submits and polls for confirmation
11. Success message: "Event created successfully on blockchain!"
12. New event appears in events list
13. Transaction hash appears in activity log

**Success Criteria**:
- Freighter signing popup appears
- Success message confirms blockchain creation
- Event ID format: `event-{number}` (from blockchain)
- Event persists after page refresh
- Transaction hash verifiable on Stellar Expert
- Activity log shows: "Event created on blockchain (TX: {hash}...)"

---

### 5. Create Event - Network Error Handling 🌐
**Expected**: Clear error if wrong network selected

**Steps**:
1. In Freighter extension, switch network to **Mainnet** or **Futurenet**
2. As admin, try to create a new event
3. Fill in the form and click "Create Event"
4. After permission (if needed), before signing popup

**Expected Result**:
- Error message: "Wrong network selected. Please switch to Stellar Testnet in Freighter."
- No signing popup appears
- No event is created

**Recovery**:
1. Switch Freighter back to **Testnet**
2. Retry creation
3. Should succeed normally

---

### 6. Already Registered Error 🚫
**Expected**: Clear error if trying to register twice

**Steps**:
1. As user, register for an event successfully (see Test 2)
2. Refresh the page
3. Navigate back to the same event
4. Try to click "Register for Event" again

**Expected Result**:
- Button should show "You're registered for this event" (prevented by UI)
- OR if somehow triggered: "You are already registered for this event" error

---

### 7. Event Full Error 🚫
**Expected**: Clear error if event is at capacity

**Steps**:
1. As admin, create an event with Max Participants = 1
2. As user, register for that event (should succeed)
3. Log out, create a second test user account
4. As second user, try to register for the same event

**Expected Result**:
- Error message: "Event is full. Registration is no longer available."
- Participant count stays at max
- No blockchain transaction is submitted

---

### 8. Wallet Not Installed ❌
**Expected**: Clear instructions if Freighter not installed

**Steps**:
1. Disable or uninstall Freighter extension
2. Try to register for an event or create an event

**Expected Result**:
- Error message: "Freighter wallet not installed. Please install Freighter extension to continue."
- Provides clear next steps

---

### 9. Wallet Locked 🔒
**Expected**: Clear instructions if wallet is locked

**Steps**:
1. Lock Freighter wallet (click lock icon in extension)
2. Try to register for an event

**Expected Result**:
- Error message: "Wallet is locked. Please unlock Freighter and try again."
- After unlocking, retry works immediately

---

### 10. Update Event (localStorage only) ⚠️
**Expected**: Update works but does NOT trigger blockchain

**Steps**:
1. As admin, navigate to "Events"
2. Click "Edit" on an existing event
3. Change the title or description
4. Click "Update Event"

**Expected Result**:
- Success message: "Event updated successfully! (Note: Update is localStorage only, not on-chain)"
- Changes appear immediately
- **No Freighter popup appears**
- Changes do NOT persist after clearing localStorage
- Original blockchain event data unchanged (verify on Stellar Expert)

---

### 11. Delete Event (localStorage only) ⚠️
**Expected**: Delete works but does NOT trigger blockchain

**Steps**:
1. As admin, navigate to "Events"
2. Click "Delete" on an event
3. Confirm deletion

**Expected Result**:
- Success message: "Event deleted successfully! (Note: Delete is localStorage only, not on-chain)"
- Event removed from UI
- **No Freighter popup appears**
- Event reappears if you clear localStorage and reload from blockchain
- Event still exists on-chain (check contract via Stellar Expert)

---

### 12. Transaction Hash Verification 🔍
**Expected**: All blockchain transactions are verifiable on Stellar Expert

**Steps**:
1. Complete a registration (Test 2) or event creation (Test 4)
2. Note the transaction hash from:
   - Browser console logs
   - Activity feed
   - Success message (if visible)
3. Visit: https://stellar.expert/explorer/testnet/tx/{TRANSACTION_HASH}

**Success Criteria**:
- Transaction appears on Stellar Expert
- Status: "Success"
- Contract ID matches: CB4W7MU5BDRSAIF4HVIY3JLSYQNBNVLICCAWAWUQ3AWKY4QIMDCFPQEE
- Function called matches: `create_event` or `register_for_event`
- Signature address matches your test wallet

---

### 13. Page Refresh Persistence 🔄
**Expected**: Blockchain data persists, localStorage-only data does not

**Steps**:
1. Register for an event (blockchain)
2. Note the participant count
3. Clear browser localStorage: `localStorage.clear()` in console
4. Refresh the page
5. Navigate back to the event

**Expected Result**:
- Your registration still shows (data from blockchain)
- Participant count correct (from blockchain)
- Seeded events ("Summer Cultural Festival", "Annual Marathon") may disappear (localStorage only)

---

## Summary Checklist

- [ ] Login triggers no Freighter popup
- [ ] Browse dashboard/events triggers no popup
- [ ] Register for event triggers permission check then signing popup
- [ ] Rejecting Freighter permission shows clear error
- [ ] Rejecting Freighter signing shows clear error
- [ ] Approved registration creates confirmed transaction with hash
- [ ] Create event (admin) triggers permission check then signing popup
- [ ] Approved event creation creates confirmed transaction with hash
- [ ] Wrong network selected shows clear error before signing
- [ ] Already registered shows appropriate error
- [ ] Event full shows appropriate error
- [ ] Wallet not installed shows clear instructions
- [ ] Wallet locked shows clear instructions
- [ ] Update event does NOT trigger Freighter (localStorage only, with warning)
- [ ] Delete event does NOT trigger Freighter (localStorage only, with warning)
- [ ] All transaction hashes are verifiable on Stellar Expert
- [ ] Blockchain data persists after page refresh
- [ ] localStorage-only changes do not persist after clearing cache

---

## Debugging Tips

**If Freighter popup never appears:**
1. Check browser console for errors
2. Verify Freighter extension is installed and unlocked
3. Check Network tab for failed RPC calls
4. Verify contract ID in .env matches deployed contract

**If transaction fails:**
1. Check wallet has sufficient XLM balance (need >1 XLM for fees)
2. Verify network is Testnet in Freighter
3. Check contract ID is correct
4. View transaction on Stellar Expert for specific error

**If transaction succeeds but UI doesn't update:**
1. Check browser console for polling errors
2. Verify transaction status on Stellar Expert
3. Refresh page to reload from blockchain

---

## Expected Console Output

Successful registration should show:
```
Wallet ready check: { address: 'GCN3...', network: 'TESTNET' }
Transaction submitted: { hash: 'abc123...', status: 'PENDING' }
Transaction confirmed: { status: 'SUCCESS', eventId: 3 }
```

Error should show:
```
Register event error: Error: TRANSACTION_REJECTED
```

---

**Test Date**: {Current Date}
**Tested By**: {Your Name}
**Frontend Version**: {Git commit hash}
**Contract ID**: CB4W7MU5BDRSAIF4HVIY3JLSYQNBNVLICCAWAWUQ3AWKY4QIMDCFPQEE
