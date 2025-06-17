import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

const AddMember = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    dateOfJoining: new Date().toISOString().split('T')[0],
    mobileNo: '',
    emailId: '',
    sponsorCode: '',
    sponsorName: '',
    position: 'Left', // Default to Left position
    password: '123456' // Default password
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    try {
      const response = await fetch('http://localhost:5000/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: formData.name,
          phone_number: formData.mobileNo,
          email: formData.emailId || null,
          sponsor_code: formData.sponsorCode,
          sponsor_name: formData.sponsorName,
          package: 'Basic', // Hardcoded as Basic
          position: formData.position, // Added position
          password: formData.password,
          date_of_joining: formData.dateOfJoining
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add member');
      }

      toast({
        title: "Success",
        description: "Member added successfully",
      });
      
      // Redirect to view members after successful addition
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'F2') {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200">
      {/* Header */}
      <div className="bg-purple-600 text-white px-6 py-4">
        <h1 className="text-xl font-medium">Membership Form</h1>
      </div>

      <div className="p-6">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <form onSubmit={handleSubmit} onKeyDown={handleKeyPress}>
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
                    min={new Date().toISOString().split('T')[0]}
                    max={new Date().toISOString().split('T')[0]}
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
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-8 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit (F2)'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMember;