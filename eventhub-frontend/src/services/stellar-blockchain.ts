import * as StellarSdk from '@stellar/stellar-sdk';
import { stellarWallet } from './stellar-wallet';
import type { Event, CreateEventData } from '../types';

const CONTRACT_ID = import.meta.env.VITE_EVENT_CONTRACT_ID;
const RPC_URL = import.meta.env.VITE_STELLAR_RPC_URL;
const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;

// Lazy-initialize server to avoid crashes when env vars are missing
let server: StellarSdk.rpc.Server | null = null;

function getServer(): StellarSdk.rpc.Server {
  if (!server) {
    if (!RPC_URL) {
      throw new Error('VITE_STELLAR_RPC_URL environment variable is not configured');
    }
    if (!CONTRACT_ID) {
      throw new Error('VITE_EVENT_CONTRACT_ID environment variable is not configured');
    }
    server = new StellarSdk.rpc.Server(RPC_URL);
  }
  return server;
}

export class StellarBlockchainService {
  /**
   * Create event on-chain
   */
  async createEvent(data: CreateEventData): Promise<{
    eventId: number;
    txHash: string;
  }> {
    try {
      // Step 1: Ensure wallet is ready and get address (triggers permission flow if needed)
      const { address: organizerAddress } = await stellarWallet.ensureWalletReady();

      // Step 2: Load the source account
      const sourceAccount = await getServer().getAccount(organizerAddress);
      
      // Step 3: Build the contract call operation
      const contract = new StellarSdk.Contract(CONTRACT_ID);
      
      const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(
          contract.call(
            'create_event',
            StellarSdk.nativeToScVal(organizerAddress, { type: 'address' }),
            StellarSdk.nativeToScVal(data.title, { type: 'string' }),
            StellarSdk.nativeToScVal(data.description, { type: 'string' }),
            StellarSdk.nativeToScVal(data.category, { type: 'string' }),
            StellarSdk.nativeToScVal(data.date, { type: 'string' }),
            StellarSdk.nativeToScVal(data.time, { type: 'string' }),
            StellarSdk.nativeToScVal(data.location, { type: 'string' }),
            StellarSdk.nativeToScVal(data.maxParticipants, { type: 'u32' })
          )
        )
        .setTimeout(30)
        .build();

      // Step 4: Simulate the transaction
      const simulatedTx = await getServer().simulateTransaction(transaction);
      
      if (StellarSdk.rpc.Api.isSimulationError(simulatedTx)) {
        throw new Error(`Simulation failed: ${simulatedTx.error}`);
      }

      // Step 5: Prepare the transaction with simulation results
      const preparedTx = StellarSdk.rpc.assembleTransaction(
        transaction,
        simulatedTx
      ).build();

      // Step 6: Sign with wallet (must be called directly in this flow to avoid popup blocking)
      const signedXdr = await stellarWallet.signTransaction(preparedTx.toXDR(), organizerAddress);
      const signedTx = StellarSdk.TransactionBuilder.fromXDR(
        signedXdr,
        NETWORK_PASSPHRASE
      ) as StellarSdk.Transaction;

      // Step 7: Submit the transaction
      const sendResponse = await getServer().sendTransaction(signedTx);
      
      if (sendResponse.status === 'ERROR') {
        throw new Error(`Transaction failed: ${sendResponse.errorResult}`);
      }

      // Step 8: Poll for transaction result
      const hash = sendResponse.hash;
      let getResponse = await getServer().getTransaction(hash);
      let attempts = 0;
      const maxAttempts = 30;

      while (getResponse.status === StellarSdk.rpc.Api.GetTransactionStatus.NOT_FOUND && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        getResponse = await getServer().getTransaction(hash);
        attempts++;
      }

      if (getResponse.status === StellarSdk.rpc.Api.GetTransactionStatus.SUCCESS) {
        // Extract event ID from result
        const resultValue = getResponse.returnValue;
        const eventId = StellarSdk.scValToNative(resultValue!);

        return {
          eventId,
          txHash: hash,
        };
      } else {
        throw new Error(`Transaction failed with status: ${getResponse.status}`);
      }
    } catch (error: any) {
      console.error('Create event error:', error);
      
      if (error.message === 'TRANSACTION_REJECTED') {
        throw new Error('TRANSACTION_REJECTED');
      } else if (error.message === 'WALLET_NOT_INSTALLED') {
        throw new Error('WALLET_NOT_INSTALLED');
      } else if (error.message === 'WALLET_LOCKED') {
        throw new Error('WALLET_LOCKED');
      } else if (error.message === 'WRONG_NETWORK') {
        throw new Error('WRONG_NETWORK');
      } else if (error.message === 'PERMISSION_DENIED' || error.message === 'CONNECTION_REJECTED') {
        throw error;
      } else if (error.message?.includes('insufficient')) {
        throw new Error('INSUFFICIENT_BALANCE');
      } else if (error.message?.includes('account not found')) {
        throw new Error('ACCOUNT_NOT_FUNDED');
      } else {
        throw error;
      }
    }
  }

