import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { PageHeader } from '../../components/PageHeader';
import { ActivityItem } from '../../components/ActivityItem';
import { EmptyState } from '../../components/EmptyState';
import { eventsService } from '../../services/events';
import type { Activity } from '../../types';

export const AdminActivity = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const data = await eventsService.getActivities();
        setActivities(data);
      } finally {
        setLoading(false);
      }
    };
    loadActivities();
  }, []);

  return (
    <DashboardLayout>
      <PageHeader
        title="Activity Timeline"
        description="All system activity and event history"
      />

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : activities.length > 0 ? (
        <div className="bg-white rounded-custom-lg shadow-sm overflow-hidden">
          {activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={
            <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          title="No activity yet"
          description="Activity will appear here as actions are performed"
        />
      )}
    </DashboardLayout>
  );
};
