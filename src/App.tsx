import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Home from "@/pages/Home";
import SearchResults from "@/pages/SearchResults";
import BranchDetails from "@/pages/BranchDetails";
import Booking from "@/pages/Booking";
import Confirmation from "@/pages/Confirmation";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import Dashboard from "@/pages/Dashboard";
import DashboardBookings from "@/pages/DashboardBookings";
import DashboardProfile from "@/pages/DashboardProfile";
import DashboardFavorites from "@/pages/DashboardFavorites";

// Auth providers
import { UserAuthProvider } from "@/contexts/UserAuthContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import UserProtectedRoute from "@/components/UserProtectedRoute";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminProtectedRoute from "@/components/admin/AdminProtectedRoute";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import BranchManagement from "@/pages/admin/BranchManagement";
import BookingManagement from "@/pages/admin/BookingManagement";
import UserManagement from "@/pages/admin/UserManagement";
import AdminManagement from "@/pages/admin/AdminManagement";
import RoomAvailability from "@/pages/admin/RoomAvailability";
import ReviewModeration from "@/pages/admin/ReviewModeration";
import RoomManagement from "@/pages/admin/RoomManagement";

export default function App() {
  return (
    <UserAuthProvider>
      <AdminAuthProvider>
        <Router>
          <Routes>
            {/* Customer Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/branch/:id" element={<BranchDetails />} />
            <Route path="/booking/:branchId" element={<Booking />} />
            <Route path="/confirmation/:bookingId" element={<Confirmation />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard" element={
              <UserProtectedRoute>
                <Dashboard />
              </UserProtectedRoute>
            } />
            <Route path="/dashboard/bookings" element={
              <UserProtectedRoute>
                <DashboardBookings />
              </UserProtectedRoute>
            } />
            <Route path="/dashboard/profile" element={
              <UserProtectedRoute>
                <DashboardProfile />
              </UserProtectedRoute>
            } />
            <Route path="/dashboard/favorites" element={
              <UserProtectedRoute>
                <DashboardFavorites />
              </UserProtectedRoute>
            } />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="branches" element={
              <AdminProtectedRoute requiredPermission="manage_branches">
                <BranchManagement />
              </AdminProtectedRoute>
            } />
            <Route path="rooms" element={
              <AdminProtectedRoute requiredPermission="manage_rooms">
                <RoomManagement />
              </AdminProtectedRoute>
            } />
            <Route path="bookings" element={
              <AdminProtectedRoute requiredPermission="manage_bookings">
                <BookingManagement />
              </AdminProtectedRoute>
            } />
            <Route path="users" element={
              <AdminProtectedRoute requiredPermission="manage_users">
                <UserManagement />
              </AdminProtectedRoute>
            } />
            <Route path="admins" element={
              <AdminProtectedRoute requiredPermission="manage_admins">
                <AdminManagement />
              </AdminProtectedRoute>
            } />
            <Route path="availability" element={
              <AdminProtectedRoute requiredPermission="manage_rooms">
                <RoomAvailability />
              </AdminProtectedRoute>
            } />
            <Route path="reviews" element={
              <AdminProtectedRoute requiredPermission="manage_reviews">
                <ReviewModeration />
              </AdminProtectedRoute>
            } />
          </Route>
          </Routes>
          <Toaster position="top-right" richColors />
        </Router>
      </AdminAuthProvider>
    </UserAuthProvider>
  );
}
