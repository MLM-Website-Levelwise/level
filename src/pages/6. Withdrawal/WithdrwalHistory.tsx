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
  status: 'approved' | 'rejected';
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const WithdrawalHistory = () => {
  const [history, setHistory] = useState<RequestData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      
      const response = await axios.get(`${API_BASE_URL}/admin/withdrawals/history`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setHistory(response.data.data);
      } else {
        throw new Error(response.data.error || "Failed to fetch history");
      }
    } catch (err) {
      console.error("Error fetching history:", err);
      setError(err.response?.data?.error || err.message || "Failed to fetch history");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

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
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Withdrawal History
          </h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center p-4 text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-max">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">User ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Bank</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{formatDate(item.date)}</td>
                    <td className="px-4 py-3 text-sm">{item.userId}</td>
                    <td className="px-4 py-3 text-sm">{item.name}</td>
                    <td className="px-4 py-3 text-sm">₹{item.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm">{item.bankName}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.status === 'approved' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawalHistory;