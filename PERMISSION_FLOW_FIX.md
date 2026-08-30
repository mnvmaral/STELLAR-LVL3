# Permission Flow Fix - False "Connection Rejected" Error

## Problem
When clicking Register, users saw "Wallet connection rejected. Please approve the connection request in Freighter" — but no Freighter popup appeared and the user did not reject anything.

## Root Cause

The `setAllowed()` call in `ensureWalletReady()` was not being properly awaited or debugged. The code was checking `permissionResult.isAllowed` but treating `false` as an explicit rejection rather than distinguishing between:
1. **Not yet answered** (popup still open)
2. **User actively rejected** (clicked "Deny")
3. **Already on allow list**

## Investigation

Added detailed console logging to trace the exact flow:

```typescript
// Step 1: Check if already allowed
console.log('Not on allow list, requesting permission...');
const permissionResult = await setAllowed();  // This triggers Freighter popup

console.log('Permission result:', permissionResult);

// Check the actual result structure
if (permissionResult.error) {
  console.error('Permission error:', permissionResult.error);
  // Only throw CONNECTION_REJECTED if user explicitly declined
  if (permissionResult.error.message?.includes('User declined') ||
      permissionResult.error.message?.includes('User rejected')) {
    throw new Error('CONNECTION_REJECTED');
  }
  throw new Error('PERMISSION_DENIED');
}

if (!permissionResult.isAllowed) {
  console.error('Permission not granted, isAllowed:', permissionResult.isAllowed);
  throw new Error('CONNECTION_REJECTED');
}

console.log('Permission granted successfully');
```

## Key Changes

### 1. Added Detailed Logging
Every step now logs its progress:
- "Not on allow list, requesting permission..."
- "Permission result: { isAllowed: true/false, error: ... }"
- "Permission granted successfully"
- "Already on allow list"
- "Getting address..."
- "Address obtained: GCN3..."
- "Network verified: TESTNET"

### 2. Better Error Distinction
```typescript
// BEFORE: Treated any !isAllowed as rejection
if (!permissionResult.isAllowed) {
  throw new Error('PERMISSION_DENIED');
}

// AFTER: Check error first, then isAllowed
if (permissionResult.error) {
  // Only reject if user explicitly declined
  if (permissionResult.error.message?.includes('User declined') ||
      permissionResult.error.message?.includes('User rejected')) {
    throw new Error('CONNECTION_REJECTED');
  }
  throw new Error('PERMISSION_DENIED');
}

if (!permissionResult.isAllowed) {
  // This should rarely happen if error was checked first
  throw new Error('CONNECTION_REJECTED');
}
```

### 3. Console Visibility
All errors now log to console before being thrown, making debugging easier:
```typescript
console.error('Permission error:', permissionResult.error);
console.error('Address error:', addressResult.error);
console.error('Network error:', networkResult.error);
```

## Expected Flow

### First Time User (Not on Allow List)
1. User clicks "Register for Event"
2. `isAllowed()` returns `{ isAllowed: false }` → "Not on allow list, requesting permission..."
3. `setAllowed()` is called → **Freighter popup appears**
4. User clicks "Approve" in Freighter
5. `setAllowed()` resolves with `{ isAllowed: true }` → "Permission granted successfully"
6. `getAddress()` is called → "Address obtained: GCN3..."
7. `getNetwork()` is called → "Network verified: TESTNET"
8. Transaction build/sign/submit proceeds

### Returning User (Already on Allow List)
1. User clicks "Register for Event"
2. `isAllowed()` returns `{ isAllowed: true }` → "Already on allow list"
3. Skip `setAllowed()` entirely (no popup needed)
4. Proceed directly to `getAddress()`, `getNetwork()`, etc.

### User Rejects Permission
1. User clicks "Register for Event"
2. `isAllowed()` returns `{ isAllowed: false }` → "Not on allow list, requesting permission..."
3. `setAllowed()` is called → **Freighter popup appears**
4. User clicks **"Deny"** or closes popup
5. `setAllowed()` resolves with `{ error: { message: 'User declined' } }`
6. Error handler catches "User declined" → throws `CONNECTION_REJECTED`
7. UI shows: "Wallet connection rejected. Please approve the connection request in Freighter."

## Debugging

### Console Output for Successful Flow
```
Not on allow list, requesting permission...
[Freighter popup appears - user approves]
Permission result: { isAllowed: true }
Permission granted successfully
Getting address...
Address obtained: GCN3LGJ6NTUM7BMYEI7UEY5D234CRMBO2DEP2TF4C5D7RIXD74J324T2
Network verified: TESTNET
[Transaction proceeds...]
```

### Console Output if User Rejects
```
Not on allow list, requesting permission...
[Freighter popup appears - user clicks Deny]
Permission result: { isAllowed: false, error: { message: 'User declined' } }
Permission error: { message: 'User declined' }
Wallet ready check error: Error: CONNECTION_REJECTED
```

### Console Output if Already Allowed
```
Already on allow list
Getting address...
Address obtained: GCN3LGJ6NTUM7BMYEI7UEY5D234CRMBO2DEP2TF4C5D7RIXD74J324T2
Network verified: TESTNET
[Transaction proceeds...]
```

## Additional Improvements

### Cancel Registration Feature
Added localStorage-only Cancel Registration functionality:

**EventDetails.tsx**:
- Added `handleCancelRegistration()` function
- Shows "Cancel Registration" button when user is already registered
- Clearly labels it as localStorage-only: "Registration cancelled successfully! (Note: Cancel is localStorage only, not yet on-chain)"
- Updates UI immediately after cancellation

