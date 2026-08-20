import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { PageHeader } from '../components/PageHeader';
import { SearchBar } from '../components/SearchBar';
import { FilterBar } from '../components/FilterBar';
import { EventCard } from '../components/EventCard';
import { CardSkeleton } from '../components/LoadingSkeleton';
import { EmptyState } from '../components/EmptyState';
import { eventsService } from '../services/events';
import type { Event } from '../types';

export const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await eventsService.getEvents();
        setEvents(data);
        setFilteredEvents(data);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  useEffect(() => {
    let filtered = events;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((event) => event.category === categoryFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const eventDate = (event: Event) => new Date(event.date);

      if (dateFilter === 'upcoming') {
        filtered = filtered.filter((event) => eventDate(event) > now);
      } else if (dateFilter === 'this-week') {
        const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(
          (event) => eventDate(event) > now && eventDate(event) <= weekFromNow
        );
      } else if (dateFilter === 'this-month') {
        const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(
          (event) => eventDate(event) > now && eventDate(event) <= monthFromNow
        );
      }
    }

    setFilteredEvents(filtered);
  }, [events, searchQuery, categoryFilter, dateFilter]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="Browse Events"
          description="Discover amazing events happening around you"
        />

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search events by title, description, or location..."
          />
          <FilterBar
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            dateFilter={dateFilter}
            onDateChange={setDateFilter}
          />
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={
              <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
            title="No events found"
            description="Try adjusting your search or filters"
          />
        )}
      </div>
    </div>
  );
};
