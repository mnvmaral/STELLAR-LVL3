# Vercel Deployment Guide

## ✅ Repository Fixed and Ready for Deployment

All changes have been committed and pushed to GitHub: `mnvmaral/STELLAR-LVL3`

---

## Automatic Deployment (Recommended)

Vercel will automatically deploy from your GitHub repository when you:

1. **Go to Vercel Dashboard:** https://vercel.com/dashboard
2. **Click "Add New Project"**
3. **Import from Git:** Select `mnvmaral/STELLAR-LVL3`
4. **Configure Project:**
   - **Framework Preset:** Vite
   - **Root Directory:** Leave as default (vercel.json handles this)
   - **Build Command:** `cd eventhub-frontend && npm install && npm run build` (auto-configured in vercel.json)
   - **Output Directory:** `eventhub-frontend/dist` (auto-configured in vercel.json)
   
5. **Add Environment Variables:** (CRITICAL - deployment will fail without these)
   ```
   VITE_STELLAR_NETWORK=testnet
   VITE_STELLAR_RPC_URL=https://soroban-testnet.stellar.org
   VITE_STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
   VITE_EVENT_CONTRACT_ID=CDWEYVU5IHLNZRVSJC7DFX2KARIOKKFBPROQOAHEH2BPLFVRYZSHGCXQ
   ```

6. **Click "Deploy"**

---

## Manual Deployment (CLI)

If you prefer using Vercel CLI:

### Step 1: Link Project (One-Time)
```bash
cd "/Users/asha/Desktop/MyPCFolder/Manav Stellar"
vercel link
```

Follow prompts to link to existing project or create new one.

### Step 2: Set Environment Variables (One-Time)
```bash
vercel env add VITE_STELLAR_NETWORK production
# Enter: testnet

vercel env add VITE_STELLAR_RPC_URL production
# Enter: https://soroban-testnet.stellar.org

vercel env add VITE_STELLAR_HORIZON_URL production
# Enter: https://horizon-testnet.stellar.org

vercel env add VITE_EVENT_CONTRACT_ID production
# Enter: CDWEYVU5IHLNZRVSJC7DFX2KARIOKKFBPROQOAHEH2BPLFVRYZSHGCXQ
```

### Step 3: Deploy
```bash
vercel --prod
```

---

## Vercel Configuration (Already in Repo)

**File: `vercel.json`**
```json
{
  "buildCommand": "cd eventhub-frontend && npm install && npm run build",
  "devCommand": "cd eventhub-frontend && npm run dev",
  "installCommand": "cd eventhub-frontend && npm install",
  "framework": "vite",
  "outputDirectory": "eventhub-frontend/dist"
}
```

This tells Vercel to:
- Build from the `eventhub-frontend` subdirectory
- Use Vite framework detection
- Output to the correct dist folder

---

## Required Environment Variables

These MUST be set in Vercel for the build to succeed:

| Variable | Value | Purpose |
|----------|-------|---------|
| `VITE_STELLAR_NETWORK` | `testnet` | Stellar network selection |
| `VITE_STELLAR_RPC_URL` | `https://soroban-testnet.stellar.org` | Soroban RPC endpoint |
| `VITE_STELLAR_HORIZON_URL` | `https://horizon-testnet.stellar.org` | Horizon API endpoint |
| `VITE_EVENT_CONTRACT_ID` | `CDWEYVU5IHLNZRVSJC7DFX2KARIOKKFBPROQOAHEH2BPLFVRYZSHGCXQ` | Deployed contract address |

**Note:** These are NOT secrets (they're public testnet values). They must be set as Vercel Environment Variables because the `.env` file is gitignored.

---

## Verifying the Deployment

After deployment succeeds:

### 1. Check Build Logs
- Go to Vercel Dashboard → Your Project → Deployments
- Click on the deployment
- Verify build completed successfully
- Look for: "✓ built in XXXms"

### 2. Test Production URL
Once deployed, open your production URL (e.g., `https://your-project.vercel.app`)

**Test these features:**

#### Login (No Freighter)
- Login with `user@eventhub.com` / `password`
- **VERIFY:** No Freighter popup during login
- **VERIFY:** Dashboard loads correctly

#### Browse Events (No Freighter)
- Navigate to Events page
- View event details
- **VERIFY:** No Freighter popup for read-only actions
- **VERIFY:** Events loaded from blockchain

#### Register for Event (Real Freighter TX)
1. Click "Register for Event"
2. **VERIFY:** Freighter signing popup appears
3. Approve transaction
4. **VERIFY:** Success modal shows with REAL 64-char hash
5. Click "View on Stellar Expert →"
6. **VERIFY:** Opens `https://stellar.expert/explorer/testnet/tx/{REAL_HASH}`
7. **VERIFY:** Stellar Expert shows `register_for_event` transaction

#### Cancel Registration (Real Freighter TX)
1. Click "Cancel Registration"
2. **VERIFY:** Freighter signing popup appears
3. Approve transaction
4. **VERIFY:** Success modal shows with REAL hash (different from register)
5. **VERIFY:** Stellar Expert link works

#### Re-Register (Proves Blockchain State)
1. Click "Register for Event" again
2. **VERIFY:** Freighter signing popup appears (blockchain allows it)
3. **VERIFY:** Registration succeeds

---

## Troubleshooting

### Build Fails with "npm run build exited with 2"

**Cause:** Missing environment variables

**Fix:** Add all 4 required environment variables in Vercel Dashboard:
- Go to Project Settings → Environment Variables
- Add each variable listed above
- Redeploy

### "Wallet not installed" Error in Production

**Cause:** User doesn't have Freighter installed

**Fix:** User must install Freighter browser extension from https://www.freighter.app/

### "Wrong Network" Error

**Cause:** Freighter is set to Mainnet instead of Testnet

**Fix:** User must switch Freighter to Testnet network

### Contract Calls Fail

**Cause:** Incorrect contract ID or RPC URL

**Fix:** Verify environment variables match:
- Contract: `CDWEYVU5IHLNZRVSJC7DFX2KARIOKKFBPROQOAHEH2BPLFVRYZSHGCXQ`
- RPC: `https://soroban-testnet.stellar.org`

---

## Current Status

✅ **Code Fixed:** All changes committed
✅ **Pushed to GitHub:** `mnvmaral/STELLAR-LVL3` main branch
✅ **Vercel Config:** `vercel.json` created
✅ **Build Verified:** Local build passes
✅ **Contract Deployed:** New contract with cancel_registration
✅ **Tests Passing:** 12/12 contract tests pass

**Next Step:** Deploy via Vercel Dashboard or CLI using instructions above.

---

## Contract Information

**New Contract (with cancel_registration):**
- ID: `CDWEYVU5IHLNZRVSJC7DFX2KARIOKKFBPROQOAHEH2BPLFVRYZSHGCXQ`
- Network: Stellar Testnet
- Functions: 8 (including cancel_registration)
- Test Events: 5 events available for testing

**Deployment Transactions:**
- Upload: https://stellar.expert/explorer/testnet/tx/70b7ad64e41a8b5dd7958c0a97f9326c04c6cb815a371c9e40ce24eec1316d98
- Deploy: https://stellar.expert/explorer/testnet/tx/55c716acbf6813e3e005ed40db1aa1c185d8da39ac8ca89ead63c6ae791da01a

---

**The repository is ready for Vercel deployment!**
