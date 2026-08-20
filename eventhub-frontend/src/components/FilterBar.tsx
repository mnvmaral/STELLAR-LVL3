import { Select } from './Select';

interface FilterBarProps {
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  dateFilter?: string;
  onDateChange?: (value: string) => void;
  statusFilter?: string;
  onStatusChange?: (value: string) => void;
}

export const FilterBar = ({ 
  categoryFilter, 
  onCategoryChange, 
  dateFilter, 
  onDateChange,
  statusFilter,
  onStatusChange 
}: FilterBarProps) => {
  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'Cultural', label: 'Cultural' },
    { value: 'Sports', label: 'Sports' },
    { value: 'Tech', label: 'Tech' },
    { value: 'Business', label: 'Business' },
    { value: 'Education', label: 'Education' },
    { value: 'Other', label: 'Other' },
  ];

  const dateOptions = [
    { value: 'all', label: 'All Dates' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'this-week', label: 'This Week' },
    { value: 'this-month', label: 'This Month' },
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <Select
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value)}
          options={categoryOptions}
        />
      </div>
      {dateFilter !== undefined && onDateChange && (
        <div className="flex-1">
          <Select
            value={dateFilter}
            onChange={(e) => onDateChange(e.target.value)}
            options={dateOptions}
          />
        </div>
      )}
      {statusFilter !== undefined && onStatusChange && (
        <div className="flex-1">
          <Select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            options={statusOptions}
          />
        </div>
      )}
    </div>
  );
};
