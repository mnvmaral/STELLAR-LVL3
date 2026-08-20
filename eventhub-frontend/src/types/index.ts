export type UserRole = 'user' | 'admin';

export type EventCategory = 'Cultural' | 'Sports' | 'Tech' | 'Business' | 'Education' | 'Other';

export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export type RegistrationStatus = 'registered' | 'attended' | 'cancelled';

export type TransactionState = 
  | 'idle'
  | 'wallet-required'
  | 'wallet-selection'
  | 'waiting-for-wallet'
  | 'user-rejected'
  | 'pending'
  | 'success'
  | 'failed'
  | 'insufficient-balance'
  | 'wallet-unavailable';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  date: string;
  time: string;
  location: string;
  organizer: string;
  maxParticipants: number;
  currentParticipants: number;
  coverImage?: string;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Registration {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  eventId: string;
  eventTitle: string;
  registrationDate: string;
  status: RegistrationStatus;
}

export interface Activity {
  id: string;
  type: 'event-created' | 'event-updated' | 'event-deleted' | 'user-registered' | 'registration-cancelled';
  message: string;
  timestamp: string;
  userId?: string;
  userName?: string;
  eventId?: string;
  eventTitle?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface CreateEventData {
  title: string;
  description: string;
  category: EventCategory;
  date: string;
  time: string;
  location: string;
  organizer: string;
  maxParticipants: number;
  coverImage?: string;
}

export interface UpdateEventData extends Partial<CreateEventData> {
  id: string;
}
