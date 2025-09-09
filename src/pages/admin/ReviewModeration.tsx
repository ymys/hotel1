import React, { useState } from 'react';
import {
  Search,
  Filter,
  Star,
  User,
  Calendar,
  Building2,
  CheckCircle,
  XCircle,
  Eye,
  Flag,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Clock,
  AlertTriangle,
  X
} from 'lucide-react';

interface Review {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  branchId: string;
  branchName: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  isReported: boolean;
  reportReason?: string;
  bookingId: string;
  roomType: string;
  stayDuration: string;
  helpfulVotes: number;
  photos?: string[];
}

const ReviewModeration: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  // Mock reviews data
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      userId: '1',
      userName: 'John Smith',
      userEmail: 'john.smith@email.com',
      branchId: '1',
      branchName: 'Vinotel Grand Plaza',
      rating: 5,
      title: 'Excellent stay with outstanding service',
      content: 'I had an amazing experience at Vinotel Grand Plaza. The staff was incredibly friendly and helpful throughout my stay. The room was spacious, clean, and well-appointed. The location is perfect for exploring the city center. I would definitely recommend this branch to anyone visiting the area.',
      date: '2024-01-15',
      status: 'pending',
      isReported: false,
      bookingId: 'BK001',
      roomType: 'Deluxe Suite',
      stayDuration: '3 nights',
      helpfulVotes: 0,
      photos: ['photo1.jpg', 'photo2.jpg']
    },
    {
      id: '2',
      userId: '2',
      userName: 'Sarah Johnson',
      userEmail: 'sarah.j@email.com',
      branchId: '2',
      branchName: 'Vinotel Ocean View',
      rating: 2,
      title: 'Disappointing experience',
      content: 'The branch did not meet my expectations. The room was not as clean as I hoped, and the air conditioning was not working properly. The breakfast was mediocre at best. However, the ocean view was nice.',
      date: '2024-01-14',
      status: 'pending',
      isReported: true,
      reportReason: 'Potentially fake review - user has no other bookings',
      bookingId: 'BK002',
      roomType: 'Ocean View Room',
      stayDuration: '2 nights',
      helpfulVotes: 0
    },
    {
      id: '3',
      userId: '3',
      userName: 'Mike Davis',
      userEmail: 'mike.davis@email.com',
      branchId: '3',
      branchName: 'Vinotel Mountain Lodge',
      rating: 4,
      title: 'Great mountain getaway',
      content: 'Perfect location for a mountain retreat. The cabin was cozy and well-equipped. Staff was helpful with hiking recommendations. Only minor issue was the WiFi connection was a bit spotty.',
      date: '2024-01-13',
      status: 'approved',
      isReported: false,
      bookingId: 'BK003',
      roomType: 'Mountain Cabin',
      stayDuration: '4 nights',
      helpfulVotes: 12
    },
    {
      id: '4',
      userId: '4',
      userName: 'Emily Wilson',
      userEmail: 'emily.wilson@email.com',
      branchId: '1',
      branchName: 'Vinotel Grand Plaza',
      rating: 1,
      title: 'Terrible service and dirty rooms',
      content: 'This place is absolutely disgusting! The staff is rude and incompetent. I found bugs in my room and the bathroom was filthy. Complete waste of money. NEVER STAY HERE!!!',
      date: '2024-01-12',
      status: 'pending',
      isReported: true,
      reportReason: 'Inappropriate language and potentially defamatory',
      bookingId: 'BK004',
      roomType: 'Standard Room',
      stayDuration: '1 night',
      helpfulVotes: 0
    },
    {
      id: '5',
      userId: '5',
      userName: 'Robert Brown',
      userEmail: 'robert.brown@email.com',
      branchId: '2',
      branchName: 'Vinotel Ocean View',
      rating: 3,
      title: 'Average stay, nothing special',
      content: 'The branch was okay. Nothing particularly good or bad to report. Room was clean, staff was polite, food was decent. Price was reasonable for what you get.',
      date: '2024-01-11',
      status: 'rejected',
      isReported: false,
      bookingId: 'BK005',
      roomType: 'Standard Room',
      stayDuration: '2 nights',
      helpfulVotes: 0
    },
    {
      id: '6',
      userId: '6',
      userName: 'Lisa Anderson',
      userEmail: 'lisa.anderson@email.com',
      branchId: '3',
      branchName: 'Vinotel Mountain Lodge',
      rating: 5,
      title: 'Perfect family vacation spot',
      content: 'We had a wonderful family vacation here. The kids loved the outdoor activities and the staff organized great family-friendly events. The rooms were spacious enough for our family of four.',
      date: '2024-01-10',
      status: 'approved',
      isReported: false,
      bookingId: 'BK006',
      roomType: 'Family Suite',
      stayDuration: '5 nights',
      helpfulVotes: 8
    }
  ]);

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.branchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter;
    const matchesRating = ratingFilter === 'all' || review.rating.toString() === ratingFilter;
    
    return matchesSearch && matchesStatus && matchesRating;
  });

  const handleApprove = (reviewId: string) => {
    setReviews(reviews.map(review => 
      review.id === reviewId ? { ...review, status: 'approved' as const } : review
    ));
  };

  const handleReject = (reviewId: string, reason: string) => {
    setReviews(reviews.map(review => 
      review.id === reviewId ? { ...review, status: 'rejected' as const } : review
    ));
    setShowRejectionModal(false);
    setRejectionReason('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const ReviewDetailsModal: React.FC<{ review: Review; onClose: () => void }> = ({ review, onClose }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Review Details</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Review Header */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{review.title}</h3>
                  <div className="flex items-center mt-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className={`ml-2 text-sm font-medium ${getRatingColor(review.rating)}`}>
                      {review.rating}/5
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(review.status)}`}>
                    {review.status}
                  </span>
                  {review.isReported && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        <Flag className="w-3 h-3 mr-1" />
                        Reported
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Review Content */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed">{review.content}</p>
            </div>
            
            {/* Review Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Reviewer Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <User className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm">{review.userName}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600">{review.userEmail}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm">{review.date}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Booking Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm">{review.branchName}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Booking ID: {review.bookingId}
                  </div>
                  <div className="text-sm text-gray-600">
                    Room: {review.roomType}
                  </div>
                  <div className="text-sm text-gray-600">
                    Stay: {review.stayDuration}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Report Information */}
            {review.isReported && review.reportReason && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-red-500 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-900">Report Reason</h4>
                    <p className="text-red-700 text-sm mt-1">{review.reportReason}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Actions */}
            {review.status === 'pending' && (
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => {
                    setSelectedReview(review);
                    setShowRejectionModal(true);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </button>
                <button
                  onClick={() => {
                    handleApprove(review.id);
                    onClose();
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const RejectionModal: React.FC = () => {
    if (!selectedReview) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">Reject Review</h2>
            <button onClick={() => setShowRejectionModal(false)} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Please provide a reason for rejecting this review:
              </p>
            </div>
            
            <div>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter rejection reason..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                rows={4}
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setShowRejectionModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(selectedReview.id, rejectionReason)}
                disabled={!rejectionReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reject Review
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Review Moderation</h1>
        <p className="text-gray-600 mt-1">Review and moderate customer reviews</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
              <p className="text-2xl font-bold text-gray-900">{reviews.filter(r => r.status === 'pending').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">{reviews.filter(r => r.status === 'approved').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <XCircle className="w-8 h-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">{reviews.filter(r => r.status === 'rejected').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Flag className="w-8 h-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Reported</p>
              <p className="text-2xl font-bold text-gray-900">{reviews.filter(r => r.isReported).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search reviews, users, or branches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none bg-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="relative">
          <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none bg-white"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Review
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reviewer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Branch
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <div className="flex items-start">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900 truncate">{review.title}</div>
                          <div className="text-sm text-gray-500 mt-1 line-clamp-2">{review.content}</div>
                        </div>
                        {review.isReported && (
                          <Flag className="w-4 h-4 text-red-500 ml-2 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-vinotel-primary/10 flex items-center justify-center">
          <User className="w-4 h-4 text-vinotel-primary" />
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{review.userName}</div>
                        <div className="text-sm text-gray-500">{review.userEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{review.branchName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className={`ml-2 text-sm font-medium ${getRatingColor(review.rating)}`}>
                        {review.rating}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-900">{review.date}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(review.status)}`}>
                      {review.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedReview(review);
                          setShowDetailsModal(true);
                        }}
                        className="text-vinotel-primary hover:text-vinotel-primary/80"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {review.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(review.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedReview(review);
                              setShowRejectionModal(true);
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Details Modal */}
      {showDetailsModal && selectedReview && (
        <ReviewDetailsModal
          review={selectedReview}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedReview(null);
          }}
        />
      )}

      {/* Rejection Modal */}
      {showRejectionModal && <RejectionModal />}
    </div>
  );
};

export default ReviewModeration;