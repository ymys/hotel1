import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import SearchResults from "@/pages/SearchResults";
import HotelDetails from "@/pages/HotelDetails";
import Booking from "@/pages/Booking";
import Confirmation from "@/pages/Confirmation";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import Dashboard from "@/pages/Dashboard";
import DashboardBookings from "@/pages/DashboardBookings";
import DashboardProfile from "@/pages/DashboardProfile";
import DashboardFavorites from "@/pages/DashboardFavorites";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/hotel/:id" element={<HotelDetails />} />
        <Route path="/booking/:hotelId" element={<Booking />} />
        <Route path="/confirmation/:bookingId" element={<Confirmation />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/bookings" element={<DashboardBookings />} />
        <Route path="/dashboard/profile" element={<DashboardProfile />} />
        <Route path="/dashboard/favorites" element={<DashboardFavorites />} />
      </Routes>
    </Router>
  );
}
