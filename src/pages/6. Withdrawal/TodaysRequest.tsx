import React, { useState, useEffect } from "react";
import axios from "axios";

interface RequestData {
  id: number;
  date: string;
  userId: string;
  name: string;
  wallet: string;
  amount: number;
  bankName: string;
  branch: string;
  accountNo: string;
  ifsc: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Requests: React.FC = () => {
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [remarks, setRemarks] = useState<{ [key: number]: string }>({});

  const fetchRequests = async () => {
  try {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    
    const response = await axios.get(`${API_BASE_URL}/admin/withdrawals`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      params: {
        status: statusFilter,
        page: currentPage,
        limit: 10
      }
    });

    if (response.data.success) {
      setRequests(response.data.data);
      setTotalPages(Math.ceil(response.data.total / 10));
    } else {
      throw new Error(response.data.error || "Failed to fetch requests");
    }
  } catch (err) {
    console.error("Error fetching requests:", err);
    if (err.response?.status === 403) {
      // Handle admin authentication error
      setError("Admin access required. Please log in as admin.");
      // Optionally redirect to admin login
      // navigate('/admin/login');
    } else {
      setError(err.response?.data?.error || err.message || "Failed to fetch requests");
    }
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
    fetchRequests();
  }, [statusFilter, currentPage]);

  const handleAction = async (id: number, action: 'approve' | 'reject') => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/admin/withdrawals/${id}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          action: action
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update status");
    }

    const result = await response.json();
    
    // Update local state - remove approved requests from current view
    if (action === 'approve') {
      setRequests(prevRequests => 
        prevRequests.filter(request => request.id !== id)
      );
    } else {
      // For rejections, just update the status
      setRequests(prevRequests =>
        prevRequests.map(request =>
          request.id === id
            ? { ...request, status: 'rejected' }
            : request
        )
      );
    }

  } catch (error) {
    console.error('Error updating withdrawal:', error);
  }
};

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-4 w-full">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Withdrawal Requests
          </h2>
          <div className="flex space-x-2">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center p-4 text-red-500">{error}</div>
        ) : (
          <>
            {/* Responsive Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-max">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">
                      Sl No.
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">
                      Date & Time
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">
                      User ID
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">
                      Wallet
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">
                      Bank Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">
                      Branch
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">
                      A/c No
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">
                      IFSC
                    </th>
                    {statusFilter === 'pending' && (
                      <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">
                        Action
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {requests.map((request, index) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                        {(currentPage - 1) * 10 + index + 1}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                        {formatDate(request.date)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                        {request.userId}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                        {request.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                        {request.wallet}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium whitespace-nowrap">
                        ₹{request.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                        {request.bankName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                        {request.branch}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                        {request.accountNo}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                        {request.ifsc}
                      </td>
                      {statusFilter === 'pending' && (
                        <td className="px-4 py-3 text-sm whitespace-nowrap">
                          <div className="flex flex-col space-y-2">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleAction(request.id, "approve")}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleAction(request.id, "reject")}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                              >
                                Reject
                              </button>
                            </div>
                            {/* <textarea
                              placeholder="Remarks (optional)"
                              value={remarks[request.id] || ''}
                              onChange={(e) => setRemarks({
                                ...remarks,
                                [request.id]: e.target.value
                              })}
                              className="border border-gray-300 rounded p-1 text-xs w-full"
                              rows={2}
                            /> */}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {requests.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-2">No {statusFilter} requests found</div>
                <div className="text-gray-500 text-sm">
                  There are no {statusFilter} withdrawal requests to display.
                </div>
              </div>
            )}

            {/* Pagination */}
            {requests.length > 0 && (
              <div className="px-4 py-3 border-t border-gray-200 flex justify-between items-center">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Requests;