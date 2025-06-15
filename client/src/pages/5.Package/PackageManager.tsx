import React, { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Save,
  X,
  DollarSign,
  Users,
  TrendingUp,
  Award,
  Package,
} from "lucide-react";

const PackageManager = () => {
  const [activeTab, setActiveTab] = useState("view");
  const [packages, setPackages] = useState([
    {
      id: 1,
      name: "Starter Package",
      price: 99,
      benefits: ["Basic Training", "Starter Kit", "Email Support"],
      directBonus: 5,
      levelIncome: [20, 10, 10, 5, 5, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2],
      repurchaseRequirement: [
        1,
        2,
        3,
        4,
        5,
        "After 5th level 1 direct 2 level opening",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
      status: "active",
    },
    {
      id: 2,
      name: "Premium Package",
      price: 299,
      benefits: [
        "Advanced Training",
        "Premium Kit",
        "Phone Support",
        "Marketing Materials",
      ],
      directBonus: 5,
      levelIncome: [20, 10, 10, 5, 5, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2],
      repurchaseRequirement: [
        1,
        2,
        3,
        4,
        5,
        "After 5th level 1 direct 2 level opening",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
      status: "active",
    },
    {
      id: 3,
      name: "Elite Package",
      price: 599,
      benefits: [
        "Expert Training",
        "Elite Kit",
        "24/7 Support",
        "Marketing Materials",
        "Personal Mentor",
      ],
      directBonus: 5,
      levelIncome: [20, 10, 10, 5, 5, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2],
      repurchaseRequirement: [
        1,
        2,
        3,
        4,
        5,
        "After 5th level 1 direct 2 level opening",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
      status: "active",
    },
  ]);

  const [editingPackage, setEditingPackage] = useState(null);
  const [newPackage, setNewPackage] = useState({
    name: "",
    price: "",
    benefits: [""],
    directBonus: 5,
    levelIncome: [20, 10, 10, 5, 5, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2],
    repurchaseRequirement: [
      1,
      2,
      3,
      4,
      5,
      "After 5th level 1 direct 2 level opening",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ],
  });

  const levelLabels = [
    "LEVEL 1",
    "LEVEL 2",
    "LEVEL 3",
    "LEVEL 4",
    "LEVEL 5",
    "LEVEL 6",
    "LEVEL 7",
    "LEVEL 8",
    "LEVEL 9",
    "LEVEL 10",
    "LEVEL 11",
    "LEVEL 12",
    "LEVEL 13",
    "LEVEL 14",
    "LEVEL 15",
  ];

  const handleAddBenefit = (isEditing = false) => {
    if (isEditing && editingPackage) {
      setEditingPackage({
        ...editingPackage,
        benefits: [...editingPackage.benefits, ""],
      });
    } else {
      setNewPackage({
        ...newPackage,
        benefits: [...newPackage.benefits, ""],
      });
    }
  };

  const handleBenefitChange = (index, value, isEditing = false) => {
    if (isEditing && editingPackage) {
      const updatedBenefits = [...editingPackage.benefits];
      updatedBenefits[index] = value;
      setEditingPackage({
        ...editingPackage,
        benefits: updatedBenefits,
      });
    } else {
      const updatedBenefits = [...newPackage.benefits];
      updatedBenefits[index] = value;
      setNewPackage({
        ...newPackage,
        benefits: updatedBenefits,
      });
    }
  };

  const handleRemoveBenefit = (index, isEditing = false) => {
    if (isEditing && editingPackage) {
      const updatedBenefits = editingPackage.benefits.filter(
        (_, i) => i !== index
      );
      setEditingPackage({
        ...editingPackage,
        benefits: updatedBenefits,
      });
    } else {
      const updatedBenefits = newPackage.benefits.filter((_, i) => i !== index);
      setNewPackage({
        ...newPackage,
        benefits: updatedBenefits,
      });
    }
  };

  const handleLevelIncomeChange = (index, value, isEditing = false) => {
    if (isEditing && editingPackage) {
      const updatedLevels = [...editingPackage.levelIncome];
      updatedLevels[index] = parseFloat(value) || 0;
      setEditingPackage({
        ...editingPackage,
        levelIncome: updatedLevels,
      });
    } else {
      const updatedLevels = [...newPackage.levelIncome];
      updatedLevels[index] = parseFloat(value) || 0;
      setNewPackage({
        ...newPackage,
        levelIncome: updatedLevels,
      });
    }
  };

  const handleRepurchaseChange = (index, value, isEditing = false) => {
    if (isEditing && editingPackage) {
      const updatedRequirements = [...editingPackage.repurchaseRequirement];
      updatedRequirements[index] = value;
      setEditingPackage({
        ...editingPackage,
        repurchaseRequirement: updatedRequirements,
      });
    } else {
      const updatedRequirements = [...newPackage.repurchaseRequirement];
      updatedRequirements[index] = value;
      setNewPackage({
        ...newPackage,
        repurchaseRequirement: updatedRequirements,
      });
    }
  };

  const handleSavePackage = () => {
    if (!newPackage.name || !newPackage.price) {
      alert("Please fill in all required fields");
      return;
    }

    const packageToSave = {
      id: Date.now(),
      name: newPackage.name,
      price: parseFloat(newPackage.price),
      benefits: newPackage.benefits.filter((b) => b.trim() !== ""),
      directBonus: newPackage.directBonus,
      levelIncome: [...newPackage.levelIncome],
      repurchaseRequirement: [...newPackage.repurchaseRequirement],
      status: "active",
    };

    setPackages([...packages, packageToSave]);
    setNewPackage({
      name: "",
      price: "",
      benefits: [""],
      directBonus: 5,
      levelIncome: [20, 10, 10, 5, 5, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2],
      repurchaseRequirement: [
        1,
        2,
        3,
        4,
        5,
        "After 5th level 1 direct 2 level opening",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
    });
    setActiveTab("view");
  };

  const handleEditPackage = (pkg) => {
    setEditingPackage({
      ...pkg,
      levelIncome: [...pkg.levelIncome],
      repurchaseRequirement: [...pkg.repurchaseRequirement],
    });
  };

  const handleUpdatePackage = () => {
    const updatedPackages = packages.map((pkg) =>
      pkg.id === editingPackage.id ? editingPackage : pkg
    );
    setPackages(updatedPackages);
    setEditingPackage(null);
  };

  const handleDeletePackage = (id) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      setPackages(packages.filter((pkg) => pkg.id !== id));
    }
  };

  const handleToggleStatus = (id) => {
    const updatedPackages = packages.map((pkg) =>
      pkg.id === id
        ? { ...pkg, status: pkg.status === "active" ? "inactive" : "active" }
        : pkg
    );
    setPackages(updatedPackages);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Package Management System
          </h1>
          <p className="text-gray-600">
            Manage MLM packages and 15-level commission structure
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6 bg-white rounded-lg p-1 shadow-sm border">
          <button
            onClick={() => setActiveTab("view")}
            className={`flex items-center px-6 py-3 rounded-md font-medium transition-all ${
              activeTab === "view"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
            }`}
          >
            <Eye className="w-5 h-5 mr-2" />
            View All Packages
          </button>
          <button
            onClick={() => setActiveTab("add")}
            className={`flex items-center px-6 py-3 rounded-md font-medium transition-all ${
              activeTab === "add"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
            }`}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Package
          </button>
        </div>

        {/* View All Packages Tab */}
        {activeTab === "view" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
                >
                  {editingPackage && editingPackage.id === pkg.id ? (
                    /* Edit Mode */
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Edit Package
                        </h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={handleUpdatePackage}
                            className="flex items-center px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                          >
                            <Save className="w-4 h-4 mr-1" />
                            Save
                          </button>
                          <button
                            onClick={() => setEditingPackage(null)}
                            className="flex items-center px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Cancel
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Package Name
                          </label>
                          <input
                            type="text"
                            value={editingPackage.name}
                            onChange={(e) =>
                              setEditingPackage({
                                ...editingPackage,
                                name: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price ($)
                          </label>
                          <input
                            type="number"
                            value={editingPackage.price}
                            onChange={(e) =>
                              setEditingPackage({
                                ...editingPackage,
                                price: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Direct Bonus (%)
                          </label>
                          <input
                            type="number"
                            value={editingPackage.directBonus}
                            onChange={(e) =>
                              setEditingPackage({
                                ...editingPackage,
                                directBonus: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Benefits
                          </label>
                          {editingPackage.benefits.map((benefit, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2 mb-2"
                            >
                              <input
                                type="text"
                                value={benefit}
                                onChange={(e) =>
                                  handleBenefitChange(
                                    index,
                                    e.target.value,
                                    true
                                  )
                                }
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                placeholder="Enter benefit"
                              />
                              <button
                                onClick={() => handleRemoveBenefit(index, true)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => handleAddBenefit(true)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            + Add Benefit
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* View Mode */
                    <div>
                      {/* Package Header */}
                      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold mb-1">
                              {pkg.name}
                            </h3>
                            <p className="text-2xl font-bold">${pkg.price}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                pkg.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {pkg.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Package Content */}
                      <div className="p-4">
                        {/* Benefits */}
                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-800 mb-2 flex items-center text-sm">
                            <Award className="w-4 h-4 mr-2" />
                            Benefits
                          </h4>
                          <ul className="space-y-1">
                            {pkg.benefits.slice(0, 3).map((benefit, index) => (
                              <li
                                key={index}
                                className="flex items-center text-sm text-gray-600"
                              >
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                                {benefit}
                              </li>
                            ))}
                            {pkg.benefits.length > 3 && (
                              <li className="text-sm text-gray-500">
                                +{pkg.benefits.length - 3} more benefits
                              </li>
                            )}
                          </ul>
                        </div>

                        {/* Commission Info */}
                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-800 mb-2 flex items-center text-sm">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Commission Structure
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">
                                Direct Bonus:
                              </span>
                              <span className="font-medium text-green-600">
                                {pkg.directBonus}%
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Level 1-2:</span>
                              <span className="font-medium">
                                {pkg.levelIncome[0]}%, {pkg.levelIncome[1]}%
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Level 3-5:</span>
                              <span className="font-medium">
                                {pkg.levelIncome[2]}%, {pkg.levelIncome[3]}%,{" "}
                                {pkg.levelIncome[4]}%
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Level 6-15:</span>
                              <span className="font-medium">3%-2% range</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-between items-center pt-4 border-t">
                          <button
                            onClick={() => handleEditPackage(pkg)}
                            className="flex items-center px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors text-sm"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </button>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleToggleStatus(pkg.id)}
                              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                pkg.status === "active"
                                  ? "bg-orange-50 text-orange-600 hover:bg-orange-100"
                                  : "bg-green-50 text-green-600 hover:bg-green-100"
                              }`}
                            >
                              {pkg.status === "active"
                                ? "Deactivate"
                                : "Activate"}
                            </button>
                            <button
                              onClick={() => handleDeletePackage(pkg.id)}
                              className="px-3 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors text-sm"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add New Package Tab */}
        {activeTab === "add" && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Add New Package
                  </h3>
                  <p className="text-green-100">
                    Create a new MLM package with 15-level commission structure
                  </p>
                </div>
                <button
                  onClick={handleSavePackage}
                  className="flex items-center px-6 py-3 bg-white text-green-600 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Save Package
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Package Details */}
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                      <Package className="w-5 h-5 mr-2" />
                      Package Details
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Package Name *
                        </label>
                        <input
                          type="text"
                          value={newPackage.name}
                          onChange={(e) =>
                            setNewPackage({
                              ...newPackage,
                              name: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter package name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price ($) *
                        </label>
                        <input
                          type="number"
                          value={newPackage.price}
                          onChange={(e) =>
                            setNewPackage({
                              ...newPackage,
                              price: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter price"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Direct Bonus (%)
                        </label>
                        <input
                          type="number"
                          value={newPackage.directBonus}
                          onChange={(e) =>
                            setNewPackage({
                              ...newPackage,
                              directBonus: parseFloat(e.target.value) || 5,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Default: 5%"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Benefits
                        </label>
                        {newPackage.benefits.map((benefit, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2 mb-2"
                          >
                            <input
                              type="text"
                              value={benefit}
                              onChange={(e) =>
                                handleBenefitChange(index, e.target.value)
                              }
                              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter benefit"
                            />
                            <button
                              onClick={() => handleRemoveBenefit(index)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => handleAddBenefit()}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          + Add Benefit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 15-Level Commission Structure */}
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Team Re-purchase Level Bonus (15 Levels)
                    </h4>

                    {/* Commission Table */}
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-green-600 text-white">
                        <div className="grid grid-cols-3 gap-0">
                          <div className="px-4 py-3 font-semibold text-center border-r border-green-500">
                            LEVELS
                          </div>
                          <div className="px-4 py-3 font-semibold text-center border-r border-green-500">
                            BONUS (%)
                          </div>
                          <div className="px-4 py-3 font-semibold text-center">
                            DIRECT MEMBER RE-PURCHASE
                          </div>
                        </div>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {levelLabels.map((label, index) => (
                          <div
                            key={index}
                            className={`grid grid-cols-3 gap-0 ${
                              index % 2 === 0 ? "bg-gray-50" : "bg-white"
                            }`}
                          >
                            <div className="px-4 py-3 text-center border-r border-gray-200 font-medium text-gray-700">
                              {label}
                            </div>
                            <div className="px-4 py-3 text-center border-r border-gray-200">
                              <input
                                type="number"
                                value={newPackage.levelIncome[index]}
                                onChange={(e) =>
                                  handleLevelIncomeChange(index, e.target.value)
                                }
                                className="w-full px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="0"
                              />
                            </div>
                            <div className="px-4 py-3 text-center">
                              <input
                                type="text"
                                value={newPackage.repurchaseRequirement[index]}
                                onChange={(e) =>
                                  handleRepurchaseChange(index, e.target.value)
                                }
                                className="w-full px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                placeholder={
                                  index < 5 ? (index + 1).toString() : ""
                                }
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Note:</strong> Monthly level bonus will get up
                        to 3 months. Bonus will be calculated upon monthly
                        loyalty bonus.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackageManager;
