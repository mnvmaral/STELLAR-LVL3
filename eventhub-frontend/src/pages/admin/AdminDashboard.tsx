import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { PageHeader } from '../../components/PageHeader';
import { StatsCard } from '../../components/StatsCard';
import { ActivityItem } from '../../components/ActivityItem';
import { eventsService } from '../../services/events';
import type { Activity } from '../../types';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    totalRegistrations: 0,
    upcomingEvents: 0,
  });
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [events, registrations, activities] = await Promise.all([
          eventsService.getEvents(),
          eventsService.getAllRegistrations(),
          eventsService.getActivities(),
        ]);

        setStats({
          totalEvents: events.length,
          activeEvents: events.filter(e => e.status === 'upcoming' || e.status === 'ongoing').length,
          totalRegistrations: registrations.filter(r => r.status === 'registered').length,
          upcomingEvents: events.filter(e => e.status === 'upcoming').length,
        });

        setRecentActivity(activities.slice(0, 10));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <DashboardLayout>
      <PageHeader
        title="Admin Dashboard"
        description="Overview of all events and registrations"
      />

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Events"
          value={stats.totalEvents}
          color="indigo"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
        <StatsCard
          title="Active Events"
          value={stats.activeEvents}
          color="green"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatsCard
          title="Total Registrations"
          value={stats.totalRegistrations}
          color="purple"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />
        <StatsCard
          title="Upcoming Events"
          value={stats.upcomingEvents}
          color="blue"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-custom-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : recentActivity.length > 0 ? (
          <div className="space-y-1">
            {recentActivity.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No recent activity</p>
        )}
      </div>
    </DashboardLayout>
  );
};
