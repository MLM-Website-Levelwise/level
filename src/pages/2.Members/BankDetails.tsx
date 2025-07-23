import React, { useState, useEffect } from "react";
import axios from "axios";

const BankDetails = () => {
  const [bankData, setBankData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    holderName: "",
    bankName: "",
    branch: "",
    ifsc: "",
    accountNumber: "",
    accountType: "",
    panNumber: ""
  });

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
          const formattedData = response.data.map((item, index) => ({
            id: item.id, // Use the actual database ID now
            tableId: index + 1, // For display only
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

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setEditFormData({
      holderName: item.holderName,
      bankName: item.bankName,
      branch: item.branch,
      ifsc: item.ifsc,
      accountNumber: item.accountNumber,
      accountType: item.accountType,
      panNumber: item.panNumber
    });
  };

  const handleCancelClick = () => {
    setEditingId(null);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleSaveClick = async (id) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/update-bank-details/${id}`,
        {
          account_holder_name: editFormData.holderName,
          bank_name: editFormData.bankName,
          branch_name: editFormData.branch,
          ifsc_code: editFormData.ifsc,
          account_number: editFormData.accountNumber,
          account_type: editFormData.accountType,
          pan_number: editFormData.panNumber
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setBankData(bankData.map(item => {
        if (item.id === id) {
          return {
            ...item,
            holderName: response.data.account_holder_name,
            bankName: response.data.bank_name,
            branch: response.data.branch_name,
            ifsc: response.data.ifsc_code,
            accountNumber: response.data.account_number,
            accountType: response.data.account_type,
            panNumber: response.data.pan_number
          };
        }
        return item;
      }));

      setEditingId(null);
    } catch (err) {
      console.error('Error updating bank details:', err);
      setError(err.response?.data?.error || 'Failed to update bank details');
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  if (bankData.length === 0) {
    return <div className="p-6">No bank details found</div>;
  }

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
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bankData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.tableId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.doj}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.memberId}</td>
                
                {editingId === item.id ? (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        name="holderName"
                        value={editFormData.holderName}
                        onChange={handleEditFormChange}
                        className="text-sm border rounded p-1 w-full"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        name="bankName"
                        value={editFormData.bankName}
                        onChange={handleEditFormChange}
                        className="text-sm border rounded p-1 w-full"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        name="branch"
                        value={editFormData.branch}
                        onChange={handleEditFormChange}
                        className="text-sm border rounded p-1 w-full"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        name="ifsc"
                        value={editFormData.ifsc}
                        onChange={handleEditFormChange}
                        className="text-sm border rounded p-1 w-full"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        name="accountNumber"
                        value={editFormData.accountNumber}
                        onChange={handleEditFormChange}
                        className="text-sm border rounded p-1 w-full"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        name="accountType"
                        value={editFormData.accountType}
                        onChange={handleEditFormChange}
                        className="text-sm border rounded p-1 w-full"
                      >
                        <option value="Savings">Savings</option>
                        <option value="Current">Current</option>
                        <option value="Salary">Salary</option>
                        <option value="Other">Other</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        name="panNumber"
                        value={editFormData.panNumber}
                        onChange={handleEditFormChange}
                        className="text-sm border rounded p-1 w-full"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleSaveClick(item.id)}
                        className="text-green-600 hover:text-green-900 mr-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelClick}
                        className="text-red-600 hover:text-red-900"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.holderName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.bankName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.branch}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.ifsc}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.accountNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.accountType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.panNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BankDetails;