  /**
   * Register for event on-chain
   */
  async registerForEvent(eventId: number): Promise<{
    success: boolean;
    txHash: string;
  }> {
    try {
      // Step 1: Ensure wallet is ready and get address (triggers permission flow if needed)
      const { address: participantAddress } = await stellarWallet.ensureWalletReady();

      // Step 2: Load the source account
      const sourceAccount = await getServer().getAccount(participantAddress);
      
      // Step 3: Build the contract call
      const contract = new StellarSdk.Contract(CONTRACT_ID);
      
      const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(
          contract.call(
            'register_for_event',
            StellarSdk.nativeToScVal(eventId, { type: 'u64' }),
            StellarSdk.nativeToScVal(participantAddress, { type: 'address' })
          )
        )
        .setTimeout(30)
        .build();

      // Step 4: Simulate the transaction
      const simulatedTx = await getServer().simulateTransaction(transaction);
      
      if (StellarSdk.rpc.Api.isSimulationError(simulatedTx)) {
        const error = simulatedTx.error;
        if (error.includes('Already registered')) {
          throw new Error('ALREADY_REGISTERED');
        } else if (error.includes('Event is full')) {
          throw new Error('EVENT_FULL');
        }
        throw new Error(`Simulation failed: ${error}`);
      }

      // Step 5: Prepare the transaction
      const preparedTx = StellarSdk.rpc.assembleTransaction(
        transaction,
        simulatedTx
      ).build();

      // Step 6: Sign with wallet (must be called directly in this flow to avoid popup blocking)
      const signedXdr = await stellarWallet.signTransaction(preparedTx.toXDR(), participantAddress);
      const signedTx = StellarSdk.TransactionBuilder.fromXDR(
        signedXdr,
        NETWORK_PASSPHRASE
      ) as StellarSdk.Transaction;

      // Step 7: Submit the transaction
      const sendResponse = await getServer().sendTransaction(signedTx);
      
      if (sendResponse.status === 'ERROR') {
        throw new Error(`Transaction failed: ${sendResponse.errorResult}`);
      }

      // Step 8: Poll for result
      const hash = sendResponse.hash;
      let getResponse = await getServer().getTransaction(hash);
      let attempts = 0;
      const maxAttempts = 30;

      while (getResponse.status === StellarSdk.rpc.Api.GetTransactionStatus.NOT_FOUND && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        getResponse = await getServer().getTransaction(hash);
        attempts++;
      }

      if (getResponse.status === StellarSdk.rpc.Api.GetTransactionStatus.SUCCESS) {
        return {
          success: true,
          txHash: hash,
        };
      } else {
        throw new Error(`Transaction failed with status: ${getResponse.status}`);
      }
    } catch (error: any) {
      console.error('Register event error:', error);
      
      if (error.message === 'TRANSACTION_REJECTED') {
        throw new Error('TRANSACTION_REJECTED');
      } else if (error.message === 'ALREADY_REGISTERED') {
        throw new Error('ALREADY_REGISTERED');
      } else if (error.message === 'EVENT_FULL') {
        throw new Error('EVENT_FULL');
      } else if (error.message === 'WALLET_NOT_INSTALLED') {
        throw new Error('WALLET_NOT_INSTALLED');
      } else if (error.message === 'WALLET_LOCKED') {
        throw new Error('WALLET_LOCKED');
      } else if (error.message === 'WRONG_NETWORK') {
        throw new Error('WRONG_NETWORK');
      } else if (error.message === 'PERMISSION_DENIED' || error.message === 'CONNECTION_REJECTED') {
        throw error;
      } else if (error.message?.includes('insufficient')) {
        throw new Error('INSUFFICIENT_BALANCE');
      } else if (error.message?.includes('account not found')) {
        throw new Error('ACCOUNT_NOT_FUNDED');
      } else {
        throw error;
      }
    }
  }

