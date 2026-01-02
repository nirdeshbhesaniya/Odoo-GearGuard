import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { LoadingProvider } from './context/LoadingContext';
import PrivateRoute from './components/auth/PrivateRoute';
import Layout from './components/layout/Layout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import LandingPage from './pages/LandingPage';

// Dashboard
import Dashboard from './pages/Dashboard';

// Requests
import RequestList from './pages/requests/RequestList';
import RequestDetail from './pages/requests/RequestDetail';
import RequestCreate from './pages/requests/RequestCreate';
import KanbanBoard from './pages/requests/KanbanBoard';

// Equipment
import EquipmentList from './pages/equipment/EquipmentList';
import EquipmentDetail from './pages/equipment/EquipmentDetail';
import EquipmentCreate from './pages/equipment/EquipmentCreate';

// Teams
import TeamList from './pages/teams/TeamList';
import TeamDetail from './pages/teams/TeamDetail';
import TeamCreate from './pages/teams/TeamCreate';

// Calendar
import Calendar from './pages/Calendar';

// Analytics
import Analytics from './pages/Analytics';

// Reports
import Reports from './pages/Reports';

// Users
import UserList from './pages/users/UserList';
import Profile from './pages/users/Profile';

function App() {
  return (
    <LoadingProvider>
      <AuthProvider>
        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '8px',
              background: '#333',
              color: '#fff',
              fontSize: '14px',
            },
          }}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Private Routes */}
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Requests */}
              <Route path="/requests" element={<RequestList />} />
              <Route path="/requests/new" element={<RequestCreate />} />
              <Route path="/requests/:id" element={<RequestDetail />} />
              <Route path="/kanban" element={<KanbanBoard />} />

              {/* Equipment */}
              <Route path="/equipment" element={<EquipmentList />} />
              <Route path="/equipment/new" element={<EquipmentCreate />} />
              <Route path="/equipment/:id" element={<EquipmentDetail />} />

              {/* Teams */}
              <Route path="/teams" element={<TeamList />} />
              <Route path="/teams/new" element={<TeamCreate />} />
              <Route path="/teams/:id" element={<TeamDetail />} />

              {/* Calendar */}
              <Route path="/calendar" element={<Calendar />} />

              {/* Analytics */}
              <Route path="/analytics" element={<Analytics />} />

              {/* Reports */}
              <Route path="/reports" element={<Reports />} />

              {/* Users */}
              <Route path="/users" element={<UserList />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </LoadingProvider>
  );
}

export default App;
