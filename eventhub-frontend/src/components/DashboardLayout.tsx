import type { ReactNode } from 'react';
import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { UserAvatar } from './UserAvatar';
import { SearchBar } from './SearchBar';
import { useAuth } from '../context/AuthContext';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar role={user.role} />
      
      <div className="lg:pl-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 max-w-lg">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search events..."
                />
              </div>
              
              <div className="flex items-center space-x-4 ml-4">
                {/* Notifications */}
                <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>

                {/* User Avatar */}
                <div className="flex items-center space-x-3">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                  <UserAvatar name={user.name} avatar={user.avatar} />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
};
