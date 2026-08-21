import type { Event, CreateEventData, UpdateEventData, Registration, Activity } from '../types';
import { stellarBlockchain } from './stellar-blockchain';
import { stellarWallet } from './stellar-wallet';

const EVENTS_KEY = 'eventhub_events';
const REGISTRATIONS_KEY = 'eventhub_registrations';
const ACTIVITIES_KEY = 'eventhub_activities';

// Track if blockchain is being used
let useBlockchain = false;

// Check if blockchain is available
try {
  if (import.meta.env.VITE_EVENT_CONTRACT_ID) {
    useBlockchain = true;
  }
} catch (e) {
  console.log('Blockchain not configured, using local storage');
}

// Seed exactly 2 events in August 2026
const seedEvents = (): Event[] => [
  {
    id: 'event-1',
    title: 'Summer Cultural Festival 2026',
    description: 'Join us for an amazing celebration of diverse cultures featuring traditional music, dance performances, art exhibitions, and authentic cuisines from around the world. This family-friendly event promises to be an unforgettable experience.',
    category: 'Cultural',
    date: '2026-08-22',
    time: '14:00',
    location: 'Central Park Amphitheater',
    organizer: 'City Cultural Committee',
    maxParticipants: 500,
    currentParticipants: 0,
    coverImage: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
    status: 'upcoming',
    createdAt: new Date('2026-08-01').toISOString(),
    updatedAt: new Date('2026-08-01').toISOString(),
  },
  {
    id: 'event-2',
    title: 'Annual Marathon Championship',
    description: 'Challenge yourself in our annual marathon event! Whether you\'re a seasoned runner or a beginner, we have categories for everyone. Includes 5K, 10K, half-marathon, and full marathon distances. Registration includes a race kit, medal, and refreshments.',
    category: 'Sports',
    date: '2026-08-28',
    time: '06:00',
    location: 'Riverside Sports Complex',
    organizer: 'Metro Sports Association',
    maxParticipants: 1000,
    currentParticipants: 0,
    coverImage: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800',
    status: 'upcoming',
    createdAt: new Date('2026-08-05').toISOString(),
    updatedAt: new Date('2026-08-05').toISOString(),
  },
];

// Initialize events if not exist
const initializeEvents = () => {
  const events = localStorage.getItem(EVENTS_KEY);
  if (!events) {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(seedEvents()));
  }
  
  const registrations = localStorage.getItem(REGISTRATIONS_KEY);
  if (!registrations) {
    localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify([]));
  }
  
  const activities = localStorage.getItem(ACTIVITIES_KEY);
  if (!activities) {
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify([]));
  }
};

initializeEvents();

const addActivity = (activity: Omit<Activity, 'id' | 'timestamp'>) => {
  const activities: Activity[] = JSON.parse(localStorage.getItem(ACTIVITIES_KEY) || '[]');
  const newActivity: Activity = {
    ...activity,
    id: `activity-${Date.now()}`,
    timestamp: new Date().toISOString(),
  };
  activities.unshift(newActivity);
  localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
};

