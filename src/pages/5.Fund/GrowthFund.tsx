import React, { useState } from "react";
import {
  Wallet,
  User,
  Send,
  CheckCircle,
  AlertCircle,
  Loader,
  Package,
  CreditCard,
  FileText,
  Plus,
  ArrowRight,
  UserPlus,
  RefreshCw,
  ChevronDown,
} from "lucide-react";

interface FormData {
  transactionType: "activation" | "retopup";
  memberId: string;
  memberName: string;
  selectedPackage: string;
  numberOfUnits: string;
}

interface FormErrors {
  memberId?: string;
  selectedPackage?: string;
  numberOfUnits?: string;
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

interface PackageOption {
  id: string;
  name: string;
  price: number;
  description: string;
}

const GrowthFund: React.FC = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    transactionType: "activation",
    memberId: "",
    memberName: "",
    selectedPackage: "",
    numberOfUnits: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchingMember, setIsFetchingMember] = useState<boolean>(false);
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  // Current logged-in user (dummy data for Re Top-up)
  const currentUser = {
    memberId: "USR12345",
    memberName: "John Doe",
  };

  // Package options for ID Activation
  const activationPackages: PackageOption[] = [
    {
      id: "shopping",
      name: "Shopping Wallet Package",
      price: 30,
      description: "Complete shopping benefits package",
    },
    {
      id: "tour",
      name: "Tour Package",
      price: 45,
      description: "Premium tour and travel package",
    },
  ];

  // Fixed package for Re Top-up
  const retopupPackage: PackageOption = {
    id: "retopup",
    name: "Re Top-up Unit",
    price: 25,
    description: "Fixed re top-up unit - $25 per unit",
  };

  // Simulate member name fetch
  const fetchMemberName = async (memberId: string): Promise<string> => {
    setIsFetchingMember(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate member lookup
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

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Member ID validation (only for activation)
    if (formData.transactionType === "activation") {
      if (!formData.memberId.trim()) {
        newErrors.memberId = "Member ID is required";
      } else if (formData.memberId.length < 4) {
        newErrors.memberId = "Member ID must be at least 4 characters";
      }

      // Package validation for activation
      if (!formData.selectedPackage) {
        newErrors.selectedPackage = "Please select a package";
      }
    }

    // Number of units validation
    if (!formData.numberOfUnits.trim()) {
      newErrors.numberOfUnits = "Number of units is required";
    } else {
      const units = parseInt(formData.numberOfUnits);
      if (isNaN(units) || units <= 0) {
        newErrors.numberOfUnits = "Number of units must be a positive number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = async (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Auto-fetch member name when member ID is entered (only for activation)
    if (
      field === "memberId" &&
      value.length >= 4 &&
      formData.transactionType === "activation"
    ) {
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

  // Handle transaction type change
  const handleTransactionTypeChange = (type: "activation" | "retopup") => {
    setFormData((prev) => ({
      ...prev,
      transactionType: type,
      memberId: type === "retopup" ? currentUser.memberId : "",
      memberName: type === "retopup" ? currentUser.memberName : "",
      selectedPackage: type === "retopup" ? "retopup" : "",
      numberOfUnits: "",
    }));
    setErrors({});
    setInvoice(null);
  };

  // Calculate total amount
  const calculateTotal = (): number => {
    const units = parseInt(formData.numberOfUnits);
    if (isNaN(units)) return 0;

    if (formData.transactionType === "activation") {
      const selectedPkg = activationPackages.find(
        (pkg) => pkg.id === formData.selectedPackage
      );
      if (selectedPkg) {
        return selectedPkg.price * units;
      }
    } else {
      return retopupPackage.price * units;
    }
    return 0;
  };

  // Generate invoice
  const generateInvoice = (): Invoice => {
    const total = calculateTotal();
    let description = "";

    if (formData.transactionType === "activation") {
      const selectedPkg = activationPackages.find(
        (pkg) => pkg.id === formData.selectedPackage
      );
      description = `${formData.numberOfUnits} units of ${selectedPkg?.name} (₹${selectedPkg?.price} each)`;
    } else {
      description = `${formData.numberOfUnits} units of Re Top-up ($${retopupPackage.price} each)`;
    }

    return {
      invoiceNumber: `INV${Date.now()}`,
      date: new Date().toLocaleDateString(),
      memberId: formData.memberId,
      memberName: formData.memberName,
      transactionType:
        formData.transactionType === "activation"
          ? "ID Activation"
          : "Re Top-up",
      description,
      amount: total,
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
      // Simulate processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const newInvoice = generateInvoice();
      setInvoice(newInvoice);

      // Clear form
      setFormData({
        transactionType: "activation",
        memberId: "",
        memberName: "",
        selectedPackage: "",
        numberOfUnits: "",
      });
    } catch (error) {
      console.error("Transaction failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    const resetData = {
      transactionType: formData.transactionType,
      memberId:
        formData.transactionType === "retopup" ? currentUser.memberId : "",
      memberName:
        formData.transactionType === "retopup" ? currentUser.memberName : "",
      selectedPackage: formData.transactionType === "retopup" ? "retopup" : "",
      numberOfUnits: "",
    };
    setFormData(resetData);
    setErrors({});
    setInvoice(null);
  };

  const getSelectedPackageData = () => {
    if (formData.transactionType === "activation") {
      return activationPackages.find(
        (pkg) => pkg.id === formData.selectedPackage
      );
    } else {
      return retopupPackage;
    }
  };

  const selectedPackageData = getSelectedPackageData();
  const currencySymbol = formData.transactionType === "activation" ? "$" : "$";

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
                if (value === "none") {
                  setShowForm(false);
                } else {
                  handleTransactionTypeChange(
                    value as "activation" | "retopup"
                  );
                  setShowForm(true);
                }
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none pr-10"
            >
              <option value="none">Select an option</option>
              <option value="activation">ID Activation</option>
              <option value="retopup">Growth Re Top-Up</option>
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Invoice Display */}
        {invoice && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-4 border border-gray-200">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Transaction Successful
                  </h3>
                  <p className="text-gray-600">
                    Invoice generated successfully
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Invoice #</p>
                <p className="font-mono text-lg font-semibold">
                  {invoice.invoiceNumber}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Transaction Details
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{invoice.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">
                      {invoice.transactionType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Member ID:</span>
                    <span className="font-medium">{invoice.memberId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Member Name:</span>
                    <span className="font-medium">{invoice.memberName}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Payment Summary
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Description:</span>
                    <span className="font-medium text-right">
                      {invoice.description}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-lg font-semibold text-gray-900">
                      Total Amount:
                    </span>
                    <span className="text-2xl font-bold text-green-600">
                      {invoice.transactionType === "ID Activation" ? "₹" : "$"}
                      {invoice.amount}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Generated on: {invoice.timestamp}
              </p>
            </div>
          </div>
        )}

        {/* Main Form - Only shown when showForm is true */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <h2 className="text-xl font-bold text-white mb-1">
                MLM Fund Transfer
              </h2>
              <p className="text-blue-100 text-sm">
                {formData.transactionType === "activation"
                  ? "ID Activation Form"
                  : "Re Top-Up Form"}
              </p>
            </div>

            <div className="p-6">
              {/* Member Information */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Member ID{" "}
                    {formData.transactionType === "activation" ? "*" : ""}
                  </label>
                  <input
                    type="text"
                    value={formData.memberId}
                    onChange={(e) =>
                      handleInputChange("memberId", e.target.value)
                    }
                    placeholder={
                      formData.transactionType === "activation"
                        ? "Enter member ID"
                        : "Current user"
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.memberId
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    } ${
                      formData.transactionType === "retopup" ? "bg-gray-50" : ""
                    }`}
                    disabled={
                      isLoading || formData.transactionType === "retopup"
                    }
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
                      placeholder={
                        formData.transactionType === "activation"
                          ? "Auto-fetched from member ID"
                          : "Current user name"
                      }
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

              {/* Package Selection */}
              {formData.transactionType === "activation" && (
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Select Package *
                  </label>
                  <select
                    value={formData.selectedPackage}
                    onChange={(e) =>
                      handleInputChange("selectedPackage", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.selectedPackage
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                    disabled={isLoading}
                  >
                    <option value="">Choose a package</option>
                    {activationPackages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} - ${pkg.price} ({pkg.description})
                      </option>
                    ))}
                  </select>
                  {errors.selectedPackage && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.selectedPackage}
                    </p>
                  )}
                </div>
              )}

              {/* Re Top-up Package Display */}
              {formData.transactionType === "retopup" && (
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Package
                  </label>
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                    <span className="font-medium">
                      {retopupPackage.name} - ${retopupPackage.price}
                    </span>
                    {/* <p className="text-xs text-gray-600 mt-1">
                      {retopupPackage.description}
                    </p> */}
                  </div>
                </div>
              )}

              {/* Number of Units */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Number of Units *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.numberOfUnits}
                  onChange={(e) =>
                    handleInputChange("numberOfUnits", e.target.value)
                  }
                  placeholder="Enter number of units"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.numberOfUnits
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  disabled={isLoading}
                />
                {errors.numberOfUnits && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.numberOfUnits}
                  </p>
                )}
              </div>

              {/* Transaction Summary */}
              {formData.numberOfUnits &&
                selectedPackageData &&
                !errors.numberOfUnits && (
                  <div
                    className={`${
                      formData.transactionType === "activation"
                        ? "bg-blue-50 border-blue-200"
                        : "bg-green-50 border-green-200"
                    } border rounded-lg p-4 mb-6`}
                  >
                    <h4
                      className={`font-semibold text-sm ${
                        formData.transactionType === "activation"
                          ? "text-blue-900"
                          : "text-green-900"
                      } mb-2`}
                    >
                      Transaction Summary
                    </h4>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span
                          className={
                            formData.transactionType === "activation"
                              ? "text-blue-700"
                              : "text-green-700"
                          }
                        >
                          Package:
                        </span>
                        <span
                          className={`font-medium ${
                            formData.transactionType === "activation"
                              ? "text-blue-900"
                              : "text-green-900"
                          }`}
                        >
                          {selectedPackageData.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span
                          className={
                            formData.transactionType === "activation"
                              ? "text-blue-700"
                              : "text-green-700"
                          }
                        >
                          Price per unit:
                        </span>
                        <span
                          className={`font-medium ${
                            formData.transactionType === "activation"
                              ? "text-blue-900"
                              : "text-green-900"
                          }`}
                        >
                          {currencySymbol}
                          {selectedPackageData.price}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span
                          className={
                            formData.transactionType === "activation"
                              ? "text-blue-700"
                              : "text-green-700"
                          }
                        >
                          Number of units:
                        </span>
                        <span
                          className={`font-medium ${
                            formData.transactionType === "activation"
                              ? "text-blue-900"
                              : "text-green-900"
                          }`}
                        >
                          {formData.numberOfUnits}
                        </span>
                      </div>
                      <div
                        className={`border-t ${
                          formData.transactionType === "activation"
                            ? "border-blue-200"
                            : "border-green-200"
                        } pt-2 mt-2`}
                      >
                        <div className="flex justify-between items-center">
                          <span
                            className={`font-semibold ${
                              formData.transactionType === "activation"
                                ? "text-blue-900"
                                : "text-green-900"
                            }`}
                          >
                            Total Amount:
                          </span>
                          <span
                            className={`text-xl font-bold ${
                              formData.transactionType === "activation"
                                ? "text-blue-900"
                                : "text-green-900"
                            }`}
                          >
                            {currencySymbol}
                            {calculateTotal()}
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
                  disabled={
                    isLoading ||
                    (formData.transactionType === "activation" &&
                      (!formData.memberId ||
                        !formData.memberName ||
                        !formData.selectedPackage)) ||
                    !formData.numberOfUnits
                  }
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
                      Process Transaction
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

export default GrowthFund;
