// NOTE: This file has TypeScript errors due to Stellar SDK API changes
// The functionality works but needs API updates for the latest SDK version
// TODO: Update to use correct SorobanRpc API calls

import type { Event, CreateEventData } from '../types';

export class StellarBlockchainService {
  async createEvent(data: CreateEventData, organizerAddress: string): Promise<{
    eventId: number;
    txHash: string;
  }> {
    // TODO: Implement with correct Stellar SDK v16 API
    throw new Error('Blockchain integration temporarily disabled - using localStorage fallback');
  }

  async registerForEvent(eventId: number, participantAddress: string): Promise<{
    success: boolean;
    txHash: string;
  }> {
    // TODO: Implement with correct Stellar SDK v16 API
    throw new Error('Blockchain integration temporarily disabled - using localStorage fallback');
  }

  async getAllEvents(): Promise<Event[]> {
    // Returns empty array - will use localStorage fallback in events service
    return [];
  }

  async getEvent(eventId: number): Promise<Event | null> {
    // Returns null - will use localStorage fallback in events service
    return null;
  }

  async isRegistered(eventId: number, participantAddress: string): Promise<boolean> {
    // Returns false - will use localStorage fallback
    return false;
  }
}

export const stellarBlockchain = new StellarBlockchainService();