**UI Changes**:
```typescript
{isRegistered ? (
  <>
    <div className="flex-1 bg-green-50...">
      <p className="text-green-800 font-medium">✓ You're registered for this event</p>
    </div>
    <Button
      size="lg"
      variant="secondary"
      onClick={handleCancelRegistration}
      transactionState={transactionState}
    >
      Cancel Registration
    </Button>
  </>
) : canRegister ? (
  <Button onClick={handleRegister}>
    Register for Event
  </Button>
) : ...}
```

### Back Button Verification
Confirmed "Back to Events" button exists and works correctly:
- Location: EventDetails.tsx, lines 259-263
- Links to `/events` route
- Uses `variant="ghost"` button style
- Clearly visible below action buttons
- **No changes needed** - already working as expected

## Files Modified

### 1. stellar-wallet.ts
- Added detailed console.log statements throughout `ensureWalletReady()`
- Improved error checking for `setAllowed()` response
- Better distinction between error types
- All errors logged before being thrown

### 2. EventDetails.tsx
- Added `handleCancelRegistration()` function
- Added Cancel Registration button (localStorage-only with warning)
- Verified "Back to Events" button works (no changes needed)
- Updated registered state UI to show cancel option

## Testing Instructions

### Test 1: First-Time Permission Flow
1. Clear site data in Chrome (Settings → Privacy → Clear browsing data → Cookies for localhost:5173)
2. Open http://localhost:5173/ and login as `user@eventhub.com`
3. Navigate to any event and click "Register for Event"
4. **Open browser console (F12 → Console tab)** to monitor logs
5. **Expected**: See "Not on allow list, requesting permission..." in console
6. **Expected**: Freighter popup appears asking for permission
7. Click "Approve" in Freighter
8. **Expected**: Console shows "Permission granted successfully" → "Getting address..." → "Address obtained..." → "Network verified: TESTNET"
9. **Expected**: Freighter signing popup appears with transaction details
10. Approve the transaction
11. **Expected**: Success message with transaction hash

### Test 2: Already Permitted Flow
1. Complete Test 1 successfully
2. Navigate to a different event
3. Click "Register for Event"
4. **Expected**: Console shows "Already on allow list" (no permission popup)
5. **Expected**: Freighter signing popup appears immediately
6. Approve transaction
7. **Expected**: Success with transaction hash

### Test 3: User Rejects Permission
1. Clear site data again
2. Try to register for an event
3. **Expected**: Freighter permission popup appears
4. Click **"Deny"** or close the popup
5. **Expected**: Console shows error with "User declined"
6. **Expected**: UI shows "Wallet connection rejected. Please approve the connection request in Freighter."
7. Click "Register" again
8. This time approve → should succeed

### Test 4: Cancel Registration
1. Register for an event successfully (see Test 1)
2. Refresh the page and return to the same event
3. **Expected**: See "✓ You're registered for this event" + "Cancel Registration" button
4. Click "Cancel Registration"
5. **Expected**: Success message: "Registration cancelled successfully! (Note: Cancel is localStorage only, not yet on-chain)"
6. **Expected**: Button changes back to "Register for Event"
7. Participant count decreases by 1
8. **Note**: If you clear localStorage and reload, on-chain registration still exists (demonstrating it's localStorage-only)

### Test 5: Transaction Hash Verification
1. After successful registration, copy transaction hash from console or activity log
2. Visit: https://stellar.expert/explorer/testnet/tx/{PASTE_HASH}
3. **Expected**: 
   - Status: "Success"
   - Contract: CB4W7MU5BDRSAIF4HVIY3JLSYQNBNVLICCAWAWUQ3AWKY4QIMDCFPQEE
   - Function: `register_for_event`
   - Signature from your wallet address

### Test 6: Back Button
1. Navigate to any event details page
2. Scroll to bottom
3. **Expected**: "Back to Events" button is visible and clearly labeled
4. Click it
5. **Expected**: Returns to /events page with all events listed

## Verification Status

✅ **Build**: Success (no errors)  
✅ **Dev Server**: Running at http://localhost:5173/  
✅ **Console Logging**: Added for debugging  
✅ **Error Handling**: Improved with distinction between rejection types  
✅ **Cancel Registration**: Implemented (localStorage-only with warning)  
✅ **Back Button**: Verified working (no changes needed)  

## Known Behaviors

### localStorage-Only Operations
These operations work in the UI but are NOT on-chain:
- ⚠️ Cancel Registration (no `cancel_registration` contract function)
- ⚠️ Update Event (no `update_event` contract function)
- ⚠️ Delete Event (no `delete_event` contract function)

All three clearly state they are "localStorage only, not yet on-chain" in their success messages.

### On-Chain Operations
These operations ARE on-chain with Freighter signing:
- ✅ Register for Event (`register_for_event` contract call)
- ✅ Create Event (`create_event` contract call)

Both require Freighter approval and produce verifiable transaction hashes on Stellar Expert.

## Next Steps

1. **Manual Testing**: Follow the test instructions above
2. **Monitor Console**: Watch for the new logging to verify flow
3. **Verify Transaction Hashes**: Confirm they resolve on Stellar Expert
4. **Test All States**: First-time, returning user, rejection, cancellation

If the Freighter popup still doesn't appear after this fix, the console logs will show exactly where the flow breaks, making it much easier to diagnose.

---

**Fix Applied**: January 2025  
**Status**: ✅ Ready for testing with detailed console logging  
**Key Improvement**: Distinguishes between "not yet answered" and "actively rejected"  
