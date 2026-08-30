import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/DashboardLayout';
import { PageHeader } from '../../components/PageHeader';
import { Button } from '../../components/Button';
import { SearchBar } from '../../components/SearchBar';
import { FilterBar } from '../../components/FilterBar';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { EventStatusBadge } from '../../components/EventStatusBadge';
import { ConfirmationDialog } from '../../components/ConfirmationDialog';
import { Toast } from '../../components/Toast';
import { TransactionSuccessModal } from '../../components/TransactionSuccessModal';
import { eventsService } from '../../services/events';
import type { Event, CreateEventData, EventCategory, TransactionState } from '../../types';

export const AdminEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [transactionState, setTransactionState] = useState<TransactionState>('idle');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [successModal, setSuccessModal] = useState<{ isOpen: boolean; txHash: string; title: string; message: string }>({
    isOpen: false,
    txHash: '',
    title: '',
    message: '',
  });

  const [formData, setFormData] = useState<CreateEventData>({
    title: '',
    description: '',
    category: 'Cultural',
    date: '',
    time: '',
    location: '',
    organizer: '',
    maxParticipants: 100,
    coverImage: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    let filtered = events;

    if (searchQuery) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((event) => event.category === categoryFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((event) => event.status === statusFilter);
    }

    setFilteredEvents(filtered);
  }, [events, searchQuery, categoryFilter, statusFilter]);

  const loadEvents = async () => {
    try {
      const data = await eventsService.getEvents();
      setEvents(data);
      setFilteredEvents(data);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Cultural',
      date: '',
      time: '',
      location: '',
      organizer: '',
      maxParticipants: 100,
      coverImage: '',
    });
    setFormErrors({});
    setEditingEvent(null);
  };

  const handleCreate = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      category: event.category,
      date: event.date,
      time: event.time,
      location: event.location,
      organizer: event.organizer,
      maxParticipants: event.maxParticipants,
      coverImage: event.coverImage || '',
    });
    setModalOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.title) errors.title = 'Title is required';
    if (!formData.description) errors.description = 'Description is required';
    if (!formData.date) errors.date = 'Date is required';
    if (!formData.time) errors.time = 'Time is required';
    if (!formData.location) errors.location = 'Location is required';
    if (!formData.organizer) errors.organizer = 'Organizer is required';
    if (formData.maxParticipants < 1) errors.maxParticipants = 'Must be at least 1';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setTransactionState('pending');
      
      if (editingEvent) {
        // Update is localStorage only (no blockchain function exists)
        await eventsService.updateEvent({ ...formData, id: editingEvent.id });
        setToast({ message: 'Event updated successfully! (Note: Update is localStorage only, not on-chain)', type: 'success' });
        setTransactionState('success');
        await loadEvents();
        
        setTimeout(() => {
          setModalOpen(false);
          resetForm();
          setTransactionState('idle');
        }, 1000);
      } else {
        // Create triggers full blockchain flow: check wallet → request permission → sign → submit → confirm
        const { event, txHash } = await eventsService.createEvent(formData);
        
        console.log('✅ Event created with txHash:', txHash);
        
        setTransactionState('success');
        await loadEvents();
        
        // Show success modal with transaction hash
        setSuccessModal({
          isOpen: true,
          txHash,
          title: 'Event Created Successfully!',
          message: `"${event.title}" has been created and confirmed on the Stellar blockchain.`,
        });
        
        setTimeout(() => {
          setModalOpen(false);
          resetForm();
          setTransactionState('idle');
        }, 1000);
      }
    } catch (error: any) {
      setTransactionState('failed');
      
      // Map error codes to user-friendly messages
      let errorMessage = 'Operation failed';
      
      if (error.message === 'WALLET_NOT_INSTALLED') {
        errorMessage = 'Freighter wallet not installed. Please install Freighter extension to continue.';
      } else if (error.message === 'WALLET_LOCKED') {
        errorMessage = 'Wallet is locked. Please unlock Freighter and try again.';
      } else if (error.message === 'WRONG_NETWORK') {
        errorMessage = 'Wrong network selected. Please switch to Stellar Testnet in Freighter.';
      } else if (error.message === 'PERMISSION_DENIED' || error.message === 'CONNECTION_REJECTED') {
        errorMessage = 'Wallet connection rejected. Please approve the connection request in Freighter.';
      } else if (error.message === 'TRANSACTION_REJECTED') {
        errorMessage = 'Transaction rejected. Please approve the transaction in Freighter to create the event.';
      } else if (error.message === 'ACCOUNT_NOT_FUNDED') {
        errorMessage = 'Your Stellar account is not funded. Please fund your account with XLM on Testnet.';
      } else if (error.message === 'INSUFFICIENT_BALANCE') {
        errorMessage = 'Insufficient XLM balance to complete the transaction.';
      } else if (error.message?.includes('Simulation failed')) {
        errorMessage = `Transaction simulation failed: ${error.message}`;
      } else {
        errorMessage = error.message || 'Operation failed. Please try again.';
      }
      
      setToast({ message: errorMessage, type: 'error' });
      setTimeout(() => setTransactionState('idle'), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    setTransactionState('pending');

    try {
      // Delete is localStorage only (no blockchain function exists)
      await eventsService.deleteEvent(id);
      setToast({ message: 'Event deleted successfully! (Note: Delete is localStorage only, not on-chain)', type: 'success' });
      await loadEvents();
      setDeleteConfirm(null);
      setTransactionState('idle');
    } catch (error) {
      setToast({
        message: error instanceof Error ? error.message : 'Delete failed',
        type: 'error',
      });
      setTransactionState('idle');
    }
  };

  const categoryOptions = [
    { value: 'Cultural', label: 'Cultural' },
    { value: 'Sports', label: 'Sports' },
    { value: 'Tech', label: 'Tech' },
    { value: 'Business', label: 'Business' },
    { value: 'Education', label: 'Education' },
    { value: 'Other', label: 'Other' },
  ];

  return (
    <DashboardLayout>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <TransactionSuccessModal
        isOpen={successModal.isOpen}
        onClose={() => setSuccessModal({ ...successModal, isOpen: false })}
        txHash={successModal.txHash}
        title={successModal.title}
        message={successModal.message}
      />

      <PageHeader
        title="Events Management"
        description="Create and manage all events"
        action={
          <Button onClick={handleCreate}>
            <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Event
          </Button>
        }
      />

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search events..."
        />
        <FilterBar
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-custom-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participants
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{event.title}</div>
                      <div className="text-sm text-gray-500">{event.location}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {event.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(event.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {event.currentParticipants} / {event.maxParticipants}
                    </td>
                    <td className="px-6 py-4">
                      <EventStatusBadge status={event.status} />
                    </td>
                    <td className="px-6 py-4 text-right text-sm space-x-2">
                      <Link to={`/events/${event.id}`}>
                        <button className="text-indigo-600 hover:text-indigo-900">View</button>
                      </Link>
                      <button
                        onClick={() => handleEdit(event)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(event.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">No events found</div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          resetForm();
          setTransactionState('idle');
        }}
        title={editingEvent ? 'Edit Event' : 'Create New Event'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Event Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              error={formErrors.title}
              placeholder="Enter event title"
            />

            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as EventCategory })}
              options={categoryOptions}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              error={formErrors.date}
            />

            <Input
              label="Time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              error={formErrors.time}
            />
          </div>

          <Input
            label="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            error={formErrors.location}
            placeholder="Event location"
          />

          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Organizer"
              value={formData.organizer}
              onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
              error={formErrors.organizer}
              placeholder="Organizer name"
            />

            <Input
              label="Max Participants"
              type="number"
              value={formData.maxParticipants}
              onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
              error={formErrors.maxParticipants}
              min="1"
            />
          </div>

          <Input
            label="Cover Image URL (optional)"
            value={formData.coverImage}
            onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
            placeholder="https://example.com/image.jpg"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`w-full px-4 py-2 rounded-custom border ${
                formErrors.description ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
              rows={4}
              placeholder="Event description"
            />
            {formErrors.description && (
              <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setModalOpen(false);
                resetForm();
                setTransactionState('idle');
              }}
            >
              Cancel
            </Button>
            <Button type="submit" transactionState={transactionState}>
              {editingEvent ? 'Update Event' : 'Create Event'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </DashboardLayout>
  );
};
