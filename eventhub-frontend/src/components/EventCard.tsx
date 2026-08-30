import { Link } from 'react-router-dom';
import type { Event } from '../types';
import { EventStatusBadge } from './EventStatusBadge';
import { Button } from './Button';

interface EventCardProps {
  event: Event;
  showActions?: boolean;
  onRegister?: (eventId: string) => void;
}

export const EventCard = ({ event, showActions = false, onRegister }: EventCardProps) => {
  const categoryColors: Record<string, string> = {
    Cultural: 'bg-pastel-purple text-purple-800',
    Sports: 'bg-pastel-orange text-orange-800',
    Tech: 'bg-pastel-blue text-blue-800',
    Business: 'bg-pastel-green text-green-800',
    Education: 'bg-pastel-yellow text-yellow-800',
    Other: 'bg-gray-200 text-gray-800',
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isFull = event.currentParticipants >= event.maxParticipants;
  const isDemoEvent = event.status === 'demo';

  return (
    <div className="bg-white rounded-custom-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Demo Event Banner */}
      {isDemoEvent && (
        <div className="bg-yellow-100 border-b border-yellow-200 px-4 py-2">
          <p className="text-xs text-yellow-800 font-medium text-center">
            ⚠️ Demo Event - Not Available for Registration
          </p>
        </div>
      )}
      
      {/* Cover Image */}
      {event.coverImage && (
        <div className="h-48 overflow-hidden">
          <img
            src={event.coverImage}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        {/* Category and Status */}
        <div className="flex items-center justify-between mb-3">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${categoryColors[event.category]}`}>
            {event.category}
          </span>
          <EventStatusBadge status={event.status} />
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-2">
          {event.description}
        </p>

        {/* Date, Time, Location */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(event.date)} at {event.time}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {event.location}
          </div>
        </div>

        {/* Participants */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">
            {event.currentParticipants} / {event.maxParticipants} participants
          </span>
          {isFull && (
            <span className="text-xs text-red-600 font-medium">Event Full</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Link to={`/events/${event.id}`} className="flex-1">
            <Button variant="secondary" fullWidth>
              View Details
            </Button>
          </Link>
          {showActions && onRegister && !isDemoEvent && (
            <Button 
              variant="primary" 
              onClick={() => onRegister(event.id)}
              disabled={isFull}
            >
              Register
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