export const eventsService = {
  getEvents: async (): Promise<Event[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Try blockchain first
    if (useBlockchain) {
      try {
        const blockchainEvents = await stellarBlockchain.getAllEvents();
        // Merge with seed events
        const localEvents: Event[] = JSON.parse(localStorage.getItem(EVENTS_KEY) || JSON.stringify(seedEvents()));
        const mergedEvents = [...localEvents];
        
        // Add blockchain events that aren't already in local
        blockchainEvents.forEach(be => {
          if (!mergedEvents.find(le => le.id === be.id)) {
            mergedEvents.push(be);
          }
        });
        
        return mergedEvents;
      } catch (error) {
        console.error('Blockchain fetch failed, using local storage:', error);
      }
    }
    
    return JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]');
  },

  getEventById: async (id: string): Promise<Event | null> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const events: Event[] = JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]');
    return events.find(e => e.id === id) || null;
  },

  createEvent: async (data: CreateEventData): Promise<Event> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Blockchain is REQUIRED for event creation
    const walletState = stellarWallet.getState();
    if (!walletState.isConnected || !walletState.publicKey) {
      throw new Error('WALLET_NOT_CONNECTED');
    }

    try {
      const { eventId, txHash } = await stellarBlockchain.createEvent(data, walletState.publicKey);
      
      const newEvent: Event = {
        ...data,
        id: `event-${eventId}`,
        currentParticipants: 0,
        status: 'upcoming',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Store locally as well for quick access/caching
      const events: Event[] = JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]');
      events.push(newEvent);
      localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
      
      addActivity({
        type: 'event-created',
        message: `Event "${newEvent.title}" was created on blockchain (TX: ${txHash.substring(0, 8)}...)`,
        eventId: newEvent.id,
        eventTitle: newEvent.title,
      });
      
      return newEvent;
    } catch (error: any) {
      console.error('Blockchain create failed:', error);
      throw error;
    }
  },

  updateEvent: async (data: UpdateEventData): Promise<Event> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const events: Event[] = JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]');
    const index = events.findIndex(e => e.id === data.id);
    
    if (index === -1) {
      throw new Error('Event not found');
    }
    
    events[index] = {
      ...events[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
    
    addActivity({
      type: 'event-updated',
      message: `Event "${events[index].title}" was updated`,
      eventId: events[index].id,
      eventTitle: events[index].title,
    });
    
    return events[index];
  },

  deleteEvent: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const events: Event[] = JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]');
    const event = events.find(e => e.id === id);
    
    if (!event) {
      throw new Error('Event not found');
    }
    
    const filteredEvents = events.filter(e => e.id !== id);
    localStorage.setItem(EVENTS_KEY, JSON.stringify(filteredEvents));
    
    // Also remove registrations for this event
    const registrations: Registration[] = JSON.parse(localStorage.getItem(REGISTRATIONS_KEY) || '[]');
    const filteredRegistrations = registrations.filter(r => r.eventId !== id);
    localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(filteredRegistrations));
    
    addActivity({
      type: 'event-deleted',
      message: `Event "${event.title}" was deleted`,
      eventId: event.id,
      eventTitle: event.title,
    });
  },

  registerForEvent: async (eventId: string, userId: string, userName: string, userEmail: string): Promise<Registration> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const events: Event[] = JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]');
    const event = events.find(e => e.id === eventId);
    
    if (!event) {
      throw new Error('Event not found');
    }
    
    if (event.currentParticipants >= event.maxParticipants) {
      throw new Error('EVENT_FULL');
    }
    
    const registrations: Registration[] = JSON.parse(localStorage.getItem(REGISTRATIONS_KEY) || '[]');
    
    // Check if already registered
    if (registrations.find(r => r.eventId === eventId && r.userId === userId && r.status === 'registered')) {
      throw new Error('ALREADY_REGISTERED');
    }
    
    // Blockchain is REQUIRED for registration
    const walletState = stellarWallet.getState();
    if (!walletState.isConnected || !walletState.publicKey) {
      throw new Error('WALLET_NOT_CONNECTED');
    }

    try {
      // Extract numeric event ID from string ID
      const numericEventId = parseInt(eventId.replace('event-', ''));
      
      const { txHash } = await stellarBlockchain.registerForEvent(numericEventId, walletState.publicKey);
      
      const newRegistration: Registration = {
        id: `reg-${Date.now()}`,
        userId,
        userName,
        userEmail,
        eventId,
        eventTitle: event.title,
        registrationDate: new Date().toISOString(),
        status: 'registered',
      };
      
      registrations.push(newRegistration);
      localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(registrations));
      
      // Update event participant count
      event.currentParticipants += 1;
      const eventIndex = events.findIndex(e => e.id === eventId);
      events[eventIndex] = event;
      localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
      
      addActivity({
        type: 'user-registered',
        message: `${userName} registered for "${event.title}" on blockchain (TX: ${txHash.substring(0, 8)}...)`,
        userId,
        userName,
        eventId,
        eventTitle: event.title,
      });
      
      return newRegistration;
    } catch (error: any) {
      console.error('Blockchain registration failed:', error);
      throw error;
    }
  },

  cancelRegistration: async (registrationId: string, userId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const registrations: Registration[] = JSON.parse(localStorage.getItem(REGISTRATIONS_KEY) || '[]');
    const registration = registrations.find(r => r.id === registrationId && r.userId === userId);
    
    if (!registration) {
      throw new Error('Registration not found');
    }
    
    const regIndex = registrations.findIndex(r => r.id === registrationId);
    registrations[regIndex].status = 'cancelled';
    localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(registrations));
    
    // Update event participant count
    const events: Event[] = JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]');
    const event = events.find(e => e.id === registration.eventId);
    if (event) {
      event.currentParticipants = Math.max(0, event.currentParticipants - 1);
      const eventIndex = events.findIndex(e => e.id === registration.eventId);
      events[eventIndex] = event;
      localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
    }
    
    addActivity({
      type: 'registration-cancelled',
      message: `${registration.userName} cancelled registration for "${registration.eventTitle}"`,
      userId: registration.userId,
      userName: registration.userName,
      eventId: registration.eventId,
      eventTitle: registration.eventTitle,
    });
  },

  getUserRegistrations: async (userId: string): Promise<Registration[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const registrations: Registration[] = JSON.parse(localStorage.getItem(REGISTRATIONS_KEY) || '[]');
    return registrations.filter(r => r.userId === userId);
  },

  getAllRegistrations: async (): Promise<Registration[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return JSON.parse(localStorage.getItem(REGISTRATIONS_KEY) || '[]');
  },

  getActivities: async (): Promise<Activity[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return JSON.parse(localStorage.getItem(ACTIVITIES_KEY) || '[]');
  },

  getUserActivities: async (userId: string): Promise<Activity[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const activities: Activity[] = JSON.parse(localStorage.getItem(ACTIVITIES_KEY) || '[]');
    return activities.filter(a => a.userId === userId);
  },
};
