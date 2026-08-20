import type { EventStatus } from '../types';

interface EventStatusBadgeProps {
  status: EventStatus;
}

export const EventStatusBadge = ({ status }: EventStatusBadgeProps) => {
  const styles = {
    upcoming: 'bg-pastel-blue text-blue-800',
    ongoing: 'bg-pastel-green text-green-800',
    completed: 'bg-pastel-purple text-purple-800',
    cancelled: 'bg-gray-200 text-gray-800',
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};
