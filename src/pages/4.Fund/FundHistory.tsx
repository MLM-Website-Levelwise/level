import React, { useState, useEffect } from "react";
import {
  Wallet,
  User,
  Send,
  CheckCircle,
  AlertCircle,
  Loader,
  Package,
  Zap,
  History,
  Filter,
  Download,
  Eye,
  Calendar,
} from "lucide-react";

// Shared Interfaces
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

interface HistoryRecord {
  id: number;
  slNo: number;
  generatedBy: string;
  transferType: "amount" | "package";
  amount?: number;
  packageName?: string;
  units?: number;
  packagePrice?: number;
  receiverId: string;
  date: string;
  transactionId: string;
  status: "success" | "failed";
}

const FundHistory: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<"transfer" | "history">(
    "transfer"
  );
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<HistoryRecord[]>([]);
  const [filterType, setFilterType] = useState<"all" | "amount" | "package">(
    "all"
  );
  const [currentHistoryPage, setCurrentHistoryPage] = useState(1);
  const [recordsPerPage] = useState(10);

  // Transfer form states
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

  // Package options
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

  // Initialize with sample data
  useEffect(() => {
    const sampleData: HistoryRecord[] = [
      {
        id: 1,
        slNo: 1,
        generatedBy: "Admin User",
        transferType: "amount",
        amount: 500,
        receiverId: "USER123",
        date: new Date().toLocaleString(),
        transactionId: "TXN1703024001",
        status: "success",
      },
      {
        id: 2,
        slNo: 2,
        generatedBy: "Manager",
        transferType: "package",
        packageName: "Premium Package",
        units: 2,
        packagePrice: 500,
        receiverId: "USER456",
        date: new Date(Date.now() - 86400000).toLocaleString(),
        transactionId: "TXN1703024002",
        status: "success",
      },
      {
        id: 3,
        slNo: 3,
        generatedBy: "Admin User",
        transferType: "amount",
        amount: 250,
        receiverId: "USER789",
        date: new Date(Date.now() - 172800000).toLocaleString(),
        transactionId: "TXN1703024003",
        status: "failed",
      },
      {
        id: 4,
        slNo: 4,
        generatedBy: "Supervisor",
        transferType: "package",
        packageName: "Basic Package",
        units: 5,
        packagePrice: 100,
        receiverId: "USER101",
        date: new Date(Date.now() - 259200000).toLocaleString(),
        transactionId: "TXN1703024004",
        status: "success",
      },
    ];
    setHistory(sampleData);
  }, []);

  // Add transaction to history
  const addToHistory = (transaction: Omit<HistoryRecord, "id" | "slNo">) => {
    const newRecord: HistoryRecord = {
      ...transaction,
      id: Date.now(),
      slNo: history.length + 1,
    };
    setHistory((prev) => [
      newRecord,
      ...prev.map((record) => ({ ...record, slNo: record.slNo + 1 })),
    ]);
  };

  // Filter history based on type
  useEffect(() => {
    if (filterType === "all") {
      setFilteredHistory(history);
    } else {
      setFilteredHistory(
        history.filter((record) => record.transferType === filterType)
      );
    }
    setCurrentHistoryPage(1); // Reset to first page when filter changes
  }, [history, filterType]);

  // Pagination logic for history
  const indexOfLastRecord = currentHistoryPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredHistory.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredHistory.length / recordsPerPage);

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

    if (!formData.userId.trim()) {
      newErrors.userId = "User ID is required";
    } else if (formData.userId.length < 3) {
      newErrors.userId = "User ID must be at least 3 characters";
    }

    if (formData.transferType === "amount") {
      if (!formData.amount.trim()) {
        newErrors.amount = "Amount is required";
      } else {
        const amount = parseFloat(formData.amount);
        if (isNaN(amount) || amount <= 0) {
          newErrors.amount = "Amount must be a positive number";
        }
      }
    } else {
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

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

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
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const isSuccess = Math.random() > 0.1;
    const timestamp = new Date().toLocaleString();
    const transactionId = `TXN${Date.now()}`;

    if (isSuccess) {
      let message = "";
      let historyRecord: Omit<HistoryRecord, "id" | "slNo">;

      if (formData.transferType === "amount") {
        const amount = parseFloat(formData.amount);
        message = `Successfully transferred ${amount} credits to User ID: ${formData.userId}`;

        historyRecord = {
          generatedBy: "Admin User",
          transferType: "amount",
          amount: amount,
          receiverId: formData.userId,
          date: timestamp,
          transactionId: transactionId,
          status: "success",
        };
      } else {
        const selectedPkg = packages.find(
          (pkg) => pkg.id === formData.selectedPackage
        );
        const units = parseInt(formData.units);
        const total = calculatePackageTotal();
        message = `Successfully transferred ${units} units of ${selectedPkg?.name} (Total: ${total} credits) to User ID: ${formData.userId}`;

        historyRecord = {
          generatedBy: "Admin User",
          transferType: "package",
          packageName: selectedPkg?.name,
          units: units,
          packagePrice: selectedPkg?.price,
          receiverId: formData.userId,
          date: timestamp,
          transactionId: transactionId,
          status: "success",
        };
      }

      addToHistory(historyRecord);

      return {
        success: true,
        message,
        transactionId,
        timestamp,
      };
    } else {
      const historyRecord: Omit<HistoryRecord, "id" | "slNo"> = {
        generatedBy: "Admin User",
        transferType: formData.transferType,
        amount:
          formData.transferType === "amount"
            ? parseFloat(formData.amount)
            : undefined,
        packageName:
          formData.transferType === "package"
            ? packages.find((pkg) => pkg.id === formData.selectedPackage)?.name
            : undefined,
        units:
          formData.transferType === "package"
            ? parseInt(formData.units)
            : undefined,
        packagePrice:
          formData.transferType === "package"
            ? packages.find((pkg) => pkg.id === formData.selectedPackage)?.price
            : undefined,
        receiverId: formData.userId,
        date: timestamp,
        transactionId: transactionId,
        status: "failed",
      };

      addToHistory(historyRecord);

      return {
        success: false,
        message: "Transfer failed. Please try again.",
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

  // Export functionality
  const handleExport = () => {
    const csvContent = [
      [
        "Sl No",
        "Generated By",
        "Amount/Unit",
        "Receiver ID",
        "Date",
        "Transaction ID",
        "Status",
      ],
      ...filteredHistory.map((record) => [
        record.slNo,
        record.generatedBy,
        record.transferType === "amount"
          ? `${record.amount} credits`
          : `${record.packageName} - ${record.units} units @ ${
              record.packagePrice
            } credits each (Total: ${
              (record.units || 0) * (record.packagePrice || 0)
            } credits)`,
        record.receiverId,
        record.date,
        record.transactionId,
        record.status.toUpperCase(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fund-transfer-history-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Get package color by name
  const getPackageColor = (packageName: string) => {
    const pkg = packages.find((p) => p.name === packageName);
    return pkg?.color || "bg-gray-500";
  };

  // Format amount/unit display
  const formatAmountUnit = (record: HistoryRecord) => {
    if (record.transferType === "amount") {
      return (
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-100 rounded-lg">
            <Zap className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <span className="font-semibold text-gray-900">
              {record.amount} credits
            </span>
            <p className="text-xs text-gray-500">Direct Transfer</p>
          </div>
        </div>
      );
    } else {
      const totalAmount = (record.units || 0) * (record.packagePrice || 0);
      return (
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-purple-100 rounded-lg">
            <Package className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${getPackageColor(
                  record.packageName || ""
                )}`}
              ></div>
              <span className="font-semibold text-gray-900">
                {record.packageName}
              </span>
            </div>
            <p className="text-xs text-gray-600">
              {record.units} units × {record.packagePrice} credits ={" "}
              <span className="font-medium">{totalAmount} credits</span>
            </p>
          </div>
        </div>
      );
    }
  };

  const selectedPackageData = packages.find(
    (pkg) => pkg.id === formData.selectedPackage
  );

  // Fund Transfer Component
  const FundTransferComponent = () => (
    <div className="bg-blue-50 rounded-3xl p-8 shadow-xl border border-gray-200">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Wallet className="w-8 h-8" />
            Fund Transfer
          </h1>
          <p className="text-blue-100 mt-2">
            Transfer credits to users instantly
          </p>
        </div>

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
                onChange={(e) => handleInputChange("userId", e.target.value)}
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
                            handleInputChange("selectedPackage", e.target.value)
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
                    onChange={(e) => handleInputChange("units", e.target.value)}
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
                          <span>{selectedPackageData.price} credits each</span>
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
  );

  // Fund History Component
  const FundHistoryComponent = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <History className="w-8 h-8" />
              Fund Transfer History
            </h1>
            <p className="text-blue-100 mt-2">
              Track and manage all fund transfer activities
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Filter Dropdown */}
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
              <Filter className="w-4 h-4 text-white" />
              <select
                value={filterType}
                onChange={(e) =>
                  setFilterType(e.target.value as "all" | "amount" | "package")
                }
                className="bg-transparent text-white border-none outline-none cursor-pointer"
              >
                <option value="all" className="text-gray-900">
                  All Transfers
                </option>
                <option value="amount" className="text-gray-900">
                  Amount Transfers
                </option>
                <option value="package" className="text-gray-900">
                  Package Transfers
                </option>
              </select>
            </div>

            {/* Export Button */}
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-colors font-medium shadow-lg"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="p-6 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <History className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Total Transactions
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {history.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Successful</p>
                <p className="text-2xl font-bold text-green-900">
                  {history.filter((h) => h.status === "success").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Failed</p>
                <p className="text-2xl font-bold text-red-900">
                  {history.filter((h) => h.status === "failed").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Package className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Package Transfers
                </p>
                <p className="text-2xl font-bold text-purple-900">
                  {history.filter((h) => h.transferType === "package").length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* History Table */}
      {filteredHistory.length === 0 ? (
        <div className="p-16 text-center">
          <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No Transfer History
          </h3>
          <p className="text-gray-500">
            No fund transfers have been recorded yet.
          </p>
        </div>
      ) : (
        <>
          {/* Table Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="grid grid-cols-7 gap-4 text-sm font-semibold text-gray-700">
              <div>Sl No</div>
              <div>Generated By</div>
              <div>Amount/Unit</div>
              <div>Receiver ID</div>
              <div>Date</div>
              <div>Transaction ID</div>
              <div>Status</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {currentRecords.map((record) => (
              <div
                key={record.id}
                className="px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="grid grid-cols-7 gap-4 items-center">
                  {/* Sl No */}
                  <div className="text-sm font-medium text-gray-900">
                    {record.slNo}
                  </div>

                  {/* Generated By */}
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-gray-100 rounded-lg">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {record.generatedBy}
                    </span>
                  </div>

                  {/* Amount/Unit */}
                  <div>{formatAmountUnit(record)}</div>

                  {/* Receiver ID */}
                  <div className="text-sm font-medium text-gray-900">
                    {record.receiverId}
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{record.date}</span>
                  </div>

                  {/* Transaction ID */}
                  <div className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                    {record.transactionId}
                  </div>

                  {/* Status */}
                  <div>
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        record.status === "success"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {record.status === "success" ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <AlertCircle className="w-3 h-3" />
                      )}
                      {record.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {indexOfFirstRecord + 1} to{" "}
                  {Math.min(indexOfLastRecord, filteredHistory.length)} of{" "}
                  {filteredHistory.length} results
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentHistoryPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentHistoryPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentHistoryPage(page)}
                        className={`px-3 py-2 border rounded-lg text-sm font-medium ${
                          currentHistoryPage === page
                            ? "bg-blue-600 text-white border-blue-600"
                            : "border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    onClick={() =>
                      setCurrentHistoryPage((prev) =>
                        Math.min(prev + 1, totalPages)
                      )
                    }
                    disabled={currentHistoryPage === totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  // Main App Layout
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Tabs */}
        <div className="flex mb-6">
          <button
            onClick={() => setCurrentPage("transfer")}
            className={`px-6 py-3 font-medium rounded-t-lg border-b-2 transition-colors ${
              currentPage === "transfer"
                ? "border-blue-600 text-blue-600 bg-white"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
          >
            Fund Transfer
          </button>
          <button
            onClick={() => setCurrentPage("history")}
            className={`px-6 py-3 font-medium rounded-t-lg border-b-2 transition-colors ${
              currentPage === "history"
                ? "border-blue-600 text-blue-600 bg-white"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
          >
            Transfer History
          </button>
        </div>

        {/* Render Current Component */}
        {currentPage === "transfer" ? (
          <FundTransferComponent />
        ) : (
          <FundHistoryComponent />
        )}
      </div>
    </div>
  );
};

export default FundHistory;
