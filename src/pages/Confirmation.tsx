import React from 'react';
import { useParams } from 'react-router-dom';

const Confirmation: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-vinotel-primary mb-6">Booking Confirmed</h1>
        <p className="text-gray-600">Booking ID: {bookingId} - Coming Soon</p>
      </div>
    </div>
  );
};

export default Confirmation;