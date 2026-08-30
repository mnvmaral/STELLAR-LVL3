import { 
  isConnected as freighterIsConnected,
  getAddress,
  signTransaction as freighterSignTransaction,
  getNetwork,
  requestAccess,
  isAllowed,
  setAllowed,
} from '@stellar/freighter-api';

export interface WalletState {
  isConnected: boolean;
  publicKey: string | null;
  network: 'testnet' | 'mainnet';
}

export type WalletError =
  | 'WALLET_NOT_INSTALLED'
  | 'WALLET_LOCKED'
  | 'CONNECTION_REJECTED'
  | 'WRONG_NETWORK'
  | 'TRANSACTION_REJECTED'
  | 'SIGNING_FAILED'
  | 'PERMISSION_DENIED'
  | 'NETWORK_ERROR'
  | 'CONNECTION_FAILED';

class StellarWalletService {
  private state: WalletState = {
    isConnected: false,
    publicKey: null,
    network: 'testnet',
  };

  /**
   * Check if Freighter wallet extension is installed
   * Uses the proper v6 API method instead of checking window globals
   */
  async isWalletInstalled(): Promise<boolean> {
    if (typeof window === 'undefined') {
      return false;
    }

    try {
      // The proper way to detect Freighter in v6 is to call the API
      // If it responds without error, Freighter is installed
      const result = await freighterIsConnected();
      // Even if not connected, if we get a response, Freighter is installed
      return !result.error;
    } catch (error) {
      // If the API call fails completely, Freighter is not installed
      return false;
    }
  }

  /**
   * Ensure wallet is connected and permitted - call this before any blockchain write operation
   * This is the proper permission flow for Freighter API v6
   */
  async ensureWalletReady(): Promise<{ address: string; network: string }> {
    const installed = await this.isWalletInstalled();
    if (!installed) {
      throw new Error('WALLET_NOT_INSTALLED');
    }

    try {
      // Step 1: Check if already allowed (site is on Freighter's allow list)
      const allowedResult = await isAllowed();
      
      if (allowedResult.error) {
        console.error('Error checking permission:', allowedResult.error);
        throw new Error('PERMISSION_DENIED');
      }

      // Step 2: Request permission if not on allow list
      // This will trigger a Freighter popup asking the user to approve
      if (!allowedResult.isAllowed) {
        console.log('Not on allow list, requesting permission...');
        const permissionResult = await setAllowed();
        
        console.log('Permission result:', permissionResult);
        
        // Check if there was an error in the response
        if (permissionResult.error) {
          console.error('Permission error:', permissionResult.error);
          // User explicitly declined
          if (permissionResult.error.message?.includes('User declined') ||
              permissionResult.error.message?.includes('User rejected')) {
            throw new Error('CONNECTION_REJECTED');
          }
          throw new Error('PERMISSION_DENIED');
        }

        // Check if permission was actually granted
        if (!permissionResult.isAllowed) {
          console.error('Permission not granted, isAllowed:', permissionResult.isAllowed);
          throw new Error('CONNECTION_REJECTED');
        }
        
        console.log('Permission granted successfully');
      } else {
        console.log('Already on allow list');
      }

      // Step 3: Get address
      console.log('Getting address...');
      const addressResult = await getAddress();
      
      if (addressResult.error) {
        console.error('Address error:', addressResult.error);
        if (addressResult.error.message?.includes('locked')) {
          throw new Error('WALLET_LOCKED');
        }
        throw new Error('CONNECTION_FAILED');
      }

      if (!addressResult.address) {
        throw new Error('WALLET_LOCKED');
      }

      console.log('Address obtained:', addressResult.address);

      // Step 4: Verify network
      const networkResult = await getNetwork();
      
      if (networkResult.error) {
        console.error('Network error:', networkResult.error);
        throw new Error('NETWORK_ERROR');
      }

      if (networkResult.network !== 'TESTNET') {
        throw new Error('WRONG_NETWORK');
      }

      console.log('Network verified: TESTNET');

      // Update local state for caching (but never gate operations on this)
      this.state = {
        isConnected: true,
        publicKey: addressResult.address,
        network: 'testnet',
      };

      return {
        address: addressResult.address,
        network: networkResult.network,
      };
    } catch (error: any) {
      console.error('Wallet ready check error:', error);
      throw error;
    }
  }

  /**
   * Legacy connect wallet method - kept for compatibility but ensureWalletReady is preferred
   */
  async connectWallet(): Promise<string> {
    const { address } = await this.ensureWalletReady();
    return address;
  }

  /**
   * Disconnect wallet
   */
  async disconnectWallet(): Promise<void> {
    this.state = {
      isConnected: false,
      publicKey: null,
      network: 'testnet',
    };
  }

  /**
   * Sign a transaction using Freighter
   * Note: This should be called immediately after transaction preparation, 
   * within the same user gesture to avoid popup blocking
   */
  async signTransaction(xdr: string, address: string): Promise<string> {
    const installed = await this.isWalletInstalled();
    if (!installed) {
      throw new Error('WALLET_NOT_INSTALLED');
    }

    try {
      const result = await freighterSignTransaction(xdr, {
        networkPassphrase: 'Test SDF Network ; September 2015',
        address: address,
      });

      if (result.error) {
        if (result.error.message?.includes('User declined') || 
            result.error.message?.includes('rejected')) {
          throw new Error('TRANSACTION_REJECTED');
        }
        throw new Error(result.error.message || 'SIGNING_FAILED');
      }

      if (!result.signedTxXdr) {
        throw new Error('SIGNING_FAILED');
      }

      return result.signedTxXdr;
    } catch (error: any) {
      console.error('Transaction signing error:', error);
      
      if (error.message === 'TRANSACTION_REJECTED') {
        throw error;
      }
      
      if (error.message?.includes('User declined') || 
          error.message?.includes('rejected')) {
        throw new Error('TRANSACTION_REJECTED');
      }

      throw new Error('SIGNING_FAILED');
    }
  }

  /**
   * Get current wallet state
   */
  getState(): WalletState {
    return { ...this.state };
  }

  /**
   * Check if wallet is currently connected
   */
  async checkConnection(): Promise<boolean> {
    const installed = await this.isWalletInstalled();
    if (!installed) {
      return false;
    }

    try {
      const result = await freighterIsConnected();
      
      if (result.error) {
        return false;
      }
      
      const connected = result.isConnected;
      
      if (connected && !this.state.isConnected) {
        // Wallet is connected in Freighter but not in our state, reconnect
        const addressResult = await getAddress();
        if (addressResult.address && !addressResult.error) {
          this.state = {
            isConnected: true,
            publicKey: addressResult.address,
            network: 'testnet',
          };
        }
      }

      return connected;
    } catch (error) {
      return false;
    }
  }
}

export const stellarWallet = new StellarWalletService();
