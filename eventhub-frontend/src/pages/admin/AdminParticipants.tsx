import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { PageHeader } from '../../components/PageHeader';
import { SearchBar } from '../../components/SearchBar';
import { eventsService } from '../../services/events';
import type { Registration } from '../../types';

export const AdminParticipants = () => {
  const [participants, setParticipants] = useState<Registration[]>([]);
  const [filteredParticipants, setFilteredParticipants] = useState<Registration[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await eventsService.getAllRegistrations();
        const registered = data.filter(r => r.status === 'registered');
        setParticipants(registered);
        setFilteredParticipants(registered);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = participants.filter(
        (p) =>
          p.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.eventTitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredParticipants(filtered);
    } else {
      setFilteredParticipants(participants);
    }
  }, [searchQuery, participants]);

  return (
    <DashboardLayout>
      <PageHeader
        title="Participants"
        description="View all registered participants"
      />

      <div className="mb-6">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search participants..."
        />
      </div>

      <div className="bg-white rounded-custom-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredParticipants.length > 0 ? (
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredParticipants.map((participant) => (
                  <tr key={participant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {participant.userName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {participant.userEmail}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {participant.eventTitle}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(participant.registrationDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">No participants found</div>
        )}
      </div>
    </DashboardLayout>
  );
};
