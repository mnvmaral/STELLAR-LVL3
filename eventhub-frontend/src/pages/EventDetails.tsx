import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/Button';
import { EventStatusBadge } from '../components/EventStatusBadge';
import { Toast } from '../components/Toast';
import { TransactionSuccessModal } from '../components/TransactionSuccessModal';
import { useAuth } from '../context/AuthContext';
import { eventsService } from '../services/events';
import type { Event, TransactionState } from '../types';

export const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [transactionState, setTransactionState] = useState<TransactionState>('idle');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [successModal, setSuccessModal] = useState<{ isOpen: boolean; txHash: string; title: string; message: string }>({
    isOpen: false,
    txHash: '',
    title: '',
    message: '',
  });

  useEffect(() => {
    const loadEvent = async () => {
      if (!id) return;
      
      try {
        const data = await eventsService.getEventById(id);
        setEvent(data);
        
        // Check if user is registered
        if (user) {
          const registrations = await eventsService.getUserRegistrations(user.id);
          const registered = registrations.some(r => r.eventId === id && r.status === 'registered');
          setIsRegistered(registered);
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadEvent();
  }, [id, user]);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!event || !user) return;

    try {
      // Set state to show we're starting the wallet flow
      setTransactionState('pending');
      
      // This will trigger the full flow: check wallet → request permission → get address → verify network → sign → submit → confirm
      const { registration, txHash } = await eventsService.registerForEvent(event.id, user.id, user.name, user.email);
      
      console.log('✅ Registration confirmed with txHash:', txHash);
      
      // Only reach here if transaction was confirmed on-chain
      setTransactionState('success');
      setIsRegistered(true);
      
      // Show success modal with transaction hash
      setSuccessModal({
        isOpen: true,
        txHash,
        title: 'Registration Successful!',
        message: `You've successfully registered for "${event.title}". Your registration has been confirmed on the Stellar blockchain.`,
      });
      
      // Reload event to update participant count
      const updatedEvent = await eventsService.getEventById(event.id);
      setEvent(updatedEvent);
      
      setTimeout(() => setTransactionState('idle'), 2000);
    } catch (error: any) {
      setTransactionState('failed');
      
      // Map error codes to user-friendly messages
      let errorMessage = 'Registration failed';
      
      if (error.message === 'WALLET_NOT_INSTALLED') {
        errorMessage = 'Freighter wallet not installed. Please install Freighter extension to continue.';
      } else if (error.message === 'WALLET_LOCKED') {
        errorMessage = 'Wallet is locked. Please unlock Freighter and try again.';
      } else if (error.message === 'WRONG_NETWORK') {
        errorMessage = 'Wrong network selected. Please switch to Stellar Testnet in Freighter.';
      } else if (error.message === 'PERMISSION_DENIED' || error.message === 'CONNECTION_REJECTED') {
        errorMessage = 'Wallet connection rejected. Please approve the connection request in Freighter.';
      } else if (error.message === 'TRANSACTION_REJECTED') {
        errorMessage = 'Transaction rejected. Please approve the transaction in Freighter to complete registration.';
      } else if (error.message === 'ALREADY_REGISTERED') {
        errorMessage = 'You are already registered for this event.';
      } else if (error.message === 'EVENT_FULL') {
        errorMessage = 'Event is full. Registration is no longer available.';
      } else if (error.message === 'ACCOUNT_NOT_FUNDED') {
        errorMessage = 'Your Stellar account is not funded. Please fund your account with XLM on Testnet.';
      } else if (error.message === 'INSUFFICIENT_BALANCE') {
        errorMessage = 'Insufficient XLM balance to complete the transaction.';
      } else if (error.message?.includes('Simulation failed')) {
        errorMessage = `Transaction simulation failed: ${error.message}`;
      } else {
        errorMessage = error.message || 'Registration failed. Please try again.';
      }
      
      setToast({ message: errorMessage, type: 'error' });
      setTimeout(() => setTransactionState('idle'), 3000);
    }
  };

  const handleCancelRegistration = async () => {
    if (!event || !user) return;

    try {
      setTransactionState('pending');
      
      // Find the user's registration
      const registrations = await eventsService.getUserRegistrations(user.id);
      const registration = registrations.find(r => r.eventId === event.id && r.status === 'registered');
      
      if (registration) {
        // This will trigger Freighter signing popup and blockchain transaction
        const { txHash } = await eventsService.cancelRegistration(registration.id, user.id);
        
        console.log('✅ Cancellation confirmed with txHash:', txHash);
        
        setTransactionState('success');
        setIsRegistered(false);
        
        // Show success modal with transaction hash
        setSuccessModal({
          isOpen: true,
          txHash,
          title: 'Registration Cancelled!',
          message: `Your registration for "${event.title}" has been cancelled on the Stellar blockchain.`,
        });
        
        // Reload event to update participant count
        const updatedEvent = await eventsService.getEventById(event.id);
        setEvent(updatedEvent);
      }
      
      setTimeout(() => setTransactionState('idle'), 2000);
    } catch (error: any) {
      setTransactionState('failed');
      
      let errorMessage = 'Cancellation failed';
      
      if (error.message === 'WALLET_NOT_INSTALLED') {
        errorMessage = 'Freighter wallet not installed. Please install Freighter extension to continue.';
      } else if (error.message === 'WALLET_LOCKED') {
        errorMessage = 'Wallet is locked. Please unlock Freighter and try again.';
      } else if (error.message === 'WRONG_NETWORK') {
        errorMessage = 'Wrong network selected. Please switch to Stellar Testnet in Freighter.';
      } else if (error.message === 'PERMISSION_DENIED' || error.message === 'CONNECTION_REJECTED') {
        errorMessage = 'Wallet connection rejected. Please approve the connection request in Freighter.';
      } else if (error.message === 'TRANSACTION_REJECTED') {
        errorMessage = 'Transaction rejected. Please approve the transaction in Freighter to cancel registration.';
      } else if (error.message === 'NOT_REGISTERED') {
        errorMessage = 'You are not registered for this event.';
      } else if (error.message === 'ACCOUNT_NOT_FUNDED') {
        errorMessage = 'Your Stellar account is not funded. Please fund your account with XLM on Testnet.';
      } else if (error.message === 'INSUFFICIENT_BALANCE') {
        errorMessage = 'Insufficient XLM balance to complete the transaction.';
      } else {
        errorMessage = error.message || 'Cancellation failed. Please try again.';
      }
      
      setToast({
        message: errorMessage,
        type: 'error',
      });
      setTimeout(() => setTransactionState('idle'), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Event not found</h2>
          <Link to="/events" className="text-indigo-600 hover:text-indigo-700 mt-4 inline-block">
            Browse all events
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isFull = event.currentParticipants >= event.maxParticipants;
  const isDemoEvent = event.status === 'demo';
  const canRegister = isAuthenticated && !isRegistered && !isFull && event.status === 'upcoming' && !isDemoEvent;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <TransactionSuccessModal
        isOpen={successModal.isOpen}
        onClose={() => setSuccessModal({ ...successModal, isOpen: false })}
        txHash={successModal.txHash}
        title={successModal.title}
        message={successModal.message}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cover Image */}
        {event.coverImage && (
          <div className="rounded-custom-lg overflow-hidden mb-6 h-96">
            <img
              src={event.coverImage}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Event Info */}
        <div className="bg-white rounded-custom-lg shadow-sm p-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>
              <div className="flex flex-wrap gap-3 mb-6">
                <EventStatusBadge status={event.status} />
                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-pastel-purple text-purple-800">
                  {event.category}
                </span>
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="space-y-4 mb-8">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-gray-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="font-medium text-gray-900">{formatDate(event.date)}</p>
                <p className="text-gray-600">at {event.time}</p>
              </div>
            </div>

            <div className="flex items-start">
              <svg className="w-6 h-6 text-gray-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <p className="font-medium text-gray-900">Location</p>
                <p className="text-gray-600">{event.location}</p>
              </div>
            </div>

            <div className="flex items-start">
              <svg className="w-6 h-6 text-gray-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <div>
                <p className="font-medium text-gray-900">Organized by</p>
                <p className="text-gray-600">{event.organizer}</p>
              </div>
            </div>

            <div className="flex items-start">
              <svg className="w-6 h-6 text-gray-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <div>
                <p className="font-medium text-gray-900">Participants</p>
                <p className="text-gray-600">
                  {event.currentParticipants} / {event.maxParticipants} registered
                  {isFull && <span className="text-red-600 ml-2 font-medium">(Full)</span>}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-gray-200 pt-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">About this event</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{event.description}</p>
          </div>

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row gap-4">
            {isDemoEvent ? (
              <div className="flex-1 bg-yellow-50 border border-yellow-200 rounded-custom p-4">
                <p className="text-yellow-800 font-medium">
                  ⚠️ Demo Event - Not Available for Registration
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  This is a demonstration event. Create a real event via Admin panel to enable blockchain registration.
                </p>
              </div>
            ) : isRegistered ? (
              <>
                <div className="flex-1 bg-green-50 border border-green-200 rounded-custom p-4 text-center">
                  <p className="text-green-800 font-medium">✓ You're registered for this event</p>
                </div>
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={handleCancelRegistration}
                  transactionState={transactionState}
                >
                  Cancel Registration
                </Button>
              </>
            ) : canRegister ? (
              <Button
                size="lg"
                fullWidth
                onClick={handleRegister}
                transactionState={transactionState}
              >
                Register for Event
              </Button>
            ) : !isAuthenticated ? (
              <Link to="/login" className="flex-1">
                <Button size="lg" fullWidth>
                  Login to Register
                </Button>
              </Link>
            ) : isFull ? (
              <div className="flex-1 bg-red-50 border border-red-200 rounded-custom p-4 text-center">
                <p className="text-red-800 font-medium">Event is full</p>
              </div>
            ) : null}
            
            <Link to="/events">
              <Button size="lg" variant="ghost">
                Back to Events
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
