import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { PageHeader } from '../../components/PageHeader';
import { SearchBar } from '../../components/SearchBar';
import { eventsService } from '../../services/events';
import type { Registration } from '../../types';

export const AdminRegistrations = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<Registration[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await eventsService.getAllRegistrations();
        setRegistrations(data);
        setFilteredRegistrations(data);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = registrations.filter(
        (reg) =>
          reg.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          reg.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
          reg.eventTitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRegistrations(filtered);
    } else {
      setFilteredRegistrations(registrations);
    }
  }, [searchQuery, registrations]);

  return (
    <DashboardLayout>
      <PageHeader
        title="Registrations"
        description="View all event registrations"
      />

      <div className="mb-6">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by name, email, or event..."
        />
      </div>

      <div className="bg-white rounded-custom-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredRegistrations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Registration Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {reg.userName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {reg.userEmail}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {reg.eventTitle}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(reg.registrationDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        reg.status === 'registered' ? 'bg-green-100 text-green-800' :
                        reg.status === 'attended' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {reg.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">No registrations found</div>
        )}
      </div>
    </DashboardLayout>
  );
};