  /**
   * Cancel registration for an event on-chain
   */
  async cancelRegistration(eventId: number): Promise<{
    success: boolean;
    txHash: string;
  }> {
    try {
      // Step 1: Ensure wallet is ready and get address
      const { address: participantAddress } = await stellarWallet.ensureWalletReady();

      // Step 2: Load the source account
      const sourceAccount = await getServer().getAccount(participantAddress);
      
      // Step 3: Build the contract call
      const contract = new StellarSdk.Contract(CONTRACT_ID);
      
      const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(
          contract.call(
            'cancel_registration',
            StellarSdk.nativeToScVal(eventId, { type: 'u64' }),
            StellarSdk.nativeToScVal(participantAddress, { type: 'address' })
          )
        )
        .setTimeout(30)
        .build();

      // Step 4: Simulate the transaction
      const simulatedTx = await getServer().simulateTransaction(transaction);
      
      if (StellarSdk.rpc.Api.isSimulationError(simulatedTx)) {
        const error = simulatedTx.error;
        if (error.includes('Not registered')) {
          throw new Error('NOT_REGISTERED');
        }
        throw new Error(`Simulation failed: ${error}`);
      }

      // Step 5: Prepare the transaction
      const preparedTx = StellarSdk.rpc.assembleTransaction(
        transaction,
        simulatedTx
      ).build();

      // Step 6: Sign with wallet
      const signedXdr = await stellarWallet.signTransaction(preparedTx.toXDR(), participantAddress);
      const signedTx = StellarSdk.TransactionBuilder.fromXDR(
        signedXdr,
        NETWORK_PASSPHRASE
      ) as StellarSdk.Transaction;

      // Step 7: Submit the transaction
      const sendResponse = await getServer().sendTransaction(signedTx);
      
      if (sendResponse.status === 'ERROR') {
        throw new Error(`Transaction failed: ${sendResponse.errorResult}`);
      }

      // Step 8: Poll for result
      const hash = sendResponse.hash;
      let getResponse = await getServer().getTransaction(hash);
      let attempts = 0;
      const maxAttempts = 30;

      while (getResponse.status === StellarSdk.rpc.Api.GetTransactionStatus.NOT_FOUND && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        getResponse = await getServer().getTransaction(hash);
        attempts++;
      }

      if (getResponse.status === StellarSdk.rpc.Api.GetTransactionStatus.SUCCESS) {
        return {
          success: true,
          txHash: hash,
        };
      } else {
        throw new Error(`Transaction failed with status: ${getResponse.status}`);
      }
    } catch (error: any) {
      console.error('Cancel registration error:', error);
      
      if (error.message === 'TRANSACTION_REJECTED') {
        throw new Error('TRANSACTION_REJECTED');
      } else if (error.message === 'NOT_REGISTERED') {
        throw new Error('NOT_REGISTERED');
      } else if (error.message === 'WALLET_NOT_INSTALLED') {
        throw new Error('WALLET_NOT_INSTALLED');
      } else if (error.message === 'WALLET_LOCKED') {
        throw new Error('WALLET_LOCKED');
      } else if (error.message === 'WRONG_NETWORK') {
        throw new Error('WRONG_NETWORK');
      } else if (error.message === 'PERMISSION_DENIED' || error.message === 'CONNECTION_REJECTED') {
        throw error;
      } else if (error.message?.includes('insufficient')) {
        throw new Error('INSUFFICIENT_BALANCE');
      } else if (error.message?.includes('account not found')) {
        throw new Error('ACCOUNT_NOT_FUNDED');
      } else {
        throw error;
      }
    }
  }

  /**
   * Get all events from blockchain (read-only)
   */
  async getAllEvents(): Promise<Event[]> {
    try {
      // For read-only operations, we can use any keypair (no auth needed)
      const randomKeypair = StellarSdk.Keypair.random();
      const account = new StellarSdk.Account(randomKeypair.publicKey(), '0');
      
      const contract = new StellarSdk.Contract(CONTRACT_ID);
      
      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(contract.call('get_all_events'))
        .setTimeout(30)
        .build();

      const simulatedTx = await getServer().simulateTransaction(transaction);
      
      if (StellarSdk.rpc.Api.isSimulationError(simulatedTx)) {
        console.error('Failed to fetch events:', simulatedTx.error);
        return [];
      }

      const resultValue = simulatedTx.result?.retval;
      if (!resultValue) {
        return [];
      }

      const eventsRaw = StellarSdk.scValToNative(resultValue);
      
      // Transform blockchain events to frontend format
      return eventsRaw.map((e: any) => ({
        id: `event-${e.id}`,
        title: e.title,
        description: e.description,
        category: e.category,
        date: e.date,
        time: e.time,
        location: e.location,
        organizer: e.organizer,
        maxParticipants: e.max_participants,
        currentParticipants: e.current_participants,
        status: e.status,
        createdAt: new Date(Number(e.created_at) * 1000).toISOString(),
        updatedAt: new Date(Number(e.created_at) * 1000).toISOString(),
      }));
    } catch (error: any) {
      console.error('Get events error:', error);
      return [];
    }
  }

