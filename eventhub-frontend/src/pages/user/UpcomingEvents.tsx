import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { PageHeader } from '../../components/PageHeader';
import { EventCard } from '../../components/EventCard';
import { EmptyState } from '../../components/EmptyState';
import { CardSkeleton } from '../../components/LoadingSkeleton';
import { eventsService } from '../../services/events';
import type { Event } from '../../types';

export const UpcomingEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await eventsService.getEvents();
        const upcoming = data.filter(e => e.status === 'upcoming');
        setEvents(upcoming);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  return (
    <DashboardLayout>
      <PageHeader
        title="Upcoming Events"
        description="Discover events happening soon"
      />

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : events.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={
            <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
          title="No upcoming events"
          description="Check back later for new events"
        />
      )}
    </DashboardLayout>
  );
};
