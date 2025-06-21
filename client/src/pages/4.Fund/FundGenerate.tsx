import React, { useState } from "react";
import {
  Wallet,
  User,
  Send,
  CheckCircle,
  AlertCircle,
  Loader,
  CreditCard,
  ArrowRight,
  RefreshCw,
  ChevronDown,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface FormData {
  transferType: "main" | "retopup";
  memberId: string;
  memberName: string;
  amount: string;
}

interface FormErrors {
  memberId?: string;
  amount?: string;
}

interface Transaction {
  transactionId: string;
  date: string;
  memberId: string;
  memberName: string;
  transferType: string;
  amount: number;
  timestamp: string;
}

const WalletTransfer: React.FC = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    transferType: "main",
    memberId: "",
    memberName: "",
    amount: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchingMember, setIsFetchingMember] = useState<boolean>(false);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const navigate = useNavigate();

  // Fetch member name from backend
  const fetchMemberName = async (memberId: string): Promise<string> => {
    setIsFetchingMember(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return "";
      }

      const response = await axios.get(`http://localhost:5000/members?member_id=${memberId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.members && response.data.members.length > 0) {
        return response.data.members[0].name;
      }
      return "";
    } catch (error) {
      console.error("Error fetching member:", error);
      return "";
    } finally {
      setIsFetchingMember(false);
    }
  };

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.memberId.trim()) {
      newErrors.memberId = "Member ID is required";
    } else if (formData.memberId.length < 4) {
      newErrors.memberId = "Member ID must be at least 4 characters";
    }

    if (!formData.amount.trim()) {
      newErrors.amount = "Amount is required";
    } else {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount)) {
        newErrors.amount = "Amount must be a valid number";
      } else if (amount <= 0) {
        newErrors.amount = "Amount must be greater than 0";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = async (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === "memberId" && value.length >= 4) {
      try {
        const memberName = await fetchMemberName(value);
        setFormData((prev) => ({ ...prev, memberName }));
      } catch (error) {
        setFormData((prev) => ({ ...prev, memberName: "" }));
      }
    }

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    if (transaction) {
      setTransaction(null);
    }
  };

  // Handle transfer type change
  const handleTransferTypeChange = (type: "main" | "retopup") => {
    setFormData({
      transferType: type,
      memberId: "",
      memberName: "",
      amount: "",
    });
    setErrors({});
    setTransaction(null);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      // Send transfer request to backend
      const response = await axios.post(
        "http://localhost:5000/wallet-transfer",
        {
          member_id: formData.memberId,
          transfer_type: formData.transferType === "main" ? "Main Wallet" : "Re Top-up Wallet",
          amount: formData.amount
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      // Create transaction record
      const newTransaction = {
        transactionId: `TXN${Date.now()}`,
        date: new Date().toLocaleDateString(),
        memberId: formData.memberId,
        memberName: formData.memberName,
        transferType: formData.transferType === "main" ? "Main Wallet" : "Re Top-up Wallet",
        amount: parseFloat(formData.amount),
        timestamp: new Date().toLocaleString(),
      };

      setTransaction(newTransaction);

      // Clear form
      setFormData({
        transferType: formData.transferType,
        memberId: "",
        memberName: "",
        amount: "",
      });

      toast.success("Transfer completed successfully!");
    } catch (error) {
      console.error("Transfer failed:", error);
      toast.error("Failed to complete transfer");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      transferType: formData.transferType,
      memberId: "",
      memberName: "",
      amount: "",
    });
    setErrors({});
    setTransaction(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="max-w-4xl mx-auto px-4">
        {/* Transfer Type Selector */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Select Transfer Type
          </label>
          <div className="relative">
            <select
              onChange={(e) => {
                const value = e.target.value;
                if (value === "none") {
                  setShowForm(false);
                } else {
                  handleTransferTypeChange(value as "main" | "retopup");
                  setShowForm(true);
                }
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none pr-10"
            >
              <option value="none">Select an option</option>
              <option value="main">Main Wallet Transfer</option>
              <option value="retopup">Re Top-up Wallet Transfer</option>
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Transaction Display */}
        {transaction && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-4 border border-gray-200">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Transfer Successful
                  </h3>
                  <p className="text-gray-600">
                    Transaction completed successfully
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Transaction #</p>
                <p className="font-mono text-lg font-semibold">
                  {transaction.transactionId}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Transfer Details
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{transaction.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">
                      {transaction.transferType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Member ID:</span>
                    <span className="font-medium">{transaction.memberId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Member Name:</span>
                    <span className="font-medium">
                      {transaction.memberName}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Amount Transferred
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-lg font-semibold text-gray-900">
                      Total Amount:
                    </span>
                    <span className="text-2xl font-bold text-green-600">
                      ${transaction.amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Processed on: {transaction.timestamp}
              </p>
            </div>
          </div>
        )}

        {/* Main Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <h2 className="text-xl font-bold text-white mb-1">
                {formData.transferType === "main"
                  ? "Main Wallet Transfer"
                  : "Re Top-up Wallet Transfer"}
              </h2>
              <p className="text-blue-100 text-sm">
                Transfer funds to another member's wallet
              </p>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Member ID *
                  </label>
                  <input
                    type="text"
                    value={formData.memberId}
                    onChange={(e) =>
                      handleInputChange("memberId", e.target.value)
                    }
                    placeholder="Enter member ID"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.memberId
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                    disabled={isLoading}
                  />
                  {errors.memberId && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.memberId}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Member Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.memberName}
                      placeholder="Auto-fetched from member ID"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      disabled
                    />
                    {isFetchingMember && (
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <Loader className="w-4 h-4 animate-spin text-blue-600" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Amount in USD *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) =>
                      handleInputChange("amount", e.target.value)
                    }
                    placeholder="Enter amount to transfer"
                    className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.amount
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                    disabled={isLoading}
                  />
                </div>
                {errors.amount && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.amount}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !formData.memberId || !formData.amount}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold text-sm transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Transfer Funds
                    </>
                  )}
                </button>

                <button
                  onClick={handleReset}
                  disabled={isLoading}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm transition-all duration-200"
                >
                  Reset Form
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletTransfer;