import * as StellarSdk from '@stellar/stellar-sdk';
import { stellarWallet } from './stellar-wallet';
import type { Event, CreateEventData } from '../types';

const CONTRACT_ID = import.meta.env.VITE_EVENT_CONTRACT_ID;
const RPC_URL = import.meta.env.VITE_STELLAR_RPC_URL;
const NETWORK_PASSPHRASE = import.meta.env.VITE_STELLAR_NETWORK === 'mainnet'
  ? StellarSdk.Networks.PUBLIC
  : StellarSdk.Networks.TESTNET;

const server = new StellarSdk.Horizon.Server(import.meta.env.VITE_STELLAR_HORIZON_URL);

export class StellarBlockchainService {
  /**
   * Create event on-chain
   */
  async createEvent(data: CreateEventData, organizerAddress: string): Promise<{
    eventId: number;
    txHash: string;
  }> {
    const walletState = stellarWallet.getState();
    if (!walletState.isConnected || !walletState.publicKey) {
      throw new Error('Wallet not connected');
    }

    try {
      // Load the account
      const account = await server.getAccount(organizerAddress);
      
      // Build the contract call
      const contract = new StellarSdk.Contract(CONTRACT_ID);
      
      // Build the transaction
      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(
          contract.call(
            'create_event',
            StellarSdk.Address.fromString(organizerAddress).toScVal(),
            StellarSdk.nativeToScVal(data.title, { type: 'string' }),
            StellarSdk.nativeToScVal(data.description, { type: 'string' }),
            StellarSdk.nativeToScVal(data.category, { type: 'string' }),
            StellarSdk.nativeToScVal(data.date, { type: 'string' }),
            StellarSdk.nativeToScVal(data.time, { type: 'string' }),
            StellarSdk.nativeToScVal(data.location, { type: 'string' }),
            StellarSdk.nativeToScVal(data.maxParticipants, { type: 'u32' })
          )
        )
        .setTimeout(300)
        .build();

      // Simulate the transaction
      const simulated = await server.simulateTransaction(transaction);
      
      if (StellarSdk.SorobanRpc.Api.isSimulationError(simulated)) {
        throw new Error(`Simulation failed: ${simulated.error}`);
      }

      // Prepare the transaction
      const prepared = StellarSdk.SorobanRpc.assembleTransaction(
        transaction,
        simulated
      ).build();

      // Sign with wallet
      const signedXdr = await stellarWallet.signTransaction(prepared.toXDR());
      const signedTx = StellarSdk.TransactionBuilder.fromXDR(
        signedXdr,
        NETWORK_PASSPHRASE
      );

      // Submit the transaction
      const response = await server.sendTransaction(signedTx);
      
      // Wait for confirmation
      let status = response.status;
      let hash = response.hash;
      let attempts = 0;
      const maxAttempts = 30;

      while (status === 'PENDING' && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const txResponse = await server.getTransaction(hash);
        status = txResponse.status;
        attempts++;
      }

      if (status !== 'SUCCESS') {
        throw new Error(`Transaction failed with status: ${status}`);
      }

      // Get the result
      const txResult = await server.getTransaction(hash);
      const resultVal = txResult.returnValue;
      const eventId = StellarSdk.scValToNative(resultVal as StellarSdk.xdr.ScVal);

      return {
        eventId,
        txHash: hash,
      };
    } catch (error: any) {
      console.error('Create event error:', error);
      
      if (error.message?.includes('rejected')) {
        throw new Error('Transaction rejected by user');
      } else if (error.message?.includes('insufficient')) {
        throw new Error('Insufficient balance to pay transaction fee');
      } else {
        throw new Error(`Failed to create event: ${error.message}`);
      }
    }
  }

