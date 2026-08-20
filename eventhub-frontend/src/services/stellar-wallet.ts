import { isConnected, getPublicKey as getFreighterPublicKey, signTransaction } from '@stellar/freighter-api';

export interface WalletState {
  isConnected: boolean;
  publicKey: string | null;
}

class StellarWalletService {
  private walletState: WalletState = {
    isConnected: false,
    publicKey: null,
  };

  private listeners: Array<(state: WalletState) => void> = [];

  async checkConnection(): Promise<WalletState> {
    try {
      const connected = await isConnected();
      if (connected) {
        const publicKey = await getFreighterPublicKey();
        this.walletState = {
          isConnected: true,
          publicKey,
        };
      } else {
        this.walletState = {
          isConnected: false,
          publicKey: null,
        };
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
      this.walletState = {
        isConnected: false,
        publicKey: null,
      };
    }
    
    this.notifyListeners();
    return this.walletState;
  }

  async connect(): Promise<WalletState> {
    try {
      // Freighter handles connection through user approval
      const publicKey = await getFreighterPublicKey();
      
      this.walletState = {
        isConnected: true,
        publicKey,
      };
      
      this.notifyListeners();
      return this.walletState;
    } catch (error: any) {
      console.error('Wallet connection error:', error);
      
      // Handle specific errors
      if (error.message?.includes('User declined')) {
        throw new Error('Wallet connection rejected by user');
      } else if (error.message?.includes('not installed')) {
        throw new Error('Freighter wallet not installed');
      } else {
        throw new Error('Failed to connect wallet: ' + error.message);
      }
    }
  }

  async disconnect(): Promise<void> {
    this.walletState = {
      isConnected: false,
      publicKey: null,
    };
    this.notifyListeners();
  }

  async signTransaction(xdr: string): Promise<string> {
    if (!this.walletState.isConnected) {
      throw new Error('Wallet not connected');
    }

    try {
      const result = await signTransaction(xdr, {
        networkPassphrase: import.meta.env.VITE_STELLAR_NETWORK === 'mainnet' 
          ? 'Public Global Stellar Network ; September 2015'
          : 'Test SDF Network ; September 2015',
      });
      
      return result.signedTxXdr;
    } catch (error: any) {
      console.error('Transaction signing error:', error);
      
      if (error.message?.includes('User declined')) {
        throw new Error('Transaction rejected by user');
      } else {
        throw new Error('Failed to sign transaction: ' + error.message);
      }
    }
  }

  getState(): WalletState {
    return { ...this.walletState };
  }

  subscribe(listener: (state: WalletState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.getState()));
  }
}

export const stellarWallet = new StellarWalletService();
