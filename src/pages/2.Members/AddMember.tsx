import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Loader, AlertCircle } from "lucide-react";
import axios from 'axios';

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
    position: 'Left',
    password: '123456'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isFetchingSponsor, setIsFetchingSponsor] = useState(false);

  // Fetch sponsor name from backend
  const fetchSponsorName = async (memberId: string): Promise<string> => {
    setIsFetchingSponsor(true);
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
      console.error("Error fetching sponsor:", error);
      return "";
    } finally {
      setIsFetchingSponsor(false);
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Fetch sponsor name when sponsor code changes and has at least 4 characters
    if (name === "sponsorCode" && value.length >= 4) {
      try {
        const sponsorName = await fetchSponsorName(value);
        setFormData(prev => ({
          ...prev,
          sponsorName
        }));
      } catch (error) {
        setFormData(prev => ({
          ...prev,
          sponsorName: ""
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const confirmSubmission = async () => {
    setShowConfirmation(false);
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
          package: 'N/A',
          position: formData.position,
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

  const cancelSubmission = () => {
    setShowConfirmation(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'F2') {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Confirm Submission</h3>
            <p className="mb-6">Are you sure you want to submit this member information?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelSubmission}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                No, Cancel
              </button>
              <button
                onClick={confirmSubmission}
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Yes, Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 w-full flex items-center justify-center">
        <h1 className="text-xl font-medium">Membership Form</h1>
      </div>

      <div className="">
        <div className="max-w-7xl mx-auto bg-white shadow-sm border p-4">
          <form onSubmit={handleSubmit} onKeyDown={handleKeyPress}>
            
            {/* Joining Details Section */}
            <div className="mb-6">
              <h2 className="text-2xl font-medium text-red-600 mb-4">
                Joining Details
              </h2>

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
                  <div className="relative">
                    <input
                      type="text"
                      name="sponsorName"
                      value={formData.sponsorName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
                      required
                      readOnly
                    />
                    {isFetchingSponsor && (
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <Loader className="w-4 h-4 animate-spin text-blue-600" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Details Section */}
            <div className="mb-4">
              <h2 className="text-2xl font-medium text-purple-600 mb-3">
                Personal Details
              </h2>

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
                    min={new Date().toISOString().split("T")[0]}
                    max={new Date().toISOString().split("T")[0]}
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
                {isSubmitting ? "Submitting..." : "Submit (F2)"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMember;