import React, { useState, useEffect } from "react";
import { Plus, Edit2, X, Loader2 } from "lucide-react";
import axios from 'axios';

interface Package {
  id: number;
  plan_name: string;
  name: string;
  amount: number;
  direct_bonus: number;
  matching_value: number;
  growth_units: number;
  level_value: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PackageManager: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [formData, setFormData] = useState({
    plan_name: "",
    name: "",
    amount: "",
    directBonus: "",
    matchingValue: "",
    growthUnits: "",
    levelValue: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  useEffect(() => {
    fetchPackages();
  }, []);

  const getAuthHeaders = () => {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  };

  const fetchPackages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/packages`, getAuthHeaders());
      setPackages(response.data);
    } catch (error) {
      console.error('Error fetching packages:', error);
      setError('Failed to fetch packages. Please try again.');
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // Handle unauthorized access
        localStorage.removeItem('token');
        setToken(null);
        alert('Session expired. Please login again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.plan_name.trim()) errors.push('Plan Name is required');
    if (!formData.name.trim()) errors.push('Package Name is required');
    if (!formData.amount) errors.push('Amount is required');
    if (!formData.directBonus) errors.push('Direct Bonus is required');
    if (!formData.matchingValue) errors.push('Matching Value is required');
    if (!formData.growthUnits) errors.push('Growth Units is required');
    if (!formData.levelValue) errors.push('Level Value is required');

    if (errors.length > 0) {
      setError(errors.join('\n'));
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    setIsSubmitting(true);
    setError(null);

    // Prepare payload with trimmed strings and proper number conversion
    const payload = {
      plan_name: formData.plan_name.trim(),
      name: formData.name.trim(),
      amount: Number(formData.amount),
      direct_bonus: Number(formData.directBonus),
      matching_value: Number(formData.matchingValue),
      growth_units: Number(formData.growthUnits),
      level_value: Number(formData.levelValue)
    };

    // Debug the payload before sending
    console.log('Sending payload:', payload);

    const response = editingPackage
      ? await axios.put(`${API_BASE_URL}/packages/${editingPackage.id}`, payload, getAuthHeaders())
      : await axios.post(`${API_BASE_URL}/packages`, payload, getAuthHeaders());

    console.log('Server response:', response.data);
    
    await fetchPackages();
    handleCancel();
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error('Error response:', error.response.data);
        
        // Try to get detailed error message from server
        const serverError = error.response.data?.error || 
                          error.response.data?.message || 
                          JSON.stringify(error.response.data);
        
        setError(`Server error: ${serverError}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        setError('No response from server. Check your connection.');
      } else {
        // Something happened in setting up the request
        console.error('Request setup error:', error.message);
        setError('Request error: ' + error.message);
      }
    } else {
      // Non-Axios error
      console.error('Unexpected error:', error);
      setError('An unexpected error occurred');
    }
  } finally {
    setIsSubmitting(false);
  }
};

  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg);
    setFormData({
      plan_name: pkg.plan_name,
      name: pkg.name,
      amount: pkg.amount.toString(),
      directBonus: pkg.direct_bonus.toString(),
      matchingValue: pkg.matching_value.toString(),
      growthUnits: pkg.growth_units.toString(),
      levelValue: pkg.level_value.toString(),
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this package?')) {
      return;
    }

    try {
      await axios.delete(
        `${API_BASE_URL}/packages/${id}`,
        getAuthHeaders()
      );
      await fetchPackages();
    } catch (error) {
      console.error('Error deleting package:', error);
      setError('Failed to delete package. Please try again.');
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingPackage(null);
    setFormData({
      plan_name: "",
      name: "",
      amount: "",
      directBonus: "",
      matchingValue: "",
      growthUnits: "",
      levelValue: "",
    });
    setError(null);
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Unauthorized Access</h2>
          <p className="text-gray-600 mb-6">Please login to access the package management system.</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading && packages.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-lg text-gray-700">Loading packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Package Management
            </h1>
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
              >
                <Plus size={20} />
                Add Package
              </button>
            )}
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {showAddForm && (
            <div className="mb-8 bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  {editingPackage ? "Edit Package" : "Add New Package"}
                </h2>
                <button
                  onClick={handleCancel}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-md transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Plan Name*
                  </label>
                  <input
                    type="text"
                    name="plan_name"
                    value={formData.plan_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter plan name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Package Name*
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter package name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Package Amount ($)*
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter package amount"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Direct Bonus ($)*
                  </label>
                  <input
                    type="number"
                    name="directBonus"
                    value={formData.directBonus}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter direct bonus"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Matching Value ($)*
                  </label>
                  <input
                    type="number"
                    name="matchingValue"
                    value={formData.matchingValue}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter matching value"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Growth Units*
                  </label>
                  <input
                    type="number"
                    name="growthUnits"
                    value={formData.growthUnits}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter growth units"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Level Value ($)*
                  </label>
                  <input
                    type="number"
                    name="levelValue"
                    value={formData.levelValue}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter level value"
                  />
                </div>

                <div className="md:col-span-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    {editingPackage ? "Update Package" : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {packages.length > 0 ? (
            <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-blue-700 text-white">
                    <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                      Plan Name
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                      Package Name
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                      Amount ($)
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                      Direct Bonus ($)
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                      Matching Value ($)
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                      Growth Units
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                      Level Value ($)
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {packages.map((pkg, index) => (
                    <tr
                      key={pkg.id}
                      className={`hover:bg-blue-50 transition-colors duration-150 ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {pkg.plan_name}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {pkg.name}
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-medium">
                        {pkg.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-medium">
                        {pkg.direct_bonus.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-medium">
                        {pkg.matching_value.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-medium">
                        {pkg.growth_units}
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-medium">
                        {pkg.level_value.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <button
                          onClick={() => handleEdit(pkg)}
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 px-3 py-1 rounded-lg flex items-center gap-1 transition-all duration-200 font-medium"
                        >
                          <Edit2 size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(pkg.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-100 px-3 py-1 rounded-lg flex items-center gap-1 transition-all duration-200 font-medium"
                        >
                          <X size={16} />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No packages added yet.</p>
              <p className="text-gray-400 mt-2">
                Click "Add Package" to get started.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PackageManager;