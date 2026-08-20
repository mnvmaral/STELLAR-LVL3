import { useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { PageHeader } from '../../components/PageHeader';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { UserAvatar } from '../../components/UserAvatar';
import { Toast } from '../../components/Toast';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/auth';

export const AdminProfile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await authService.updateProfile(user.id, formData);
      setToast({ message: 'Profile updated successfully!', type: 'success' });
    } catch (error) {
      setToast({ 
        message: error instanceof Error ? error.message : 'Update failed', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <PageHeader
        title="Admin Profile"
        description="Manage your administrator account"
      />

      <div className="max-w-2xl">
        <div className="bg-white rounded-custom-lg shadow-sm p-8">
          <div className="flex items-center mb-8">
            <UserAvatar name={user.name} avatar={user.avatar} size="lg" />
            <div className="ml-6">
              <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
              <p className="text-gray-600 capitalize">{user.role}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Full Name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
            />

            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="you@example.com"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <div className="px-4 py-2 bg-gray-50 rounded-custom text-gray-700 capitalize">
                {user.role}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Member Since
              </label>
              <div className="px-4 py-2 bg-gray-50 rounded-custom text-gray-700">
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
            </div>

            <Button type="submit" loading={loading}>
              Save Changes
            </Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};
