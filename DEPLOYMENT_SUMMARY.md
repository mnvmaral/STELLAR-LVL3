# Deployment Summary

## Contract Deployment

**Network:** Stellar Testnet

**Contract:** EventManager

**Contract ID:** `CDWEYVU5IHLNZRVSJC7DFX2KARIOKKFBPROQOAHEH2BPLFVRYZSHGCXQ`

**Deployed:** August 2026

**Deployer:** Manav Maral

### Contract Functions

- `create_event` - Create new blockchain-verified events
- `get_event` - Retrieve event details by ID
- `get_all_events` - List all events
- `register_for_event` - Register participant for an event
- `cancel_registration` - Cancel existing registration
- `is_registered` - Check registration status
- `get_user_registrations` - Get all events a user is registered for
- `get_event_registrations` - Get all participants for an event

### Contract Tests

✅ **12 tests passing** in CI/CD pipeline

## Frontend Deployment

**Platform:** Vercel

**URL:** https://stellar-lvl-3-ekot.vercel.app

**Framework:** React 19 + TypeScript + Vite

**Status:** ✅ Live and operational

### Environment Configuration

```bash
VITE_STELLAR_NETWORK=testnet
VITE_STELLAR_RPC_URL=https://soroban-testnet.stellar.org
VITE_STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
VITE_EVENT_CONTRACT_ID=CDWEYVU5IHLNZRVSJC7DFX2KARIOKKFBPROQOAHEH2BPLFVRYZSHGCXQ
```

## CI/CD Status

✅ Frontend build passing
✅ Contract tests passing (12/12)
✅ Linter configured with continue-on-error
✅ Automated deployment to Vercel

## Network Details

| Parameter | Value |
|-----------|-------|
| Network | Stellar Testnet |
| Horizon URL | https://horizon-testnet.stellar.org |
| Soroban RPC | https://soroban-testnet.stellar.org |
| Network Passphrase | Test SDF Network ; September 2015 |
| Explorer | https://stellar.expert/explorer/testnet |

## Contract Explorer

View contract on Stellar Expert:
https://stellar.expert/explorer/testnet/contract/CDWEYVU5IHLNZRVSJC7DFX2KARIOKKFBPROQOAHEH2BPLFVRYZSHGCXQ

## Verification

- ✅ Contract deployed and verified on Stellar Testnet
- ✅ Frontend connected to deployed contract
- ✅ Freighter wallet integration working
- ✅ All 12 contract tests passing
- ✅ Build pipeline automated via GitHub Actions
- ✅ Mobile responsive design implemented
- ✅ Production build optimized and deployed

## Last Updated

August 31, 2026
