import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/store/authStore";
import { useDirection } from "@/hooks/useDirection";
import { Toaster } from "@/ui2/components/ui/Toaster";
import { Navbar } from "@/components/Navbar";
import { AppLoader } from "@/components/common/AppLoader";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Home } from "@/pages/Home";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { Pitches } from "@/pages/Pitches";
import { PitchDetail } from "@/pages/PitchDetail";
import { MyBookings } from "@/pages/MyBookings";
import { Admin } from "@/pages/Admin";
import { AdminPitches } from "@/pages/AdminPitches";
import { AdminBookings } from "@/pages/AdminBookings";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminRoute } from "@/components/admin/AdminRoute";
import { AdminOverview } from "@/pages/admin/AdminOverview";
import { AdminUsers } from "@/pages/admin/AdminUsers";
import { AdminTeams } from "@/pages/admin/AdminTeams";
import { AdminLeagues } from "@/pages/admin/AdminLeagues";
import { AdminPitches as AdminPitchesNew } from "@/pages/admin/AdminPitches";
import { AdminPosts } from "@/pages/admin/AdminPosts";
import { AdminSettings } from "@/pages/admin/AdminSettings";
import { Teams } from "@/pages/Teams";
import { TeamDetail } from "@/pages/TeamDetail";
import { CreateTeam } from "@/pages/CreateTeam";
import { Leagues } from "@/pages/Leagues";
import { LeagueDetail } from "@/pages/LeagueDetail";
import { Community } from "@/pages/Community";
import { PostDetail } from "@/pages/PostDetail";
import { CreatePost } from "@/pages/CreatePost";
import { CreateLeague } from "@/pages/CreateLeague";
import { Profile } from "@/pages/Profile";
import { GamesHubPage } from "@/features/games/pages/GamesHubPage";
import { GamePage } from "@/features/games/pages/GamePage";

function AppContent() {
  const { t } = useTranslation();
  const { fetchUser, isLoading, setLoading } = useAuthStore();
  const { dir } = useDirection();
  const location = useLocation();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // Don't fetch user on login/register pages to avoid unnecessary /auth/me calls
    const isAuthPage =
      location.pathname === "/auth/login" ||
      location.pathname === "/auth/register";
    if (isAuthPage) {
      // Set loading to false immediately on auth pages to avoid loading screen
      setLoading(false);
    } else {
      fetchUser();
    }
  }, [fetchUser, location.pathname, setLoading]);

  // Track initial load - hide loader after minimum display time
  useEffect(() => {
    if (!isLoading && isInitialLoad) {
      // Show loader for initial load
      const timer = setTimeout(() => {
        setIsInitialLoad(false);
      }, 1200); // Hide after 1200ms (loader shows for 800ms + fade time)
      return () => clearTimeout(timer);
    }
  }, [isLoading, isInitialLoad]);

  if (isLoading) {
    return (
      <>
        <AppLoader initialLoad={isInitialLoad} />
      </>
    );
  }

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      <AppLoader initialLoad={isInitialLoad} />
      <div 
        className={isAdminRoute ? "overflow-x-hidden" : "min-h-screen overflow-x-hidden relative"} 
        dir={dir}
        style={isAdminRoute ? { 
          margin: 0, 
          padding: 0, 
          marginTop: 0, 
          paddingTop: 0,
          position: 'relative',
          top: 0,
          left: 0,
          right: 0,
          height: '100vh',
          minHeight: '100vh'
        } : {}}
      >
        {!isAdminRoute && <Navbar />}
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
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        {/* Legacy admin routes - kept for backward compatibility */}
        <Route
          path="/admin/old"
          element={
            <ProtectedRoute requireAdmin>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/pitches/old"
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
        {/* New admin dashboard routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Navigate to="/admin/overview" replace />} />
          <Route path="overview" element={<AdminOverview />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="teams" element={<AdminTeams />} />
          <Route path="leagues" element={<AdminLeagues />} />
          <Route path="pitches" element={<AdminPitchesNew />} />
          <Route path="posts" element={<AdminPosts />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
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
        <Route path="/community" element={<Community />} />
        <Route path="/community/post/:id" element={<PostDetail />} />
        <Route
          path="/community/create"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />
        <Route path="/games" element={<GamesHubPage />} />
        <Route path="/games/:slug" element={<GamePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
      </div>
    </>
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
