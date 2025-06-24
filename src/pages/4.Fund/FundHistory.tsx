import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Loader,
  Edit,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

interface Transaction {
  id: number;
  memberId: string;
  memberName: string;
  amount: number;
  date: string;
  transferType: string;
  status: string;
  original_amount?: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const FundHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  // State for filters
  const [filters, setFilters] = useState({
    memberId: "",
    dateFrom: "",
    dateTo: "",
    transferType: "",
  });

  // State for edit modal
  const [editModal, setEditModal] = useState({
    isOpen: false,
    transaction: null as Transaction | null,
    adjustment: "",
    adjustmentType: "add" as "add" | "subtract",
    notes: "",
    isSubmitting: false,
  });

  // Fetch transactions from API
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(
        `${API_BASE_URL}/admin-wallet-transactions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page: pagination.page,
            limit: pagination.limit,
            memberId: filters.memberId,
            dateFrom: filters.dateFrom,
            dateTo: filters.dateTo,
            transferType: filters.transferType === "Main Wallet" ? "main" : 
                         filters.transferType === "Re Top-up Wallet" ? "retopup" : "",
          },
        }
      );

      setTransactions(response.data.transactions);
      setPagination((prev) => ({
        ...prev,
        total: response.data.total,
      }));
    } catch (err: any) {
      setError(err.message || "Failed to fetch transactions");
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [pagination.page, filters]);

  // Handle filter changes
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
    // Reset to first page when filters change
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Open edit modal
  const openEditModal = (transaction: Transaction) => {
    setEditModal({
      isOpen: true,
      transaction,
      adjustment: "",
      adjustmentType: "add",
      notes: "",
      isSubmitting: false,
    });
  };

  // Close edit modal
  const closeEditModal = () => {
    setEditModal({
      isOpen: false,
      transaction: null,
      adjustment: "",
      adjustmentType: "add",
      notes: "",
      isSubmitting: false,
    });
  };

  // Handle adjustment change
  const handleAdjustmentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditModal({
      ...editModal,
      [name]: value,
    });
  };

  // Calculate new amount based on adjustment
  const calculateNewAmount = () => {
    if (!editModal.transaction) return 0;
    
    const adjustmentValue = parseFloat(editModal.adjustment) || 0;
    const currentAmount = editModal.transaction.amount;
    
    return editModal.adjustmentType === "add"
      ? currentAmount + adjustmentValue
      : currentAmount - adjustmentValue;
  };

  // Calculate new original amount after adjustment
  const calculateNewOriginalAmount = () => {
    if (!editModal.transaction) return 0;
    
    const adjustmentValue = parseFloat(editModal.adjustment) || 0;
    const originalAmount = editModal.transaction.original_amount || editModal.transaction.amount;
    
    return editModal.adjustmentType === "add"
      ? originalAmount + adjustmentValue
      : originalAmount - adjustmentValue;
  };

  // Submit adjustment
  const submitAdjustment = async () => {
  if (!editModal.transaction) return;

  try {
    setEditModal(prev => ({ ...prev, isSubmitting: true }));
    
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const adjustmentValue = parseFloat(editModal.adjustment) || 0;
    const newAmount = calculateNewAmount();
    
    if (newAmount < 0) {
      throw new Error("Amount cannot be negative");
    }

    await axios.put(
      `${API_BASE_URL}/update-wallet-transaction`,
      {
        transactionId: editModal.transaction.id,
        newAmount,
        newOriginalAmount: calculateNewOriginalAmount(), // Send calculated original amount
        adjustmentType: editModal.adjustmentType,
        notes: editModal.notes || `Amount ${editModal.adjustmentType}ed by admin`,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success("Transaction updated successfully");
    fetchTransactions();
    closeEditModal();
  } catch (error: any) {
    console.error("Error updating transaction:", error);
    toast.error(error.message || "Failed to update transaction");
  } finally {
    setEditModal(prev => ({ ...prev, isSubmitting: false }));
  }
};

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Fund History</h1>
          <p className="text-gray-600 mt-1">
            View all admin-initiated fund transfer transactions
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200 mb-6 p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label
                htmlFor="memberId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Member ID
              </label>
              <input
                type="text"
                id="memberId"
                name="memberId"
                value={filters.memberId}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by ID"
              />
            </div>
            <div>
              <label
                htmlFor="dateFrom"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date From
              </label>
              <input
                type="date"
                id="dateFrom"
                name="dateFrom"
                value={filters.dateFrom}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="dateTo"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date To
              </label>
              <input
                type="date"
                id="dateTo"
                name="dateTo"
                value={filters.dateTo}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="transferType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Transfer Type
              </label>
              <select
                id="transferType"
                name="transferType"
                value={filters.transferType}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Types</option>
                <option value="Main Wallet">Main Wallet</option>
                <option value="Re Top-up Wallet">Re Top-up Wallet</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() =>
                setFilters({
                  memberId: "",
                  dateFrom: "",
                  dateTo: "",
                  transferType: "",
                })
              }
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="flex justify-center items-center py-10">
            <Loader className="animate-spin h-8 w-8 text-blue-500" />
            <span className="ml-2">Loading transactions...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <XCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      SL No.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Member ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Member Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Transfer Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((transaction, index) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(pagination.page - 1) * pagination.limit + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        {transaction.memberId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.memberName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex flex-col">
                          ${transaction.original_amount?.toFixed(2) || transaction.amount.toFixed(2)}
                          {/* <span>Current: ${transaction.amount.toFixed(2)}</span> */}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.transferType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Success
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button
                          onClick={() => openEditModal(transaction)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          title="Edit transaction"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={
                    pagination.page * pagination.limit >= pagination.total
                  }
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {(pagination.page - 1) * pagination.limit + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(
                        pagination.page * pagination.limit,
                        pagination.total
                      )}
                    </span>{" "}
                    of <span className="font-medium">{pagination.total}</span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="sr-only">Previous</span>
                      &larr;
                    </button>
                    {Array.from(
                      { length: Math.ceil(pagination.total / pagination.limit) },
                      (_, i) => i + 1
                    )
                      .slice(
                        Math.max(0, pagination.page - 3),
                        Math.min(
                          Math.ceil(pagination.total / pagination.limit),
                          pagination.page + 2
                        )
                      )
                      .map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            pagination.page === pageNum
                              ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      ))}
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={
                        pagination.page * pagination.limit >= pagination.total
                      }
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="sr-only">Next</span>
                      &rarr;
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editModal.isOpen && editModal.transaction && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Adjust Transaction Amount
                  </h3>
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">
                      Member: {editModal.transaction.memberName} (
                      {editModal.transaction.memberId})
                    </p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-500">
                        Original Amount: ${editModal.transaction.original_amount?.toFixed(2) || editModal.transaction.amount.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Current Amount: ${editModal.transaction.amount.toFixed(2)}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Date: {formatDate(editModal.transaction.date)}
                    </p>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adjustment Type
                    </label>
                    <select
                      name="adjustmentType"
                      value={editModal.adjustmentType}
                      onChange={handleAdjustmentChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="add">Add Amount</option>
                      <option value="subtract">Subtract Amount</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adjustment Amount
                    </label>
                    <input
                      type="number"
                      name="adjustment"
                      value={editModal.adjustment}
                      onChange={handleAdjustmentChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter amount"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes (Optional)
                    </label>
                    <textarea
                      name="notes"
                      value={editModal.notes}
                      onChange={handleAdjustmentChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Reason for adjustment"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">New Current Amount:</span>
                      <span className="text-sm font-medium">
                        ${calculateNewAmount().toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">New Original Amount:</span>
                      <span className="text-sm font-medium">
                        ${calculateNewOriginalAmount().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={submitAdjustment}
                    disabled={editModal.isSubmitting || !editModal.adjustment}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {editModal.isSubmitting ? (
                      <>
                        <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                        Processing...
                      </>
                    ) : (
                      "Confirm Adjustment"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={closeEditModal}
                    disabled={editModal.isSubmitting}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FundHistory;