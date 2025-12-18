import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Toaster } from '@/components/ui/toaster';
import { Navbar } from '@/components/Navbar';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Home } from '@/pages/Home';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { Pitches } from '@/pages/Pitches';
import { PitchDetail } from '@/pages/PitchDetail';
import { MyBookings } from '@/pages/MyBookings';
import { Admin } from '@/pages/Admin';
import { AdminPitches } from '@/pages/AdminPitches';
import { AdminBookings } from '@/pages/AdminBookings';
import { Teams } from '@/pages/Teams';
import { TeamDetail } from '@/pages/TeamDetail';
import { CreateTeam } from '@/pages/CreateTeam';
import { Leagues } from '@/pages/Leagues';
import { LeagueDetail } from '@/pages/LeagueDetail';
import { CreateLeague } from '@/pages/CreateLeague';

function AppContent() {
  const { fetchUser, isLoading, setLoading } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    // Don't fetch user on login/register pages to avoid unnecessary /auth/me calls
    const isAuthPage = location.pathname === '/auth/login' || location.pathname === '/auth/register';
    if (isAuthPage) {
      // Set loading to false immediately on auth pages to avoid loading screen
      setLoading(false);
    } else {
      fetchUser();
    }
  }, [fetchUser, location.pathname, setLoading]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/pitches" element={<Pitches />} />
          <Route path="/pitches/:id" element={<PitchDetail />} />
          <Route
            path="/me/bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/pitches"
            element={
              <ProtectedRoute requireAdmin>
                <AdminPitches />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute requireAdmin>
                <AdminBookings />
              </ProtectedRoute>
            }
          />
          <Route path="/teams" element={<Teams />} />
          <Route
            path="/teams/create"
            element={
              <ProtectedRoute>
                <CreateTeam />
              </ProtectedRoute>
            }
          />
          <Route path="/teams/:id" element={<TeamDetail />} />
          <Route path="/leagues" element={<Leagues />} />
          <Route
            path="/leagues/create"
            element={
              <ProtectedRoute>
                <CreateLeague />
              </ProtectedRoute>
            }
          />
          <Route path="/leagues/:id" element={<LeagueDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;

