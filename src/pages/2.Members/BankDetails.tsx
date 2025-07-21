import React, { useState, useEffect } from "react";
import axios from "axios";

const BankDetails = () => {
  const [bankData, setBankData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/all-bank-details`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.data && response.data.length > 0) {
          // Format the data to match the table structure
          const formattedData = response.data.map((item, index) => ({
            id: index + 1,
            doj: new Date(item.created_at).toISOString().split('T')[0],
            memberId: item.member_id,
            holderName: item.member_name || item.account_holder_name,
            bankName: item.bank_name,
            branch: item.branch_name,
            ifsc: item.ifsc_code,
            accountNumber: item.account_number,
            accountType: item.account_type,
            panNumber: item.pan_number
          }));
          setBankData(formattedData);
        } else {
          setBankData([]);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching bank details:', err);
        setError(err.response?.data?.error || 'Failed to fetch bank details');
        setLoading(false);
      }
    };

    fetchBankDetails();
  }, []);

  // Loading, error, and empty states remain the same as before
  // ... (keep all the existing conditional rendering code)

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Bank Details
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-600">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">SL No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">DOJ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Member ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Holder Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Bank Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Branch</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">IFSC</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Account Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Account Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">PAN Number</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bankData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.doj}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.memberId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.holderName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.bankName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.branch}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.ifsc}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.accountNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.accountType}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.panNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BankDetails;