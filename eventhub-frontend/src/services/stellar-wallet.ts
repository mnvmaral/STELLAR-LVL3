import { 
  isConnected as freighterIsConnected,
  getPublicKey,
  signTransaction as freighterSignTransaction,
  getNetwork,
  requestAccess,
} from '@stellar/freighter-api';

export interface WalletState {
  isConnected: boolean;
  publicKey: string | null;
  network: 'testnet' | 'mainnet';
}

class StellarWalletService {
  private state: WalletState = {
    isConnected: false,
    publicKey: null,
    network: 'testnet',
  };

  /**
   * Check if Freighter wallet extension is installed
   */
  isWalletInstalled(): boolean {
    return typeof window !== 'undefined' && 
           typeof (window as any).freighter !== 'undefined';
  }

  /**
   * Connect to Freighter wallet and request user's public key
   */
  async connectWallet(): Promise<string> {
    if (!this.isWalletInstalled()) {
      throw new Error('WALLET_NOT_INSTALLED');
    }

    try {
      // Request access to wallet
      await requestAccess();

      // Get public key
      const publicKey = await getPublicKey();
      
      if (!publicKey) {
        throw new Error('WALLET_LOCKED');
      }

      // Get network
      const network = await getNetwork();
      
      // Verify we're on testnet
      if (network !== 'TESTNET') {
        throw new Error('WRONG_NETWORK');
      }

      this.state = {
        isConnected: true,
        publicKey,
        network: 'testnet',
      };

      return publicKey;
    } catch (error: any) {
      console.error('Wallet connection error:', error);
      
      // Handle specific Freighter errors
      if (error.message?.includes('User declined')) {
        throw new Error('CONNECTION_REJECTED');
      }
      
      if (error.message === 'WRONG_NETWORK') {
        throw new Error('WRONG_NETWORK');
      }

      if (error.message === 'WALLET_LOCKED') {
        throw new Error('WALLET_LOCKED');
      }

      throw new Error('CONNECTION_FAILED');
    }
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
   */
  async signTransaction(xdr: string): Promise<string> {
    if (!this.state.isConnected) {
      throw new Error('WALLET_NOT_CONNECTED');
    }

    if (!this.isWalletInstalled()) {
      throw new Error('WALLET_NOT_INSTALLED');
    }

    try {
      const signedXdr = await freighterSignTransaction(xdr, {
        network: 'TESTNET',
        networkPassphrase: 'Test SDF Network ; September 2015',
        accountToSign: this.state.publicKey!,
      });

      return signedXdr;
    } catch (error: any) {
      console.error('Transaction signing error:', error);
      
      if (error.message?.includes('User declined')) {
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
    if (!this.isWalletInstalled()) {
      return false;
    }

    try {
      const connected = await freighterIsConnected();
      
      if (connected && !this.state.isConnected) {
        // Wallet is connected in Freighter but not in our state, reconnect
        const publicKey = await getPublicKey();
        if (publicKey) {
          this.state = {
            isConnected: true,
            publicKey,
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
