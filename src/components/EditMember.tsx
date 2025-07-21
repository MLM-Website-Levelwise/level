import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Phone, MapPin } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EditMember = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    dateOfJoining: '',
    mobileNo: '',
    emailId: '',
    sponsorCode: '',
    sponsorName: '',
    package: 'Elite',
    password: '',
    position: 'Left' // Default value
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch member data
  useEffect(() => {
    const fetchMember = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/members/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch member');
        }
        
        const data = await response.json();
        setFormData({
          name: data.name,
          dateOfJoining: data.date_of_joining.split('T')[0],
          mobileNo: data.phone_number,
          emailId: data.email || '',
          sponsorCode: data.sponsor_code,
          sponsorName: data.sponsor_name,
          package: data.package,
          password: data.password,
          position: data.position || 'Left' // Fallback to 'Left' if not provided
        });
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        navigate('/members/view-members');
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id, toast, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const requestBody = {
      name: formData.name,
      phone_number: formData.mobileNo,
      email: formData.emailId || null,
      sponsor_code: formData.sponsorCode,
      sponsor_name: formData.sponsorName,
      package: formData.package,
      password: formData.password,
      date_of_joining: formData.dateOfJoining,
      position: formData.position
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/members/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update member');
      }

      toast({
        title: "Success",
        description: "Member updated successfully",
      });
      
      navigate('/members/view-members');
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading member data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200">
      {/* Header */}
      <div className="bg-purple-600 text-white px-6 py-4">
        <h1 className="text-xl font-medium">Edit Member</h1>
      </div>

      <div className="p-6">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <form onSubmit={handleSubmit}>
            {/* Personal Details Section */}
            <div className="mb-4">
              <h2 className="text-2xl font-medium text-blue-600 mb-3">Personal Details</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-gray-700 text-sm mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Mobile No */}
                <div>
                  <label className="block text-gray-700 text-sm mb-2">
                    Mobile No <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="mobileNo"
                    value={formData.mobileNo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Email Id */}
                <div>
                  <label className="block text-gray-700 text-sm mb-2">
                    Email Id
                  </label>
                  <input
                    type="email"
                    name="emailId"
                    value={formData.emailId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Joining Details Section */}
            <div className="mb-6">
              <h2 className="text-2xl font-medium text-red-600 mb-4">Joining Details</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Sponsor Code */}
                <div>
                  <label className="block text-gray-700 text-sm mb-2">
                    Sponsor Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="sponsorCode"
                    value={formData.sponsorCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Sponsor Name */}
                <div>
                  <label className="block text-gray-700 text-sm mb-2">
                    Sponsor Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="sponsorName"
                    value={formData.sponsorName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Package */}
                <div>
                  <label className="block text-gray-700 text-sm mb-2">
                    Package <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="package"
                    value={formData.package}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    <option value="Elite">Elite</option>
                  </select>
                </div>

                {/* Date of Joining */}
                <div>
                  <label className="block text-gray-700 text-sm mb-2">
                    Date of Joining <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="dateOfJoining"
                    value={formData.dateOfJoining}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-gray-700 text-sm mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Position */}
                <div>
                  <label className="block text-gray-700 text-sm mb-2">
                    Position <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    <option value="Left">Left</option>
                    <option value="Right">Right</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={() => navigate('/members/view-members')}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-8 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-8 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Updating...' : 'Update Member'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditMember;