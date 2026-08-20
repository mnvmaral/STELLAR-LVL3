import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/DashboardLayout';
import { PageHeader } from '../../components/PageHeader';
import { EmptyState } from '../../components/EmptyState';
import { Button } from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import { eventsService } from '../../services/events';
import type { Registration, Event } from '../../types';

export const MyEvents = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState<(Registration & { event?: Event })[]>([]);
  const [filter, setFilter] = useState<'all' | 'registered' | 'upcoming' | 'completed'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRegistrations = async () => {
      if (!user) return;
      
      try {
        const regs = await eventsService.getUserRegistrations(user.id);
        const events = await eventsService.getEvents();
        
        const regsWithEvents = regs.map(reg => ({
          ...reg,
          event: events.find(e => e.id === reg.eventId),
        }));
        
        setRegistrations(regsWithEvents);
      } finally {
        setLoading(false);
      }
    };
    
    loadRegistrations();
  }, [user]);

  const filteredRegistrations = registrations.filter(reg => {
    if (!reg.event) return false;
    if (filter === 'all') return true;
    if (filter === 'registered') return reg.status === 'registered';
    if (filter === 'upcoming') return reg.event.status === 'upcoming' && reg.status === 'registered';
    if (filter === 'completed') return reg.event.status === 'completed';
    return true;
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="My Events"
        description="View and manage your event registrations"
      />

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto">
        {['all', 'registered', 'upcoming', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as typeof filter)}
            className={`px-4 py-2 rounded-custom font-medium transition-colors whitespace-nowrap ${
              filter === f
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Registrations List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : filteredRegistrations.length > 0 ? (
        <div className="bg-white rounded-custom-lg shadow-sm overflow-hidden">
          {filteredRegistrations.map((reg, idx) => (
            <div
              key={reg.id}
              className={`p-6 ${
                idx !== filteredRegistrations.length - 1 ? 'border-b border-gray-200' : ''
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1 mb-4 sm:mb-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {reg.eventTitle}
                  </h3>
                  {reg.event && (
                    <>
                      <p className="text-gray-600 mb-2">
                        {formatDate(reg.event.date)} at {reg.event.time} • {reg.event.location}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-pastel-blue text-blue-800">
                          {reg.event.category}
                        </span>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          reg.status === 'registered' ? 'bg-green-100 text-green-800' :
                          reg.status === 'attended' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {reg.status}
                        </span>
                      </div>
                    </>
                  )}
                </div>
                <Link to={`/events/${reg.eventId}`}>
                  <Button variant="ghost" size="sm">
                    View Event
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={
            <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          }
          title="No events found"
          description={filter === 'all' ? "You haven't registered for any events yet" : `No ${filter} events found`}
          action={
            <Link to="/events">
              <Button>Browse Events</Button>
            </Link>
          }
        />
      )}
    </DashboardLayout>
  );
};