  /**
   * Register for event on-chain
   */
  async registerForEvent(eventId: number, participantAddress: string): Promise<{
    success: boolean;
    txHash: string;
  }> {
    const walletState = stellarWallet.getState();
    if (!walletState.isConnected || !walletState.publicKey) {
      throw new Error('Wallet not connected');
    }

    try {
      // Load the account
      const account = await server.getAccount(participantAddress);
      
      // Build the contract call
      const contract = new StellarSdk.Contract(CONTRACT_ID);
      
      // Build the transaction
      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(
          contract.call(
            'register_for_event',
            StellarSdk.nativeToScVal(eventId, { type: 'u64' }),
            StellarSdk.Address.fromString(participantAddress).toScVal()
          )
        )
        .setTimeout(300)
        .build();

      // Simulate the transaction
      const simulated = await server.simulateTransaction(transaction);
      
      if (StellarSdk.SorobanRpc.Api.isSimulationError(simulated)) {
        const error = simulated.error;
        if (error.includes('Already registered')) {
          throw new Error('Already registered for this event');
        } else if (error.includes('Event is full')) {
          throw new Error('Event is full');
        }
        throw new Error(`Registration failed: ${error}`);
      }

      // Prepare the transaction
      const prepared = StellarSdk.SorobanRpc.assembleTransaction(
        transaction,
        simulated
      ).build();

      // Sign with wallet
      const signedXdr = await stellarWallet.signTransaction(prepared.toXDR());
      const signedTx = StellarSdk.TransactionBuilder.fromXDR(
        signedXdr,
        NETWORK_PASSPHRASE
      );

      // Submit the transaction
      const response = await server.sendTransaction(signedTx);
      
      // Wait for confirmation
      let status = response.status;
      let hash = response.hash;
      let attempts = 0;
      const maxAttempts = 30;

      while (status === 'PENDING' && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const txResponse = await server.getTransaction(hash);
        status = txResponse.status;
        attempts++;
      }

      if (status !== 'SUCCESS') {
        throw new Error(`Transaction failed with status: ${status}`);
      }

      return {
        success: true,
        txHash: hash,
      };
    } catch (error: any) {
      console.error('Register event error:', error);
      
      if (error.message?.includes('rejected')) {
        throw new Error('Transaction rejected by user');
      } else if (error.message?.includes('insufficient')) {
        throw new Error('Insufficient balance to pay transaction fee');
      } else if (error.message?.includes('Already registered')) {
        throw new Error('Already registered for this event');
      } else if (error.message?.includes('full')) {
        throw new Error('Event is full');
      } else {
        throw new Error(`Failed to register: ${error.message}`);
      }
    }
  }

  /**
   * Get all events from blockchain
   */
  async getAllEvents(): Promise<Event[]> {
    try {
      // For read-only operations, we can use a random keypair (no auth needed)
      const randomKeypair = StellarSdk.Keypair.random();
      const account = new StellarSdk.Account(randomKeypair.publicKey(), '0');
      
      const contract = new StellarSdk.Contract(CONTRACT_ID);
      
      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(contract.call('get_all_events'))
        .setTimeout(300)
        .build();

      const simulated = await server.simulateTransaction(transaction);
      
      if (StellarSdk.SorobanRpc.Api.isSimulationError(simulated)) {
        throw new Error(`Failed to fetch events: ${simulated.error}`);
      }

      const resultVal = simulated.result?.retval;
      if (!resultVal) {
        return [];
      }

      const eventsRaw = StellarSdk.scValToNative(resultVal);
      
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
      throw new Error(`Failed to fetch events: ${error.message}`);
    }
  }

  /**
   * Get single event by ID
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
        .setTimeout(300)
        .build();

      const simulated = await server.simulateTransaction(transaction);
      
      if (StellarSdk.SorobanRpc.Api.isSimulationError(simulated)) {
        return null;
      }

      const resultVal = simulated.result?.retval;
      if (!resultVal) {
        return null;
      }

      const eventRaw = StellarSdk.scValToNative(resultVal);
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
   * Check if user is registered for event
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
            StellarSdk.Address.fromString(participantAddress).toScVal()
          )
        )
        .setTimeout(300)
        .build();

      const simulated = await server.simulateTransaction(transaction);
      
      if (StellarSdk.SorobanRpc.Api.isSimulationError(simulated)) {
        return false;
      }

      const resultVal = simulated.result?.retval;
      if (!resultVal) {
        return false;
      }

      return StellarSdk.scValToNative(resultVal);
    } catch (error) {
      console.error('Is registered check error:', error);
      return false;
    }
  }
}

export const stellarBlockchain = new StellarBlockchainService();
