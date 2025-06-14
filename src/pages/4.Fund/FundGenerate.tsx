import React, { useState } from "react";
import {
  Wallet,
  User,
  Send,
  CheckCircle,
  AlertCircle,
  Loader,
  Package,
  Zap,
} from "lucide-react";

interface FormData {
  userId: string;
  transferType: "amount" | "package";
  amount: string;
  selectedPackage: string;
  units: string;
}

interface FormErrors {
  userId?: string;
  amount?: string;
  selectedPackage?: string;
  units?: string;
}

interface TransactionResult {
  success: boolean;
  message: string;
  transactionId?: string;
  timestamp?: string;
}

interface PackageOption {
  id: string;
  name: string;
  price: number;
  color: string;
  description: string;
}

const FundGenerate: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    userId: "",
    transferType: "amount",
    amount: "",
    selectedPackage: "",
    units: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [transactionResult, setTransactionResult] =
    useState<TransactionResult | null>(null);

  // Package options with enhanced styling
  const packages: PackageOption[] = [
    {
      id: "basic",
      name: "Basic Package",
      price: 100,
      color: "bg-emerald-500",
      description: "Perfect for getting started",
    },
    {
      id: "standard",
      name: "Standard Package",
      price: 250,
      color: "bg-blue-500",
      description: "Most popular choice",
    },
    {
      id: "premium",
      name: "Premium Package",
      price: 500,
      color: "bg-purple-500",
      description: "Advanced features included",
    },
    {
      id: "enterprise",
      name: "Enterprise Package",
      price: 1000,
      color: "bg-orange-500",
      description: "Full-featured solution",
    },
  ];

  // Calculate total amount for package transfer
  const calculatePackageTotal = (): number => {
    if (
      formData.transferType === "package" &&
      formData.selectedPackage &&
      formData.units
    ) {
      const selectedPkg = packages.find(
        (pkg) => pkg.id === formData.selectedPackage
      );
      const units = parseInt(formData.units);
      if (selectedPkg && !isNaN(units)) {
        return selectedPkg.price * units;
      }
    }
    return 0;
  };

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // User ID validation
    if (!formData.userId.trim()) {
      newErrors.userId = "User ID is required";
    } else if (formData.userId.length < 3) {
      newErrors.userId = "User ID must be at least 3 characters";
    }

    if (formData.transferType === "amount") {
      // Amount validation
      if (!formData.amount.trim()) {
        newErrors.amount = "Amount is required";
      } else {
        const amount = parseFloat(formData.amount);
        if (isNaN(amount) || amount <= 0) {
          newErrors.amount = "Amount must be a positive number";
        }
      }
    } else {
      // Package validation
      if (!formData.selectedPackage) {
        newErrors.selectedPackage = "Please select a package";
      }

      if (!formData.units.trim()) {
        newErrors.units = "Number of units is required";
      } else {
        const units = parseInt(formData.units);
        if (isNaN(units) || units <= 0) {
          newErrors.units = "Units must be a positive number";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear specific error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    // Clear transaction result when form is modified
    if (transactionResult) {
      setTransactionResult(null);
    }
  };

  // Handle transfer type change
  const handleTransferTypeChange = (type: "amount" | "package") => {
    setFormData((prev) => ({
      ...prev,
      transferType: type,
      amount: "",
      selectedPackage: "",
      units: "",
    }));
    setErrors({});
    setTransactionResult(null);
  };

  // Simulate API call for fund transfer
  const processFundTransfer = async (): Promise<TransactionResult> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate random success/failure (90% success rate)
    const isSuccess = Math.random() > 0.1;

    if (isSuccess) {
      let message = "";
      if (formData.transferType === "amount") {
        message = `Successfully transferred ${formData.amount} credits to User ID: ${formData.userId}`;
      } else {
        const selectedPkg = packages.find(
          (pkg) => pkg.id === formData.selectedPackage
        );
        const total = calculatePackageTotal();
        message = `Successfully transferred ${formData.units} units of ${selectedPkg?.name} (Total: ${total} credits) to User ID: ${formData.userId}`;
      }

      return {
        success: true,
        message,
        transactionId: `TXN${Date.now()}`,
        timestamp: new Date().toLocaleString(),
      };
    } else {
      return {
        success: false,
        message: "Transfer failed. Please try again or contact support.",
      };
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await processFundTransfer();
      setTransactionResult(result);

      // Clear form on success
      if (result.success) {
        setFormData({
          userId: "",
          transferType: "amount",
          amount: "",
          selectedPackage: "",
          units: "",
        });
      }
    } catch (error) {
      setTransactionResult({
        success: false,
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      userId: "",
      transferType: "amount",
      amount: "",
      selectedPackage: "",
      units: "",
    });
    setErrors({});
    setTransactionResult(null);
  };

  const selectedPackageData = packages.find(
    (pkg) => pkg.id === formData.selectedPackage
  );

  return (
    <div className="p-2 lg:p-2" style={{ marginTop: "2px" }}>
      <div className="max-w-4xl mx-auto">
        {/* Main Card */}
        <div className="bg-blue-50 rounded-3xl p-8 shadow-xl border border-gray-200">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
            {/* Transaction Result */}
            {transactionResult && (
              <div
                className={`mx-6 mt-6 p-6 rounded-2xl border-2 ${
                  transactionResult.success
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-2 rounded-full ${
                      transactionResult.success ? "bg-green-100" : "bg-red-100"
                    }`}
                  >
                    {transactionResult.success ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <AlertCircle className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`text-lg font-bold ${
                        transactionResult.success
                          ? "text-green-800"
                          : "text-red-800"
                      }`}
                    >
                      {transactionResult.success
                        ? "Transfer Successful!"
                        : "Transfer Failed"}
                    </h3>
                    <p
                      className={`text-sm mt-1 ${
                        transactionResult.success
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {transactionResult.message}
                    </p>
                    {transactionResult.success &&
                      transactionResult.transactionId && (
                        <div className="mt-3 text-sm text-green-700 bg-green-100 rounded-lg p-3">
                          <p>
                            <strong>Transaction ID:</strong>{" "}
                            {transactionResult.transactionId}
                          </p>
                          <p>
                            <strong>Timestamp:</strong>{" "}
                            {transactionResult.timestamp}
                          </p>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            )}

            {/* Form Content */}
            <div className="p-8">
              <div className="space-y-8">
                {/* User ID Field */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700">
                    <User className="w-4 h-4 mr-2 text-blue-600" />
                    Recipient User ID
                  </label>
                  <input
                    type="text"
                    value={formData.userId}
                    onChange={(e) =>
                      handleInputChange("userId", e.target.value)
                    }
                    placeholder="Enter user ID (e.g., USER123)"
                    className={`w-full px-4 py-4 bg-gray-50 border-2 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${
                      errors.userId
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    disabled={isLoading}
                  />
                  {errors.userId && (
                    <p className="text-sm text-red-600 flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg">
                      <AlertCircle className="w-4 h-4" />
                      {errors.userId}
                    </p>
                  )}
                </div>

                {/* Transfer Type Selection */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    Transfer Method
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label
                      className={`relative flex items-center justify-center p-4 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                        formData.transferType === "amount"
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-200 hover:border-gray-300 bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="transferType"
                        value="amount"
                        checked={formData.transferType === "amount"}
                        onChange={(e) =>
                          handleTransferTypeChange(e.target.value as "amount")
                        }
                        className="sr-only"
                        disabled={isLoading}
                      />
                      <div className="text-center">
                        <Zap
                          className={`w-6 h-6 mx-auto mb-2 ${
                            formData.transferType === "amount"
                              ? "text-blue-600"
                              : "text-gray-500"
                          }`}
                        />
                        <span
                          className={`font-medium ${
                            formData.transferType === "amount"
                              ? "text-blue-700"
                              : "text-gray-600"
                          }`}
                        >
                          Direct Amount
                        </span>
                      </div>
                    </label>

                    <label
                      className={`relative flex items-center justify-center p-4 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                        formData.transferType === "package"
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-200 hover:border-gray-300 bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="transferType"
                        value="package"
                        checked={formData.transferType === "package"}
                        onChange={(e) =>
                          handleTransferTypeChange(e.target.value as "package")
                        }
                        className="sr-only"
                        disabled={isLoading}
                      />
                      <div className="text-center">
                        <Package
                          className={`w-6 h-6 mx-auto mb-2 ${
                            formData.transferType === "package"
                              ? "text-blue-600"
                              : "text-gray-500"
                          }`}
                        />
                        <span
                          className={`font-medium ${
                            formData.transferType === "package"
                              ? "text-blue-700"
                              : "text-gray-600"
                          }`}
                        >
                          Package Units
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Amount Field */}
                {formData.transferType === "amount" && (
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-semibold text-gray-700">
                      <Zap className="w-4 h-4 mr-2 text-blue-600" />
                      Credit Amount
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.amount}
                        onChange={(e) =>
                          handleInputChange("amount", e.target.value)
                        }
                        placeholder="Enter amount"
                        className={`w-full px-4 py-4 bg-gray-50 border-2 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${
                          errors.amount
                            ? "border-red-300 bg-red-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        disabled={isLoading}
                      />
                    </div>
                    {errors.amount && (
                      <p className="text-sm text-red-600 flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg">
                        <AlertCircle className="w-4 h-4" />
                        {errors.amount}
                      </p>
                    )}
                  </div>
                )}

                {/* Package Fields */}
                {formData.transferType === "package" && (
                  <div className="space-y-6">
                    {/* Package Selection */}
                    <div className="space-y-4">
                      <label className="flex items-center text-sm font-semibold text-gray-700">
                        <Package className="w-4 h-4 mr-2 text-blue-600" />
                        Select Package
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {packages.map((pkg) => (
                          <label
                            key={pkg.id}
                            className={`relative p-4 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                              formData.selectedPackage === pkg.id
                                ? "border-blue-500 bg-blue-50 shadow-md"
                                : "border-gray-200 hover:border-gray-300 bg-gray-50"
                            }`}
                          >
                            <input
                              type="radio"
                              name="selectedPackage"
                              value={pkg.id}
                              checked={formData.selectedPackage === pkg.id}
                              onChange={(e) =>
                                handleInputChange(
                                  "selectedPackage",
                                  e.target.value
                                )
                              }
                              className="sr-only"
                              disabled={isLoading}
                            />
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-4 h-4 rounded-full ${pkg.color}`}
                              ></div>
                              <div className="flex-1">
                                <h3 className="font-medium text-gray-800">
                                  {pkg.name}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {pkg.description}
                                </p>
                                <p className="text-lg font-bold text-gray-900">
                                  {pkg.price} credits
                                </p>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                      {errors.selectedPackage && (
                        <p className="text-sm text-red-600 flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg">
                          <AlertCircle className="w-4 h-4" />
                          {errors.selectedPackage}
                        </p>
                      )}
                    </div>

                    {/* Units */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Number of Units
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.units}
                        onChange={(e) =>
                          handleInputChange("units", e.target.value)
                        }
                        placeholder="Enter number of units"
                        className={`w-full px-4 py-4 bg-gray-50 border-2 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${
                          errors.units
                            ? "border-red-300 bg-red-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        disabled={isLoading}
                      />
                      {errors.units && (
                        <p className="text-sm text-red-600 flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg">
                          <AlertCircle className="w-4 h-4" />
                          {errors.units}
                        </p>
                      )}
                    </div>

                    {/* Total Calculation */}
                    {formData.selectedPackage &&
                      formData.units &&
                      selectedPackageData && (
                        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-blue-800">
                              Transfer Summary
                            </span>
                            <div
                              className={`w-3 h-3 rounded-full ${selectedPackageData.color}`}
                            ></div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm text-blue-700">
                              <span>Package: {selectedPackageData.name}</span>
                              <span>
                                {selectedPackageData.price} credits each
                              </span>
                            </div>
                            <div className="flex justify-between text-sm text-blue-700">
                              <span>Units: {formData.units}</span>
                              <span>
                                {formData.units} × {selectedPackageData.price}
                              </span>
                            </div>
                            <div className="border-t border-blue-200 pt-2">
                              <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-blue-900">
                                  Total Credits:
                                </span>
                                <span className="text-2xl font-bold text-blue-900">
                                  {calculatePackageTotal().toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6">
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex-1 bg-blue-600 text-white py-4 px-8 rounded-2xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {isLoading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Processing Transfer...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Transfer Credits
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleReset}
                    disabled={isLoading}
                    className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundGenerate;
