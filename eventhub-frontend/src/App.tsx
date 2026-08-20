import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Events } from './pages/Events';
import { EventDetails } from './pages/EventDetails';
import { About } from './pages/About';

// User Pages
import { Dashboard } from './pages/user/Dashboard';
import { MyEvents } from './pages/user/MyEvents';
import { UpcomingEvents } from './pages/user/UpcomingEvents';
import { Activity } from './pages/user/Activity';
import { Profile } from './pages/user/Profile';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminEvents } from './pages/admin/AdminEvents';
import { AdminRegistrations } from './pages/admin/AdminRegistrations';
import { AdminParticipants } from './pages/admin/AdminParticipants';
import { AdminActivity } from './pages/admin/AdminActivity';
import { AdminProfile } from './pages/admin/AdminProfile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/about" element={<About />} />

          {/* User Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="user">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-events"
            element={
              <ProtectedRoute requiredRole="user">
                <MyEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upcoming-events"
            element={
              <ProtectedRoute requiredRole="user">
                <UpcomingEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/activity"
            element={
              <ProtectedRoute requiredRole="user">
                <Activity />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute requiredRole="user">
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/events"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/events/create"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/registrations"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminRegistrations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/participants"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminParticipants />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/activity"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminActivity />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminProfile />
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
