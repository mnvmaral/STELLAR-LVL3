import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/DashboardLayout';
import { PageHeader } from '../../components/PageHeader';
import { EventCard } from '../../components/EventCard';
import { ActivityItem } from '../../components/ActivityItem';
import { EmptyState } from '../../components/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { eventsService } from '../../services/events';
import type { Event, Registration, Activity } from '../../types';

export const Dashboard = () => {
  const { user } = useAuth();
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [myRegistrations, setMyRegistrations] = useState<Registration[]>([]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      try {
        const [events, registrations, activities] = await Promise.all([
          eventsService.getEvents(),
          eventsService.getUserRegistrations(user.id),
          eventsService.getUserActivities(user.id),
        ]);
        
        setUpcomingEvents(events.filter(e => e.status === 'upcoming').slice(0, 3));
        setMyRegistrations(registrations.filter(r => r.status === 'registered').slice(0, 3));
        setRecentActivity(activities.slice(0, 5));
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };
    
    loadData();
  }, [user]);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <DashboardLayout>
      <PageHeader
        title={`${greeting()}, ${user?.name}!`}
        description="Here's what's happening with your events"
      />

      {/* Welcome Banner */}
      <div className="gradient-primary rounded-custom-lg p-8 text-white mb-8">
        <h2 className="text-2xl font-bold mb-2">Welcome to EventHub</h2>
        <p className="text-indigo-100">
          Discover and register for amazing events happening around you
        </p>
        <Link to="/events">
          <button className="mt-4 bg-white text-indigo-600 px-6 py-2 rounded-custom font-medium hover:bg-indigo-50 transition-colors">
            Browse Events
          </button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Events */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
              <Link to="/upcoming-events" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                View all
              </Link>
            </div>
            {upcomingEvents.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
                title="No upcoming events"
                description="Check back later for new events"
              />
            )}
          </div>

          {/* My Registrations */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">My Registrations</h2>
              <Link to="/my-events" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                View all
              </Link>
            </div>
            {myRegistrations.length > 0 ? (
              <div className="bg-white rounded-custom-lg shadow-sm overflow-hidden">
                {myRegistrations.map((reg, idx) => (
                  <div
                    key={reg.id}
                    className={`p-4 flex items-center justify-between ${
                      idx !== myRegistrations.length - 1 ? 'border-b border-gray-200' : ''
                    }`}
                  >
                    <div>
                      <h3 className="font-medium text-gray-900">{reg.eventTitle}</h3>
                      <p className="text-sm text-gray-500">
                        Registered on {new Date(reg.registrationDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Link to={`/events/${reg.eventId}`}>
                      <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                        View
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                }
                title="No registrations yet"
                description="Start by browsing and registering for events"
              />
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-custom-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            {recentActivity.length > 0 ? (
              <div className="space-y-1">
                {recentActivity.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No activity yet"
                description="Your activity will appear here"
              />
            )}
            {recentActivity.length > 0 && (
              <Link to="/activity" className="block mt-4 text-center text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                View all activity
              </Link>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