  /**
   * Get single event by ID (read-only)
   */
  async getEvent(eventId: number): Promise<Event | null> {
    try {
      const randomKeypair = StellarSdk.Keypair.random();
      const account = new StellarSdk.Account(randomKeypair.publicKey(), '0');
      
      const contract = new StellarSdk.Contract(CONTRACT_ID);
      
      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(
          contract.call(
            'get_event',
            StellarSdk.nativeToScVal(eventId, { type: 'u64' })
          )
        )
        .setTimeout(30)
        .build();

      const simulatedTx = await getServer().simulateTransaction(transaction);
      
      if (StellarSdk.rpc.Api.isSimulationError(simulatedTx)) {
        return null;
      }

      const resultValue = simulatedTx.result?.retval;
      if (!resultValue) {
        return null;
      }

      const eventRaw = StellarSdk.scValToNative(resultValue);
      if (!eventRaw) return null;

      return {
        id: `event-${eventRaw.id}`,
        title: eventRaw.title,
        description: eventRaw.description,
        category: eventRaw.category,
        date: eventRaw.date,
        time: eventRaw.time,
        location: eventRaw.location,
        organizer: eventRaw.organizer,
        maxParticipants: eventRaw.max_participants,
        currentParticipants: eventRaw.current_participants,
        status: eventRaw.status,
        createdAt: new Date(Number(eventRaw.created_at) * 1000).toISOString(),
        updatedAt: new Date(Number(eventRaw.created_at) * 1000).toISOString(),
      };
    } catch (error: any) {
      console.error('Get event error:', error);
      return null;
    }
  }

  /**
   * Check if user is registered for event (read-only)
   */
  async isRegistered(eventId: number, participantAddress: string): Promise<boolean> {
    try {
      const randomKeypair = StellarSdk.Keypair.random();
      const account = new StellarSdk.Account(randomKeypair.publicKey(), '0');
      
      const contract = new StellarSdk.Contract(CONTRACT_ID);
      
      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(
          contract.call(
            'is_registered',
            StellarSdk.nativeToScVal(eventId, { type: 'u64' }),
            StellarSdk.nativeToScVal(participantAddress, { type: 'address' })
          )
        )
        .setTimeout(30)
        .build();

      const simulatedTx = await getServer().simulateTransaction(transaction);
      
      if (StellarSdk.rpc.Api.isSimulationError(simulatedTx)) {
        return false;
      }

      const resultValue = simulatedTx.result?.retval;
      if (!resultValue) {
        return false;
      }

      return StellarSdk.scValToNative(resultValue);
    } catch (error) {
      console.error('Is registered check error:', error);
      return false;
    }
  }

  /**
   * Get user's registrations (read-only)
   */
  async getUserRegistrations(userAddress: string): Promise<number[]> {
    try {
      const randomKeypair = StellarSdk.Keypair.random();
      const account = new StellarSdk.Account(randomKeypair.publicKey(), '0');
      
      const contract = new StellarSdk.Contract(CONTRACT_ID);
      
      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(
          contract.call(
            'get_user_registrations',
            StellarSdk.nativeToScVal(userAddress, { type: 'address' })
          )
        )
        .setTimeout(30)
        .build();

      const simulatedTx = await getServer().simulateTransaction(transaction);
      
      if (StellarSdk.rpc.Api.isSimulationError(simulatedTx)) {
        return [];
      }

      const resultValue = simulatedTx.result?.retval;
      if (!resultValue) {
        return [];
      }

      return StellarSdk.scValToNative(resultValue);
    } catch (error) {
      console.error('Get user registrations error:', error);
      return [];
    }
  }

  /**
   * Get event registrations (read-only)
   */
  async getEventRegistrations(eventId: number): Promise<string[]> {
    try {
      const randomKeypair = StellarSdk.Keypair.random();
      const account = new StellarSdk.Account(randomKeypair.publicKey(), '0');
      
      const contract = new StellarSdk.Contract(CONTRACT_ID);
      
      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(
          contract.call(
            'get_event_registrations',
            StellarSdk.nativeToScVal(eventId, { type: 'u64' })
          )
        )
        .setTimeout(30)
        .build();

      const simulatedTx = await getServer().simulateTransaction(transaction);
      
      if (StellarSdk.rpc.Api.isSimulationError(simulatedTx)) {
        return [];
      }

      const resultValue = simulatedTx.result?.retval;
      if (!resultValue) {
        return [];
      }

      return StellarSdk.scValToNative(resultValue);
    } catch (error) {
      console.error('Get event registrations error:', error);
      return [];
    }
  }
}

export const stellarBlockchain = new StellarBlockchainService();
