import React, { useState } from "react";
import {
  User,
  Send,
  CheckCircle,
  AlertCircle,
  Loader,
  ArrowRight,
  DollarSign,
} from "lucide-react";

interface FormData {
  memberId: string;
  memberName: string;
  amount: string;
}

interface FormErrors {
  memberId?: string;
  amount?: string;
}

interface Invoice {
  invoiceNumber: string;
  date: string;
  memberId: string;
  memberName: string;
  transactionType: string;
  description: string;
  amount: number;
  timestamp: string;
}

const ProfitSharingFund: React.FC = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    memberId: "",
    memberName: "",
    amount: "75", // Default to minimum amount
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchingMember, setIsFetchingMember] = useState<boolean>(false);
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  // Handle amount increment
  const incrementAmount = () => {
    const currentAmount = parseInt(formData.amount);
    if (currentAmount < 450) {
      const newAmount = currentAmount + 75;
      setFormData({ ...formData, amount: newAmount.toString() });
      if (errors.amount) setErrors({ ...errors, amount: undefined });
    }
  };

  // Handle amount decrement
  const decrementAmount = () => {
    const currentAmount = parseInt(formData.amount);
    if (currentAmount > 75) {
      const newAmount = currentAmount - 75;
      setFormData({ ...formData, amount: newAmount.toString() });
      if (errors.amount) setErrors({ ...errors, amount: undefined });
    }
  };

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Member ID validation
    if (!formData.memberId.trim()) {
      newErrors.memberId = "Member ID is required";
    } else if (formData.memberId.length < 4) {
      newErrors.memberId = "Member ID must be at least 4 characters";
    }

    // Amount validation
    const amount = parseInt(formData.amount);
    if (isNaN(amount)) {
      newErrors.amount = "Amount must be a valid number";
    } else if (amount < 75) {
      newErrors.amount = "Minimum amount is $75";
    } else if (amount > 450) {
      newErrors.amount = "Maximum amount is $450";
    } else if (amount % 75 !== 0) {
      newErrors.amount = "Amount must be in multiples of $75";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = async (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Auto-fetch member name when member ID is entered
    if (field === "memberId" && value.length >= 4) {
      try {
        const memberName = await fetchMemberName(value);
        setFormData((prev) => ({ ...prev, memberName }));
      } catch (error) {
        setFormData((prev) => ({ ...prev, memberName: "" }));
      }
    }

    // Clear specific error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    // Clear invoice when form is modified
    if (invoice) {
      setInvoice(null);
    }
  };

  // Simulate member name fetch
  const fetchMemberName = async (memberId: string): Promise<string> => {
    setIsFetchingMember(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const memberNames = [
      "John Smith",
      "Sarah Johnson",
      "Michael Brown",
      "Emily Davis",
      "David Wilson",
      "Lisa Anderson",
      "Robert Taylor",
      "Jennifer Martinez",
    ];

    const randomName =
      memberNames[Math.floor(Math.random() * memberNames.length)];
    setIsFetchingMember(false);
    return randomName;
  };

  // Generate invoice
  const generateInvoice = (): Invoice => {
    const amount = parseInt(formData.amount);

    return {
      invoiceNumber: `INV${Date.now()}`,
      date: new Date().toLocaleDateString(),
      memberId: formData.memberId,
      memberName: formData.memberName,
      transactionType: "Profit Sharing Transfer",
      description: `Profit sharing transfer of $${amount.toFixed(2)}`,
      amount,
      timestamp: new Date().toLocaleString(),
    };
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const newInvoice = generateInvoice();
      setInvoice(newInvoice);
      setFormData({
        memberId: "",
        memberName: "",
        amount: "75",
      });
    } catch (error) {
      console.error("Transaction failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      memberId: "",
      memberName: "",
      amount: "75",
    });
    setErrors({});
    setInvoice(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="max-w-4xl mx-auto px-4">
        {/* Transaction Type Selector */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Select Transaction Type
          </label>
          <div className="relative">
            <select
              onChange={(e) => {
                const value = e.target.value;
                setShowForm(value === "profit-sharing");
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none pr-10"
            >
              <option value="">Select an option</option>
              <option value="profit-sharing">Profit Sharing Transfer</option>
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Invoice Display */}
        {invoice && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-4 border border-gray-200">
            {/* ... (keep existing invoice display code) ... */}
          </div>
        )}

        {/* Main Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <h2 className="text-xl font-bold text-white mb-1">
                Profit Sharing Fund Transfer
              </h2>
              <p className="text-blue-100 text-sm">
                Transfer profit sharing amount to member (min $75, max $450, in
                $75 increments)
              </p>
            </div>

            <div className="p-6">
              {/* Member Information */}
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

              {/* Amount Field with Number Input Style */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Amount to Transfer *
                </label>
                <div className="flex items-center">
                  {/* <button
                    type="button"
                    onClick={decrementAmount}
                    disabled={parseInt(formData.amount) <= 75 || isLoading}
                    className="px-3 py-1 border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    -
                  </button> */}
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mb-1">
                      {/* <DollarSign className="h-5 w-5 text-gray-400" /> */}
                    </div>
                    <input
                      type="number"
                      min="75"
                      max="450"
                      step="75"
                      value={formData.amount}
                      onChange={(e) =>
                        handleInputChange("amount", e.target.value)
                      }
                      className={`w-full text-center pl-10 pr-3 py-2 border-t border-b border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.amount
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      disabled={isLoading}
                    />
                  </div>
                  {/* <button
                    type="button"
                    onClick={incrementAmount}
                    disabled={parseInt(formData.amount) >= 450 || isLoading}
                    className="px-3 py-1 border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button> */}
                </div>
                {errors.amount && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.amount}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Amount must be between $75 and $450 in $75 increments
                </p>
              </div>

              {/* Transaction Summary - Only shown when both fields are filled */}
              {formData.memberId &&
                formData.amount &&
                !errors.memberId &&
                !errors.amount && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-sm text-blue-900 mb-2">
                      Transaction Summary
                    </h4>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-blue-700">Recipient:</span>
                        <span className="font-medium text-blue-900">
                          {formData.memberName || "Not specified"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Member ID:</span>
                        <span className="font-medium text-blue-900">
                          {formData.memberId}
                        </span>
                      </div>
                      <div className="border-t border-blue-200 pt-2 mt-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-blue-900">
                            Transfer Amount:
                          </span>
                          <span className="text-xl font-bold text-blue-900">
                            ${parseInt(formData.amount).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              {/* Action Buttons */}
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

export default ProfitSharingFund;
