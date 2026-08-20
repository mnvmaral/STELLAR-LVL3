import type { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  color?: string;
}

export const StatsCard = ({ title, value, icon, color = 'indigo' }: StatsCardProps) => {
  const colorClasses = {
    indigo: 'bg-indigo-100 text-indigo-600',
    purple: 'bg-purple-100 text-purple-600',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
  };

  return (
    <div className="bg-white rounded-custom-lg p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-custom ${colorClasses[color as keyof typeof colorClasses] || colorClasses.indigo}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};
